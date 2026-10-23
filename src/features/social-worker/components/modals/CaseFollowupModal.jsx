import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function CaseFollowupModal({
  activeCase,
  onClose,
  onSubmit,
  counselorName,
}) {
  const [note, setNote] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [newStatus, setNewStatus] = useState(activeCase?.status || 'inSupport');
  const [submitting, setSubmitting] = useState(false);

  if (!activeCase) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(activeCase.id, {
        note: note.trim(),
        recommendation: recommendation.trim(),
        counselorName: counselorName || 'الأخصائي الاجتماعي',
        newStatus: newStatus || undefined,
      });
      onClose();
    } catch (err) {
      alert(err.message || 'حدث خطأ أثناء حفظ الجلسة');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 w-full max-w-lg border border-slate-200 shadow-2xl space-y-4 my-auto max-h-[90vh] overflow-y-auto text-right"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="font-black text-base text-slate-900">إضافة جلسة متابعة</h4>
            <p className="text-xs text-slate-500">الطالب: {activeCase.studentName} (فصل {activeCase.classroom})</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">ملخص الجلسة *</label>
            <textarea
              rows={3}
              required
              placeholder="موجز ما دار في الجلسة والملاحظات المرصودة..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">التوصيات والخطوات التالية</label>
            <input
              type="text"
              placeholder="مثال: متابعة درجات المعمل مع المعلم، استدعاء ولي الأمر..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">تحديث حالة الملف</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
            >
              <option value="inSupport">قيد الدعم والمتابعة</option>
              <option value="resolved">تحسن ملحوظ (مكتمل)</option>
              <option value="open">حالة جديدة</option>
            </select>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#5C2C90] hover:bg-[#4a2175] text-white py-2.5 rounded-xl font-bold cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'جارٍ الحفظ...' : 'حفظ الجلسة'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 text-slate-600 py-2.5 px-4 rounded-xl font-bold cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
