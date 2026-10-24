import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  PenTool,
  CheckCircle2,
  Eye,
  ExternalLink,
  FileText,
  Clock,
  Calendar,
  Timer,
  AlertTriangle,
  Zap,
  BookOpen
} from 'lucide-react';
import { INITIAL_GRADING_FORM } from '../../constants';
import DrivePreviewModal from '../../../../components/modals/DrivePreviewModal';
import { extractDriveUrl } from '../../../../utils/driveUtils';
import { formatDateTimeArabic, calculateDurationArabic } from '../../../../utils/dateUtils';

export default function GradingModal({ submission, onClose, onSaveGrade }) {
  const [form, setForm] = useState(INITIAL_GRADING_FORM);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (submission) {
      setForm({
        grade: submission.manualGrade ?? submission.autoScore ?? 10,
        feedback: submission.teacherFeedback || 'أحسنت، عمل متميز.',
        returnForRevision: false
      });
    }
  }, [submission]);

  if (!submission) return null;

  const isQuiz = submission.assignmentType === 'quiz';
  const durationStr = calculateDurationArabic(submission.startedAtUtc, submission.finishedAtUtc);
  const detectedDriveUrl = submission.driveLink || extractDriveUrl(submission.answersJson || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveGrade(submission.id, form, submission.studentName);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-7 shadow-2xl border border-slate-200/80 my-auto max-h-[92vh] overflow-y-auto space-y-4 text-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold">
              <PenTool size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">مراجعة وتصحيح إجابة الطالب</h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  isQuiz ? 'bg-pink-50 text-[#E4007C] border-pink-200' : 'bg-purple-50 text-[#5C2C90] border-purple-200'
                }`}>
                  {isQuiz ? '⚡ اختبار قصير' : '📝 تكليف عملي'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                تفاصيل توقيت البدء، ووقت التسليم، ومستغرق الحل، والدرجات المرصودة.
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

        {/* Student Name Banner */}
        <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 flex items-center justify-between text-xs">
          <div>
            <span className="font-extrabold text-slate-900 text-sm block">{submission.studentName}</span>
            <span className="text-slate-500 font-semibold">{submission.assignmentTitle} · فصل {submission.classroom}</span>
          </div>
          <div className="text-left font-mono">
            <span className="text-slate-400 block text-[10px]">الدرجة التلقائية</span>
            <span className="font-black text-[#5C2C90] text-sm">{submission.autoScore} نقطة</span>
          </div>
        </div>

        {/* Timestamps & Solution Duration Card */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block flex items-center gap-1">
              <Clock size={11} className="text-[#5C2C90]" />
              <span>بدأ الاختبار في:</span>
            </span>
            <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5">
              {formatDateTimeArabic(submission.startedAtUtc)}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold block flex items-center gap-1">
              <Calendar size={11} className="text-[#E4007C]" />
              <span>تم التسليم في:</span>
            </span>
            <span className="font-mono font-bold text-slate-800 text-[11px] block mt-0.5">
              {formatDateTimeArabic(submission.finishedAtUtc)}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 font-bold block flex items-center gap-1">
              <Timer size={11} className="text-emerald-600" />
              <span>الوقت المستغرق:</span>
            </span>
            <span className="font-mono font-black text-purple-900 bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-xs inline-block mt-0.5">
              {durationStr}
            </span>
          </div>

          {/* Deadline Compliance Badge */}
          <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">حالة الالتزام بموعد التسليم:</span>
            {submission.isLate ? (
              <span className="text-[11px] font-black text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <AlertTriangle size={12} />
                <span>تم التسليم بعد انقضاء الديدلاين (متأخر)</span>
              </span>
            ) : submission.finishedAtUtc ? (
              <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>تم التسليم في الموعد المحدد</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-600">قيد الحل والتنفيذ</span>
            )}
          </div>
        </div>

        {/* Display Answers if available */}
        {submission.answersJson && (
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-700 block">إجابات وتسليم الطالب:</span>
            <div className="bg-white p-3 rounded-xl border border-slate-200/70 font-mono text-[11px] max-h-40 overflow-y-auto leading-relaxed text-slate-800">
              {(() => {
                try {
                  const parsed = JSON.parse(submission.answersJson);
                  return Object.entries(parsed).map(([k, v]) => (
                    <div key={k} className="py-1 border-b border-slate-50 last:border-none flex justify-between items-start gap-2">
                      <span className="text-slate-500 font-bold shrink-0">سؤال {Number(k) + 1 || k}:</span>
                      <span className="text-purple-700 font-semibold text-left break-all">{String(v)}</span>
                    </div>
                  ));
                } catch (e) {
                  return submission.answersJson;
                }
              })()}
            </div>
          </div>
        )}

        {/* Student Project / Drive File In-Platform Preview Card */}
        {detectedDriveUrl && (
          <div className="bg-gradient-to-r from-purple-50 via-white to-pink-50 p-3.5 rounded-2xl border border-purple-200 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#5C2C90] text-white flex items-center justify-center shrink-0">
                <FileText size={16} />
              </div>
              <div className="min-w-0">
                <span className="font-black text-xs text-slate-900 block truncate">
                  ملف تسليم الطالب متاح (Google Drive)
                </span>
                <span className="text-[10px] text-slate-400 font-mono block truncate" dir="ltr">
                  {detectedDriveUrl}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPreviewUrl(detectedDriveUrl)}
              className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs hover:opacity-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Eye size={13} />
              <span>معاينة في المنصة 👁️</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Grade Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">الدرجة المعتمدة للطالب</label>
              <span className="text-[11px] text-purple-700 font-bold font-mono">نقاط التقييم</span>
            </div>
            <input
              type="number"
              min={0}
              max={100}
              value={form.grade}
              onChange={(e) => setForm((prev) => ({ ...prev, grade: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-[#5C2C90]"
              required
            />
          </div>

          {/* Feedback Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات وتوجيهات المعلم (تظهر للطالب بوضوح)</label>
            <textarea
              rows={2}
              value={form.feedback}
              onChange={(e) => setForm((prev) => ({ ...prev, feedback: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#5C2C90]"
              placeholder="مثال: إجابة ممتازة، ركز في خطوات التوصيل العملي القادمة..."
            />
          </div>

          {/* Return for Revision Checkbox */}
          <div className="flex items-center gap-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
            <input
              type="checkbox"
              id="returnForRevision"
              checked={form.returnForRevision}
              onChange={(e) => setForm((prev) => ({ ...prev, returnForRevision: e.target.checked }))}
              className="w-4 h-4 text-[#5C2C90] rounded focus:ring-purple-500 cursor-pointer"
            />
            <label htmlFor="returnForRevision" className="text-xs font-bold text-amber-900 cursor-pointer">
              إعادة التكليف للطالب للمراجعة والتعديل (إعادة فتح التسليم للطالب) ↺
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-purple-900/15 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 size={15} />
              <span>{saving ? 'جاري الرصد...' : form.returnForRevision ? 'إعادة للطالب للمراجعة' : 'اعتماد ورصد الدرجة'}</span>
            </button>
          </div>
        </form>

        {/* Drive Preview Modal */}
        <DrivePreviewModal
          isOpen={!!previewUrl}
          onClose={() => setPreviewUrl(null)}
          url={previewUrl}
          title={`تسليم الطالب: ${submission.studentName}`}
        />
      </div>
    </div>,
    document.body
  );
}
