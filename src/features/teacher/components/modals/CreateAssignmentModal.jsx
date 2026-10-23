import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Zap, BookOpen, PlusCircle, Send, Eye } from 'lucide-react';
import { INITIAL_QUIZ_FORM, DEFAULT_SCHOOL_CLASSROOMS } from '../../constants';
import DrivePreviewModal from '../../../../components/modals/DrivePreviewModal';

export default function CreateAssignmentModal({
  isOpen,
  onClose,
  createType,
  setCreateType,
  permissions,
  onPublish
}) {
  const { isRestricted, assignedClasses } = permissions;
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(INITIAL_QUIZ_FORM);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    setForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          points: 5,
          options: ['', '', '', ''],
          correctIndex: 0,
          explanation: ''
        }
      ]
    }));
  };

  const handleRemoveQuestion = (idx) => {
    if (form.questions.length <= 1) return;
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  const handleQuestionChange = (idx, field, value) => {
    setForm(prev => {
      const updated = [...prev.questions];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    setForm(prev => {
      const updated = [...prev.questions];
      const opts = [...updated[qIdx].options];
      opts[optIdx] = value;
      updated[qIdx] = { ...updated[qIdx], options: opts };
      return { ...prev, questions: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSubmitting(true);
    try {
      const stages = [
        {
          name: createType === 'quiz' ? 'أسئلة الاختبار' : 'المرحلة الأولى: التطبيق',
          orderIndex: 0,
          passingScorePercent: 60,
          questions: form.questions.map(q => ({
            text: q.text || 'سؤال بدون عنوان',
            type: 1, // Multiple choice
            points: Number(q.points) || 5,
            explanation: q.explanation || '',
            options: q.options.filter(o => o.trim() !== ''),
            correctIndex: q.correctIndex || 0,
            expectedAnswer: q.options[q.correctIndex] || ''
          }))
        }
      ];

      const payload = {
        title: form.title.trim(),
        instructions: form.instructions?.trim() || (createType === 'quiz' ? 'أجب عن الأسئلة التالية بدقة.' : 'أكمل المطلوب من التكليف بدقة وراجع إجاباتك.'),
        suggestedMinutes: Number(form.suggestedMinutes) || 15,
        resourceLinks: form.driveUrl?.trim() ? [form.driveUrl.trim()] : [],
        mode: 1,
        isPublished: true,
        assignToAll: form.targetClassroom === 'all',
        targetClassroom: form.targetClassroom === 'all' ? null : form.targetClassroom,
        assignmentType: createType,
        phase: 1,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        stages
      };

      await onPublish(payload, form.targetClassroom, createType);
      setForm(INITIAL_QUIZ_FORM);
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
        className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 my-auto max-h-[90vh] overflow-y-auto space-y-5 text-right"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5C2C90] to-[#E4007C] text-white flex items-center justify-center shadow-xs">
              {createType === 'quiz' ? <Zap size={20} /> : <BookOpen size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {createType === 'quiz' ? 'إنشاء اختبار قصير' : 'إضافة واجب أو تكليف جديد'}
              </h3>
              <p className="text-xs text-slate-500">
                أدخل تفاصيل التكليف والأسئلة ودرجات كل سؤال وحدد الفصل المستهدف.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Type Switcher */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setCreateType('quiz')}
            className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              createType === 'quiz' 
                ? 'bg-white text-[#E4007C] shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap size={15} />
            <span>اختبار قصير (اختيار من متعدد)</span>
          </button>

          <button
            type="button"
            onClick={() => setCreateType('assignment')}
            className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              createType === 'assignment' 
                ? 'bg-white text-[#5C2C90] shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen size={15} />
            <span>واجب أو تكليف تطبيقي</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              عنوان {createType === 'quiz' ? 'الاختبار' : 'الواجب'} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={createType === 'quiz' ? 'مثال: اختبار قصير: أساسيات الشبكات' : 'مثال: إعداد وتوصيل أجهزة الشبكة'}
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#5C2C90] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الفصل</label>
              <select
                value={form.targetClassroom}
                onChange={(e) => setForm(prev => ({ ...prev, targetClassroom: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:border-[#5C2C90]"
              >
                {isRestricted ? (
                  <>
                    <option value="all">جميع فصولك ({assignedClasses.join(', ')})</option>
                    {assignedClasses.map(cls => (
                      <option key={cls} value={cls}>فصل {cls}</option>
                    ))}
                  </>
                ) : (
                  <>
                    <option value="all">جميع الفصول</option>
                    {DEFAULT_SCHOOL_CLASSROOMS.map(cls => (
                      <option key={cls} value={cls}>فصل {cls}</option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المدة (بالدقائق)</label>
              <input
                type="number"
                min={5}
                max={180}
                value={form.suggestedMinutes}
                onChange={(e) => setForm(prev => ({ ...prev, suggestedMinutes: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-[#5C2C90]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">آخر موعد للتسليم</label>
              <input
                type="datetime-local"
                value={form.dueDate}
                onChange={(e) => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#5C2C90]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">التعليمات</label>
            <textarea
              rows={2}
              placeholder="اكتب تعليمات أو توجيهات للطلاب..."
              value={form.instructions}
              onChange={(e) => setForm(prev => ({ ...prev, instructions: e.target.value }))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#5C2C90] focus:bg-white"
            />
          </div>

          {/* Google Drive Material / Lab Sheet Link */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                ملف الشرح أو شيت المعمل (Google Drive)
              </label>
              {form.driveUrl && (
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="text-[11px] font-bold text-[#5C2C90] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Eye size={12} />
                  <span>معاينة الرابط داخل المنصة 👁️</span>
                </button>
              )}
            </div>
            <input
              type="url"
              placeholder="الصق رابط ملف الشرح أو شيت المعمل من Google Drive هنا (https://drive.google.com/...)"
              value={form.driveUrl || ''}
              onChange={(e) => setForm(prev => ({ ...prev, driveUrl: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#5C2C90] focus:bg-white text-left font-mono"
              dir="ltr"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              💡 ارفع الملف على درايف واجعل المشاركة (أي شخص لديه الرابط)، وسيُعرض مباشرة للطلاب داخل المنصة.
            </p>
          </div>

          {/* Questions Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800">
                أسئلة {createType === 'quiz' ? 'الاختبار' : 'الواجب'} ({form.questions.length})
              </span>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="text-xs font-bold text-[#5C2C90] hover:text-[#421d69] bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <PlusCircle size={13} />
                <span>+ إضافة سؤال</span>
              </button>
            </div>

            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {form.questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-[#5C2C90]">السؤال {qIdx + 1}:</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                        <span>الدرجة:</span>
                        <input
                          type="number"
                          min={1}
                          value={q.points}
                          onChange={(e) => handleQuestionChange(qIdx, 'points', e.target.value)}
                          className="w-12 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-center font-mono"
                        />
                      </div>
                      {form.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="حذف السؤال"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="نص السؤال..."
                    value={q.text}
                    onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#5C2C90]"
                  />

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = q.correctIndex === optIdx;
                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs transition-all ${
                            isCorrect 
                              ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300' 
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`correct_${qIdx}`}
                            checked={isCorrect}
                            onChange={() => handleQuestionChange(qIdx, 'correctIndex', optIdx)}
                            className="accent-emerald-600 cursor-pointer"
                            title="تحديد كإجابة صحيحة"
                          />
                          <input
                            type="text"
                            placeholder={`الخيار ${optIdx + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                            className="flex-1 bg-transparent border-none text-xs focus:outline-none text-right"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-purple-900/15 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send size={15} />
              <span>{submitting ? 'جارٍ النشر...' : `نشر ${createType === 'quiz' ? 'الاختبار' : 'الواجب'}`}</span>
            </button>
          </div>
        </form>
      </div>

      <DrivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        url={form.driveUrl}
        title={form.title || 'ملف التكليف المرفق'}
      />
    </div>,
    document.body
  );
}
