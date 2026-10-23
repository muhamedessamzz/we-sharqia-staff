import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, ShieldCheck, IdCard, Lock } from 'lucide-react';

export default function AddStudentModal({ isOpen, onClose, onAddStudent, initialClassroom }) {
  const [form, setForm] = useState({
    fullName: '',
    studentCode: '',
    nationalId: '',
    grade: initialClassroom?.startsWith('A') ? 1 : initialClassroom?.startsWith('B') ? 2 : 3,
    classroom: initialClassroom || 'A1',
    phoneNumber: '',
    parentPhone: '',
    parentConsent: true,
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  // Normalize Eastern Arabic digits
  const normalizeDigits = (val) => {
    if (!val) return '';
    return val.replace(/[٠-٩]/g, (d) => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return;

    const cleanCode = normalizeDigits(form.studentCode).trim();
    const cleanNatId = normalizeDigits(form.nationalId).replace(/[\s-]/g, '');

    if (!cleanCode) {
      alert('أدخل كود الطالب');
      return;
    }

    if (cleanNatId.length !== 14) {
      alert(`يجب أن يتكون الرقم القومي من 14 رقمًا (تم إدخال ${cleanNatId.length} فقط)`);
      return;
    }

    setSubmitting(true);
    try {
      await onAddStudent({
        fullName: form.fullName.trim(),
        username: cleanCode.toLowerCase(),
        studentCode: cleanCode,
        nationalId: cleanNatId,
        password: cleanNatId, // Will be hashed with PBKDF2 on server
        grade: form.grade,
        classroom: form.classroom.trim().toUpperCase(),
        phoneNumber: form.phoneNumber ? normalizeDigits(form.phoneNumber).trim() : null,
        parentPhone: form.parentPhone ? normalizeDigits(form.parentPhone).trim() : null,
        parentConsent: form.parentConsent,
        role: 1, // Student
      });

      setForm({
        fullName: '',
        studentCode: '',
        nationalId: '',
        grade: 3,
        classroom: 'C1',
        phoneNumber: '',
        parentPhone: '',
        parentConsent: true,
      });
      onClose();
    } catch (err) {
      alert(err.message || 'فشلت إضافة الطالب');
    } finally {
      setSubmitting(false);
    }
  };

  const cleanNatLen = normalizeDigits(form.nationalId).replace(/[\s-]/g, '').length;

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
              <Plus size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">إضافة طالب جديد</h3>
              <p className="text-xs text-slate-500">تسجيل الدخول بكود الطالب والرقم القومي</p>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم الطالب رباعي *</label>
            <input
              type="text"
              required
              placeholder="مثال: أحمد محمد مصطفى سالم"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الصف *</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">الفصل *</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">
                كود الطالب (اسم المستخدم) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: 20240150"
                  value={form.studentCode}
                  onChange={(e) => setForm({ ...form, studentCode: normalizeDigits(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  الرقم القومي (كلمة المرور) *
                </label>
                <span className={`text-[10px] font-mono font-bold ${cleanNatLen === 14 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {cleanNatLen}/14
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={14}
                placeholder="14 رقمًا"
                value={form.nationalId}
                onChange={(e) => setForm({ ...form, nationalId: normalizeDigits(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">هاتف الطالب</label>
              <input
                type="tel"
                placeholder="01xxxxxxxxx"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: normalizeDigits(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">هاتف ولي الأمر</label>
              <input
                type="tel"
                placeholder="01xxxxxxxxx"
                value={form.parentPhone}
                onChange={(e) => setForm({ ...form, parentPhone: normalizeDigits(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              />
            </div>
          </div>

          <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-100 flex items-center gap-2 text-[11px] text-[#5C2C90] font-semibold">
            <ShieldCheck size={16} className="shrink-0" />
            <span>يتم تشفير وتأمين الرقم القومي تلقائيًا عند الحفظ.</span>
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
              {submitting ? 'جارٍ الحفظ...' : 'حفظ الطالب'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
