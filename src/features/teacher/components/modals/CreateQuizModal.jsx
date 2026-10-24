import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Zap,
  PlusCircle,
  Trash2,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { DEFAULT_SCHOOL_CLASSROOMS } from '../../constants';

// Helper to format ISO to datetime-local string (YYYY-MM-DDTHH:mm)
function toLocalDatetimeString(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${y}-${m}-${d}T${h}:${min}`;
}

export default function CreateQuizModal({
  isOpen,
  onClose,
  permissions,
  onPublish
}) {
  const { isRestricted, assignedClasses } = permissions;
  const [submitting, setSubmitting] = useState(false);

  // Default deadline: 12 hours from now
  const defaultDeadline = new Date(Date.now() + 12 * 60 * 60 * 1000);

  const [form, setForm] = useState({
    title: '',
    targetClassroom: isRestricted ? (assignedClasses[0] || 'all') : 'all',
    dueDate: toLocalDatetimeString(defaultDeadline),
    suggestedMinutes: 15, // مدة الاختبار الفعلية من لحظة البدء
    instructions: 'أجب عن جميع الأسئلة بدقة خلال الوقت المحدد للاختبار.',
    driveUrl: '',
    questions: [
      {
        type: 1, // 1: MCQ, 2: T/F, 3: Text/Essay
        text: '',
        points: 5,
        options: ['', '', '', ''],
        correctIndex: 0,
        expectedAnswer: '',
        explanation: ''
      }
    ]
  });

  if (!isOpen) return null;

  // Preset deadline helpers
  const setQuickDeadlineHours = (hours) => {
    const target = new Date(Date.now() + hours * 60 * 60 * 1000);
    setForm((prev) => ({ ...prev, dueDate: toLocalDatetimeString(target) }));
  };

  const setQuickDurationMinutes = (mins) => {
    setForm((prev) => ({ ...prev, suggestedMinutes: mins }));
  };

  // Add Question
  const handleAddQuestion = (type = 1) => {
    const newQ = {
      type,
      text: '',
      points: 5,
      options: type === 1 ? ['', '', ''] : type === 2 ? ['صح', 'خطأ'] : [],
      correctIndex: 0,
      expectedAnswer: '',
      explanation: ''
    };
    setForm((prev) => ({ ...prev, questions: [...prev.questions, newQ] }));
  };

  // Remove Question
  const handleRemoveQuestion = (idx) => {
    if (form.questions.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  // Change Question field
  const handleQuestionChange = (idx, field, value) => {
    setForm((prev) => {
      const updated = [...prev.questions];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  // Change Question Type
  const handleQuestionTypeChange = (idx, newType) => {
    setForm((prev) => {
      const updated = [...prev.questions];
      const current = updated[idx];
      let newOptions = current.options;
      let newCorrectIndex = 0;

      if (newType === 1) {
        newOptions = current.options.length >= 2 ? current.options : ['', '', ''];
      } else if (newType === 2) {
        newOptions = ['صح', 'خطأ'];
        newCorrectIndex = 0;
      } else {
        newOptions = [];
      }

      updated[idx] = {
        ...current,
        type: newType,
        options: newOptions,
        correctIndex: newCorrectIndex
      };
      return { ...prev, questions: updated };
    });
  };

  // Options handling for MCQ
  const handleOptionChange = (qIdx, optIdx, value) => {
    setForm((prev) => {
      const updated = [...prev.questions];
      const opts = [...updated[qIdx].options];
      opts[optIdx] = value;
      updated[qIdx] = { ...updated[qIdx], options: opts };
      return { ...prev, questions: updated };
    });
  };

  const handleAddOption = (qIdx) => {
    setForm((prev) => {
      const updated = [...prev.questions];
      updated[qIdx] = {
        ...updated[qIdx],
        options: [...updated[qIdx].options, '']
      };
      return { ...prev, questions: updated };
    });
  };

  const handleRemoveOption = (qIdx, optIdx) => {
    setForm((prev) => {
      const updated = [...prev.questions];
      if (updated[qIdx].options.length <= 2) return prev; // Keep at least 2
      const opts = updated[qIdx].options.filter((_, i) => i !== optIdx);
      let corr = updated[qIdx].correctIndex;
      if (corr >= opts.length) corr = opts.length - 1;
      updated[qIdx] = { ...updated[qIdx], options: opts, correctIndex: corr };
      return { ...prev, questions: updated };
    });
  };

  const totalPoints = form.questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSubmitting(true);
    try {
      const stages = [
        {
          name: 'أسئلة الاختبار',
          orderIndex: 0,
          passingScorePercent: 60,
          questions: form.questions.map((q) => {
            const isMCQ = q.type === 1;
            const isTF = q.type === 2;
            const options = isMCQ
              ? q.options.filter((o) => o.trim() !== '')
              : isTF
              ? ['صح', 'خطأ']
              : [];

            const expectedAnswer = isMCQ
              ? (options[q.correctIndex] || '')
              : isTF
              ? (q.correctIndex === 0 ? 'صح' : 'خطأ')
              : (q.expectedAnswer || '');

            return {
              text: q.text.trim() || 'سؤال بدون عنوان',
              type: q.type,
              points: Number(q.points) || 5,
              explanation: q.explanation || '',
              options,
              correctIndex: q.correctIndex || 0,
              expectedAnswer
            };
          })
        }
      ];

      const payload = {
        title: form.title.trim(),
        instructions: form.instructions?.trim() || 'أجب عن الأسئلة التالية بدقة خلال الوقت المحدد للاختبار.',
        suggestedMinutes: Number(form.suggestedMinutes) || 15,
        resourceLinks: form.driveUrl?.trim() ? [form.driveUrl.trim()] : [],
        mode: 1,
        isPublished: true,
        assignToAll: form.targetClassroom === 'all',
        targetClassroom: form.targetClassroom === 'all' ? null : form.targetClassroom,
        assignmentType: 'quiz',
        phase: 1,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        stages
      };

      await onPublish(payload, form.targetClassroom, 'quiz');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 my-auto max-h-[92vh] overflow-y-auto space-y-6 text-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#5C2C90] to-[#E4007C] text-white flex items-center justify-center shadow-sm">
              <Zap size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">إنشاء اختبار قصير (Quiz)</h3>
                <span className="text-[11px] font-black bg-pink-100 text-[#E4007C] px-2.5 py-0.5 rounded-full">
                  ⚡ اختبار مؤقت
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                حدد ديدلاين الإتاحة، ومدة الحل بالدقائق، وأنشئ أسئلة الاختيار من متعدد والصح والخطأ والمقالي.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info */}
          <div className="space-y-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                عنوان الاختبار القصير <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: كويز 1: أساسيات الشبكات والراوتر أو كويز عملي: دوائر الاتصالات"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#5C2C90] shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الفصل المستهدف</label>
                <select
                  value={form.targetClassroom}
                  onChange={(e) => setForm((prev) => ({ ...prev, targetClassroom: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:border-[#5C2C90]"
                >
                  {isRestricted ? (
                    <>
                      <option value="all">جميع فصولك المسندة ({assignedClasses.join(', ')})</option>
                      {assignedClasses.map((cls) => (
                        <option key={cls} value={cls}>فصل {cls}</option>
                      ))}
                    </>
                  ) : (
                    <>
                      <option value="all">جميع فصول المدرسة 🌐</option>
                      {DEFAULT_SCHOOL_CLASSROOMS.map((cls) => (
                        <option key={cls} value={cls}>فصل {cls}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رابط ملف توضيحي أو شيت معمل (اختياري)
                </label>
                <input
                  type="url"
                  placeholder="رابط Google Drive أو GitHub..."
                  value={form.driveUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, driveUrl: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#5C2C90]"
                />
              </div>
            </div>

            {/* TWO TIME SETTINGS: DEADLINE vs DURATION */}
            <div className="p-4 rounded-2xl bg-white border border-purple-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-purple-100 pb-2.5">
                <Clock className="text-[#5C2C90]" size={18} />
                <span className="font-black text-sm text-slate-900">
                  ضبط التوقيت المزدوج للاختبار (ديدلاين الإتاحة + مدة الحل التنازلية)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Deadline (Available Until) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      1. آخر موعد للإتاحة (الديدلاين النهائي) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-bold">يقفل الاختبار بعده</span>
                  </div>
                  <input
                    type="datetime-local"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#5C2C90]"
                  />

                  {/* Quick Preset Buttons for Deadline */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold">إتاحة سريعة:</span>
                    <button
                      type="button"
                      onClick={() => setQuickDeadlineHours(6)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-50 text-[#5C2C90] hover:bg-purple-100 border border-purple-200 transition-colors"
                    >
                      6 ساعات
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDeadlineHours(12)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-50 text-[#5C2C90] hover:bg-purple-100 border border-purple-200 transition-colors"
                    >
                      12 ساعة
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDeadlineHours(24)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-50 text-[#5C2C90] hover:bg-purple-100 border border-purple-200 transition-colors"
                    >
                      24 ساعة (يوم)
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDeadlineHours(48)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-50 text-[#5C2C90] hover:bg-purple-100 border border-purple-200 transition-colors"
                    >
                      48 ساعة (يومان)
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    💡 يحدد الفترة الزمنية التي يُسمح للطلاب خلالها بالدخول وبدء الاختبار.
                  </p>
                </div>

                {/* 2. Duration / Countdown Timer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      2. مدة الاختبار الفعلية من لحظة البدء <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] font-mono font-bold text-[#E4007C]">عداد تنازلي</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={300}
                      required
                      value={form.suggestedMinutes}
                      onChange={(e) => setForm((prev) => ({ ...prev, suggestedMinutes: Number(e.target.value) || 15 }))}
                      className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-center focus:outline-none focus:border-[#5C2C90]"
                    />
                    <span className="text-xs font-bold text-slate-600">دقيقة للإجابة</span>
                  </div>

                  {/* Quick Preset Buttons for Duration */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold">مدد شائعة:</span>
                    {[10, 15, 20, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setQuickDurationMinutes(mins)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors ${
                          form.suggestedMinutes === mins
                            ? 'bg-[#E4007C] text-white shadow-2xs'
                            : 'bg-pink-50 text-[#E4007C] hover:bg-pink-100 border border-pink-200'
                        }`}
                      >
                        {mins} د
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    ⏱️ بمجرد ضغط الطالب على "بدء الاختبار"، يبدأ عداد تنازلي ويسلّم الحل أوتوماتيكياً عند انتهائه.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">تعليمات وتوجيهات الاختبار</label>
              <textarea
                rows={2}
                value={form.instructions}
                onChange={(e) => setForm((prev) => ({ ...prev, instructions: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#5C2C90]"
              />
            </div>
          </div>

          {/* QUESTIONS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900">
                  أسئلة الاختبار ({form.questions.length})
                </span>
                <span className="text-xs font-bold bg-purple-100 text-[#5C2C90] px-2.5 py-0.5 rounded-full font-mono">
                  إجمالي الدرجات: {totalPoints} درجة
                </span>
              </div>

              {/* Add Question Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddQuestion(1)}
                  className="bg-purple-50 hover:bg-purple-100 text-[#5C2C90] border border-purple-200 px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle size={14} />
                  <span>+ اختيار من متعدد</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion(2)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle size={14} />
                  <span>+ صح أم خطأ</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion(3)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle size={14} />
                  <span>+ مقالي</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {form.questions.map((q, qIdx) => {
                const isMCQ = q.type === 1;
                const isTF = q.type === 2;
                const isEssay = q.type === 3;

                return (
                  <div
                    key={qIdx}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-purple-300 transition-all space-y-4"
                  >
                    {/* Top Row: Q Number, Type selector, points, delete */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                          {qIdx + 1}
                        </span>

                        {/* Question Type Switcher */}
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => handleQuestionTypeChange(qIdx, 1)}
                            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                              isMCQ ? 'bg-white text-[#5C2C90] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            🔘 اختيار من متعدد
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuestionTypeChange(qIdx, 2)}
                            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                              isTF ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            ⚖️ صح أم خطأ
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuestionTypeChange(qIdx, 3)}
                            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                              isEssay ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            ✍️ سؤال مقالي
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                          <span>الدرجة:</span>
                          <input
                            type="number"
                            min={1}
                            max={100}
                            value={q.points}
                            onChange={(e) => handleQuestionChange(qIdx, 'points', Number(e.target.value) || 1)}
                            className="w-14 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono font-bold text-xs"
                          />
                        </div>

                        {form.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIdx)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="حذف هذا السؤال"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        نص السؤال <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={
                          isMCQ
                            ? 'اكتب نص السؤال، مثال: ما هو المنفذ الافتراضي لبروتوكول HTTPS؟'
                            : isTF
                            ? 'اكتب العبارة، مثال: بروتوكول UDP يوفر اتصالاً موثوقاً مع تأكيد الوصول.'
                            : 'اكتب نص السؤال المقالي، مثال: اشرح باختصار الفرق بين كابلات الألياف الضوئية وكابلات UTP.'
                        }
                        value={q.text}
                        onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#5C2C90] focus:bg-white"
                      />
                    </div>

                    {/* 1. Multiple Choice Options (Dynamic Count: 2, 3, 4, 5...) */}
                    {isMCQ && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>خيارات الإجابة (اختر الإجابة الصحيحة بالضغط على الدائرة 🔘):</span>
                          <button
                            type="button"
                            onClick={() => handleAddOption(qIdx)}
                            className="text-[#5C2C90] hover:text-[#421d69] font-black text-xs flex items-center gap-1 cursor-pointer bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <PlusCircle size={13} />
                            <span>+ إضافة خيار آخر</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = q.correctIndex === oIdx;
                            return (
                              <div
                                key={oIdx}
                                className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                  isCorrect
                                    ? 'bg-purple-50/70 border-purple-300 ring-1 ring-purple-300'
                                    : 'bg-white border-slate-200'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleQuestionChange(qIdx, 'correctIndex', oIdx)}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer transition-all ${
                                    isCorrect
                                      ? 'bg-[#5C2C90] text-white shadow-2xs'
                                      : 'bg-slate-100 text-slate-400 hover:bg-purple-100 hover:text-[#5C2C90]'
                                  }`}
                                  title="تحديد كإجابة صحيحة"
                                >
                                  {isCorrect ? '✓' : oIdx + 1}
                                </button>

                                <input
                                  type="text"
                                  required
                                  placeholder={`الخيار ${oIdx + 1}...`}
                                  value={opt}
                                  onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                  className="flex-1 bg-transparent border-none text-xs sm:text-sm font-semibold focus:outline-none"
                                />

                                {isCorrect && (
                                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                                    الإجابة الصحيحة
                                  </span>
                                )}

                                {q.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveOption(qIdx, oIdx)}
                                    className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 cursor-pointer"
                                    title="حذف هذا الخيار"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 2. True / False Selection */}
                    {isTF && (
                      <div className="space-y-2 pt-1">
                        <span className="block text-xs font-bold text-slate-600 mb-1">
                          الإجابة الصحيحة للعبارة:
                        </span>
                        <div className="grid grid-cols-2 gap-3 max-w-sm">
                          <button
                            type="button"
                            onClick={() => handleQuestionChange(qIdx, 'correctIndex', 0)}
                            className={`py-3 px-4 rounded-xl font-black text-sm transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                              q.correctIndex === 0
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                            }`}
                          >
                            <span>صح (True) ✅</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleQuestionChange(qIdx, 'correctIndex', 1)}
                            className={`py-3 px-4 rounded-xl font-black text-sm transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                              q.correctIndex === 1
                                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50'
                            }`}
                          >
                            <span>خطأ (False) ❌</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 3. Essay / Text Guidelines */}
                    {isEssay && (
                      <div className="space-y-2 pt-1">
                        <label className="block text-xs font-bold text-slate-700">
                          الإجابة النموذجية أو معايير التصحيح (تظهر لك أثناء تصحيح إجابة الطالب):
                        </label>
                        <textarea
                          rows={2}
                          placeholder="اكتب النقاط الرئيسية المطلوبة من الطالب لاعتماد الدرجة الكاملة..."
                          value={q.expectedAnswer}
                          onChange={(e) => handleQuestionChange(qIdx, 'expectedAnswer', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#5C2C90]"
                        />
                        <p className="text-[11px] text-slate-400">
                          📝 سيقوم الطالب بكتابة إجابته في مربع نصي كامل، ويمكنه أيضاً إرفاق رابط مشروع أو ملف.
                        </p>
                      </div>
                    )}

                    {/* Explanation / Notes */}
                    <div>
                      <input
                        type="text"
                        placeholder="توضيح الإجابة النموذجية أو ملحوظة تظهر للطالب بعد إنهاء الاختبار (اختياري)..."
                        value={q.explanation}
                        onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50/50 border border-slate-200/70 rounded-lg text-xs text-slate-600 focus:outline-none focus:border-[#5C2C90]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={submitting || form.questions.length === 0}
              className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white px-7 py-3 rounded-xl font-black text-sm shadow-md shadow-purple-900/15 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap size={16} />
              <span>
                {submitting
                  ? 'جاري نشر الاختبار...'
                  : `نشر الاختبار القصير (${form.questions.length} أسئلة · ${totalPoints} درجة)`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
