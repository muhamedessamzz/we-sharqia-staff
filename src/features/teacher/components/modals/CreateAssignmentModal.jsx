import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  BookOpen,
  Calendar,
  Clock,
  Link,
  FileText,
  Award,
  UploadCloud,
  CheckCircle2
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

export default function CreateAssignmentModal({
  isOpen,
  onClose,
  permissions,
  onPublish
}) {
  const { isRestricted, assignedClasses } = permissions;
  const [submitting, setSubmitting] = useState(false);

  // Default deadline: 3 days from now at 11:59 PM
  const defaultDeadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  defaultDeadline.setHours(23, 59, 0, 0);

  const [form, setForm] = useState({
    title: '',
    targetClassroom: isRestricted ? (assignedClasses[0] || 'all') : 'all',
    dueDate: toLocalDatetimeString(defaultDeadline),
    maxScore: 20,
    instructions: '',
    driveUrl: '',
    deliverablePrompt: 'قم برفع رابط المشروع (Google Drive أو GitHub) أو كتابة تقريرك والحل في المساحة المخصصة.'
  });

  if (!isOpen) return null;

  // Preset deadline helpers
  const setQuickDeadlineDays = (days) => {
    const target = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    target.setHours(23, 59, 0, 0);
    setForm((prev) => ({ ...prev, dueDate: toLocalDatetimeString(target) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSubmitting(true);
    try {
      const stages = [
        {
          name: 'متطلبات تسليم التكليف العملي',
          orderIndex: 0,
          passingScorePercent: 60,
          questions: [
            {
              text: form.deliverablePrompt.trim() || 'ارفع رابط الحل أو اكتب تقرير الإنجاز المطلوب.',
              type: 3, // Text / Link submission
              points: Number(form.maxScore) || 20,
              explanation: 'يتم استلام التسليمات ومراجعتها وتصحيحها ورصد الدرجة من قبل المعلم.',
              options: [],
              correctIndex: 0,
              expectedAnswer: 'رابط ملف Drive أو كود المشروع أو تقرير الحل'
            }
          ]
        }
      ];

      const payload = {
        title: form.title.trim(),
        instructions: form.instructions?.trim() || 'يرجى مراجعة متطلبات التكليف وإتمام المطلوب قبل الموعد النهائي المحدد.',
        suggestedMinutes: 0, // No countdown timer for assignments - deadline only
        resourceLinks: form.driveUrl?.trim() ? [form.driveUrl.trim()] : [],
        mode: 1,
        isPublished: true,
        assignToAll: form.targetClassroom === 'all',
        targetClassroom: form.targetClassroom === 'all' ? null : form.targetClassroom,
        assignmentType: 'assignment',
        phase: 1,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        stages
      };

      await onPublish(payload, form.targetClassroom, 'assignment');
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
        className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 my-auto max-h-[92vh] overflow-y-auto space-y-6 text-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#5C2C90] to-[#7938BE] text-white flex items-center justify-center shadow-sm">
              <BookOpen size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">إضافة واجب أو تكليف تطبيقي</h3>
                <span className="text-[11px] font-black bg-purple-100 text-[#5C2C90] px-2.5 py-0.5 rounded-full">
                  📘 تكليف عملي
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                حدد الفصل المستهدف، وشرح المهمة، ورابط ملف المعمل أو الشرح، والموعد النهائي للتسليم.
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              عنوان التكليف أو المشروع <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: مشروع عملي: توصيل وتأمين شبكة LAN أو إعداد تقرير الألياف الضوئية"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#5C2C90] focus:bg-white"
            />
          </div>

          {/* Classroom & Max Score */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الفصل المستهدف</label>
              <select
                value={form.targetClassroom}
                onChange={(e) => setForm((prev) => ({ ...prev, targetClassroom: e.target.value }))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:border-[#5C2C90]"
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
                الدرجة المستحقة للتكليف <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={form.maxScore}
                  onChange={(e) => setForm((prev) => ({ ...prev, maxScore: Number(e.target.value) || 20 }))}
                  className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-center focus:outline-none focus:border-[#5C2C90]"
                />
                <span className="text-xs font-bold text-slate-600">درجة / نجوم تقييم</span>
              </div>
            </div>
          </div>

          {/* DEADLINE ONLY (No Countdown Timer) */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="text-[#5C2C90]" size={18} />
                <span className="font-black text-sm text-slate-900">
                  آخر موعد لتسليم التكليف (الديدلاين النهائي) <span className="text-rose-500">*</span>
                </span>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                تاريخ ووقت
              </span>
            </div>

            <input
              type="datetime-local"
              required
              value={form.dueDate}
              onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#5C2C90]"
            />

            {/* Quick Preset Buttons for Assignment Deadline */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-bold">ديدلاين سريع:</span>
              <button
                type="button"
                onClick={() => setQuickDeadlineDays(1)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-[#5C2C90] hover:bg-purple-100 border border-purple-200 transition-colors"
              >
                غداً بنهاية اليوم (24 س)
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadlineDays(3)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-[#5C2C90] hover:bg-purple-100 border border-purple-200 transition-colors"
              >
                خلال 3 أيام
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadlineDays(7)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-[#5C2C90] hover:bg-purple-100 border border-purple-200 transition-colors"
              >
                خلال أسبوع
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadlineDays(14)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-[#5C2C90] hover:bg-purple-100 border border-purple-200 transition-colors"
              >
                خلال أسبوعين
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              📅 يسجل النظام تلقائياً وقت وتاريخ تسليم كل طالب، ويوضح ما إذا كان التسليم في الموعد أو بعد انقضاء الديدلاين.
            </p>
          </div>

          {/* Drive or GitHub Attachment Link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              رابط ملف الشرح أو شيت المعمل أو كود البداية (اختياري)
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://drive.google.com/... أو https://github.com/..."
                value={form.driveUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, driveUrl: e.target.value }))}
                className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#5C2C90] focus:bg-white"
              />
              <Link size={16} className="absolute right-3.5 top-3 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              💡 يمكن للطلاب معاينة ملفات Google Drive مباشرة داخل المنصة بنقرة واحدة.
            </p>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              شرح وتفاصيل التكليف والمطلوب إنجازه <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="اكتب هنا المتطلبات المحددة للتكليف، المعايير الفنية، الخطوات المطلوبة، وما يجب على الطالب رفعه وتسليمه..."
              value={form.instructions}
              onChange={(e) => setForm((prev) => ({ ...prev, instructions: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#5C2C90] focus:bg-white leading-relaxed"
            />
          </div>

          {/* Deliverable requirements prompt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              تعليمات صندوق التسليم للطالب
            </label>
            <input
              type="text"
              value={form.deliverablePrompt}
              onChange={(e) => setForm((prev) => ({ ...prev, deliverablePrompt: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#5C2C90]"
            />
          </div>

          {/* Actions */}
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
              disabled={submitting || !form.title.trim()}
              className="bg-gradient-to-r from-[#5C2C90] to-[#7938BE] hover:opacity-95 text-white px-7 py-3 rounded-xl font-black text-sm shadow-md shadow-purple-900/15 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UploadCloud size={16} />
              <span>{submitting ? 'جاري نشر التكليف...' : `نشر التكليف العملي (${form.maxScore} درجة)`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
