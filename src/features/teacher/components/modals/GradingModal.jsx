import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, PenTool, CheckCircle2, Eye, ExternalLink, FileText } from 'lucide-react';
import { INITIAL_GRADING_FORM } from '../../constants';
import DrivePreviewModal from '../../../../components/modals/DrivePreviewModal';
import { extractDriveUrl } from '../../../../utils/driveUtils';

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
        className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-7 shadow-2xl border border-slate-200/80 my-auto max-h-[90vh] overflow-y-auto space-y-4 text-right"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold">
              <PenTool size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">تصحيح إجابة الطالب</h3>
              <p className="text-xs text-slate-500">
                راجع إجابات الطالب، وسجل الدرجة والملاحظات.
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

        {/* Student & Submission Info Banner */}
        <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 flex items-center justify-between text-xs">
          <div>
            <span className="font-extrabold text-slate-900 text-sm block">{submission.studentName}</span>
            <span className="text-slate-500">{submission.assignmentTitle} · فصل {submission.classroom}</span>
          </div>
          <div className="text-left font-mono">
            <span className="text-slate-400 block text-[10px]">الدرجة التلقائية</span>
            <span className="font-black text-[#5C2C90] text-sm">{submission.autoScore} نقطة</span>
          </div>
        </div>

        {/* Display Answers if available */}
        {submission.answersJson && (
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-700 block">إجابات الطالب:</span>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 font-mono text-[11px] max-h-36 overflow-y-auto leading-relaxed text-slate-800">
              {(() => {
                try {
                  const parsed = JSON.parse(submission.answersJson);
                  return Object.entries(parsed).map(([k, v]) => (
                    <div key={k} className="py-0.5 border-b border-slate-50 last:border-none flex justify-between">
                      <span className="text-slate-500 font-bold">{k}:</span>
                      <span className="text-purple-700 font-semibold">{String(v)}</span>
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
              <label className="text-xs font-bold text-slate-700">الدرجة المستحقة</label>
              <span className="text-[11px] text-purple-700 font-bold font-mono">من 20 درجة</span>
            </div>
            <input
              type="number"
              min={0}
              max={100}
              required
              value={form.grade}
              onChange={(e) => setForm(prev => ({ ...prev, grade: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-black font-mono focus:outline-none focus:border-[#5C2C90] focus:bg-white text-center"
            />
          </div>

          {/* Feedback Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظات وتوجيهات للطالب
            </label>
            <textarea
              rows={3}
              placeholder="اكتب ملاحظاتك وتوجيهك للطالب..."
              value={form.feedback}
              onChange={(e) => setForm(prev => ({ ...prev, feedback: e.target.value }))}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#5C2C90] focus:bg-white leading-relaxed"
            />
          </div>

          {/* Return for revision checkbox */}
          <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-amber-900 block">طلب إعادة المحاولة من الطالب</span>
              <span className="text-[11px] text-amber-800">إتاحة فرصة للطالب لإعادة المحاولة وفق الملاحظات المدونة.</span>
            </div>
            <input
              type="checkbox"
              checked={form.returnForRevision}
              onChange={(e) => setForm(prev => ({ ...prev, returnForRevision: e.target.checked }))}
              className="w-5 h-5 accent-amber-600 rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-purple-900/15 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              <span>{saving ? 'جارٍ الحفظ...' : (form.returnForRevision ? 'إعادة التكليف للطالب' : 'حفظ الدرجة')}</span>
            </button>
          </div>
        </form>
      </div>

      <DrivePreviewModal
        isOpen={!!previewUrl}
        onClose={() => setPreviewUrl(null)}
        url={previewUrl}
        title={`مشروع الطالب: ${submission.studentName} · ${submission.assignmentTitle}`}
      />
    </div>,
    document.body
  );
}
