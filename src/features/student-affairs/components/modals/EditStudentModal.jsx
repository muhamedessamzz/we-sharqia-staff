import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Edit2, X, ShieldCheck, KeyRound } from 'lucide-react';

export default function EditStudentModal({ student, onClose, onUpdateStudent }) {
  const [form, setForm] = useState({
    fullName: '',
    studentCode: '',
    nationalId: '',
    grade: 3,
    classroom: 'C1',
    phoneNumber: '',
    parentConsent: true,
    status: 'approved',
  });
  const [submitting, setSubmitting] = useState(false);

  const normalizeDigits = (val) => {
    if (!val) return '';
    return val.replace(/[٠-٩]/g, (d) => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
  };

  useEffect(() => {
    if (student) {
      setForm({
        fullName: student.fullName || '',
        studentCode: student.studentCode || student.username || '',
        nationalId: '', // Keep blank unless updating
        grade: student.grade || 3,
        classroom: student.classroom || 'C1',
        phoneNumber: student.phoneNumber || '',
        parentPhone: student.parentPhone || '',
        parentConsent: student.parentConsent ?? true,
        status: student.status || 'approved',
      });
    }
  }, [student]);

  if (!student) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const cleanCode = normalizeDigits(form.studentCode).trim();
    const cleanNatId = normalizeDigits(form.nationalId).replace(/[\s-]/g, '');

    if (cleanNatId && cleanNatId.length !== 14) {
      alert(`يجب أن يتكون الرقم القومي من 14 رقمًا (تم إدخال ${cleanNatId.length} فقط)`);
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        fullName: form.fullName.trim(),
        studentCode: cleanCode,
        grade: form.grade,
        classroom: form.classroom.trim().toUpperCase(),
        phoneNumber: form.phoneNumber ? normalizeDigits(form.phoneNumber).trim() : null,
        parentPhone: form.parentPhone ? normalizeDigits(form.parentPhone).trim() : null,
        parentConsent: form.parentConsent,
        status: form.status,
      };

      if (cleanNatId && cleanNatId.length === 14) {
        payload.nationalId = cleanNatId;
        payload.password = cleanNatId;
      }

      await onUpdateStudent(student.id, payload);
      onClose();
    } catch (err) {
      alert(err.message || 'فشل تحديث بيانات الطالب');
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
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto text-right"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5C2C90] flex items-center justify-center font-bold">
              <Edit2 size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">تعديل بيانات الطالب</h3>
              <p className="text-xs text-slate-400 font-mono">الكود: {student.studentCode || student.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم الطالب رباعي</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الصف</label>
              <select
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              >
                <option value={1}>الصف الأول (المرحلة A)</option>
                <option value={2}>الصف الثاني (المرحلة B)</option>
                <option value={3}>الصف الثالث (المرحلة C)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الفصل</label>
              <input
                type="text"
                required
                value={form.classroom}
                onChange={(e) => setForm({ ...form, classroom: e.target.value.toUpperCase() })}
                placeholder="مثال: C1 أو C2"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كود الطالب</label>
              <input
                type="text"
                required
                value={form.studentCode}
                onChange={(e) => setForm({ ...form, studentCode: normalizeDigits(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">تحديث الرقم القومي</label>
                {student.nationalIdMasked && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    الحالي: {student.nationalIdMasked}
                  </span>
                )}
              </div>
              <input
                type="text"
                maxLength={14}
                placeholder="اتركه فارغًا إذا لم يتغير"
                value={form.nationalId}
                onChange={(e) => setForm({ ...form, nationalId: normalizeDigits(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">هاتف الطالب</label>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: normalizeDigits(e.target.value) })}
                placeholder="01xxxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">هاتف ولي الأمر</label>
              <input
                type="tel"
                value={form.parentPhone}
                onChange={(e) => setForm({ ...form, parentPhone: normalizeDigits(e.target.value) })}
                placeholder="01xxxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={form.parentConsent}
                onChange={(e) => setForm({ ...form, parentConsent: e.target.checked })}
                className="w-4 h-4 rounded text-[#5C2C90] focus:ring-[#5C2C90]"
              />
              <span>موافقة ولي الأمر معتمدة</span>
            </label>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-600">الحالة:</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
              >
                <option value="approved">نشط</option>
                <option value="suspended">معلّق</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#5C2C90] hover:bg-[#461e70] shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
