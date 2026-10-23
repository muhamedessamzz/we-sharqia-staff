import React, { useState } from 'react';
import { CASE_TYPES, PRIORITIES } from '../../constants';

export default function NewCaseForm({
  students,
  initialStudentId,
  initialCaseType,
  initialPriority,
  initialNote,
  counselorName,
  onSubmit,
  onCancel,
}) {
  const [studentId, setStudentId] = useState(initialStudentId || (students?.[0]?.id || ''));
  const [caseType, setCaseType] = useState(initialCaseType || CASE_TYPES[0]);
  const [priority, setPriority] = useState(initialPriority || 'متوسطة');
  const [note, setNote] = useState(initialNote || '');
  const [actionPlan, setActionPlan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !note.trim()) {
      alert('اختر الطالب واكتب الملاحظات الأولية.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        studentId,
        caseType,
        priority,
        note: note.trim(),
        actionPlan: actionPlan.trim(),
        counselorName: counselorName || 'أ. مروة الشافعي (الأخصائي الاجتماعي)',
      });
      alert('تم حفظ ملف الحالة بنجاح.');
      onCancel();
    } catch (err) {
      alert(err.message || 'حدث خطأ أثناء حفظ الحالة');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-black text-lg text-slate-900">فتح ملف دراسة حالة</h3>
        <p className="text-xs text-slate-500">توثيق الحالة وفق سجلات الإرشاد الطلابي المعتمدة</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">اختر الطالب *</label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold"
          >
            {(students || []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} - فصل {s.classroom}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">نوع الحالة *</label>
            <select
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            >
              {CASE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">درجة الأولوية *</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">الملاحظات الأولية *</label>
          <textarea
            rows={3}
            required
            placeholder="اكتب موجز الملاحظات السلوكية أو الصعوبات المرصودة..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs leading-relaxed"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">خطة الدعم المقترحة</label>
          <input
            type="text"
            placeholder="مثال: جلسة أسبوعية، توجيه المعلم، استدعاء ولي الأمر..."
            value={actionPlan}
            onChange={(e) => setActionPlan(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
          />
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-[#5C2C90] hover:bg-[#4a2175] text-white py-3 rounded-xl font-bold cursor-pointer transition-colors shadow-xs disabled:opacity-50"
          >
            {submitting ? 'جارٍ الحفظ...' : 'حفظ ملف الحالة'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-100 text-slate-600 py-3 px-5 rounded-xl font-bold hover:bg-slate-200 cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
