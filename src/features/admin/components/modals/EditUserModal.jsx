import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Edit3, Lock, Eye, EyeOff, X } from 'lucide-react';
import { ROLES_LIST, ENGINEER_SPECIALTIES } from '../../constants';

export default function EditUserModal({
  isOpen,
  user,
  onClose,
  onUpdateUser,
  isSubmitting,
  classroomsMap,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (user) {
      const rawClass = user.classroom || '';
      const assignedClassrooms = rawClass
        .split(',')
        .map((c) => c.trim().toUpperCase())
        .filter(Boolean);

      setForm({
        id: user.id,
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        username: user.username || '',
        password: '',
        role: user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Teacher',
        isSuperAdmin: user.isSuperAdmin || user.role?.toLowerCase() === 'admin',
        status: user.status || 'approved',
        grade: user.grade || 1,
        classroom: user.classroom || 'A1',
        assignedClassrooms: assignedClassrooms.length > 0 ? assignedClassrooms : ['A1', 'A2'],
        specialty: user.specialty || 'programming',
      });
      setShowPassword(false);
    }
  }, [user]);

  if (!isOpen || !form) return null;

  const handleToggleAssignedClass = (cls) => {
    setForm((prev) => {
      const current = prev.assignedClassrooms || [];
      if (current.includes(cls)) {
        return { ...prev, assignedClassrooms: current.filter((c) => c !== cls) };
      } else {
        return { ...prev, assignedClassrooms: [...current, cls] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return alert('أدخل الاسم كاملًا');

    const roleLower = form.role?.toLowerCase();
    const isTeacherOrEngineer = ['teacher', 'technicalengineer'].includes(roleLower);
    const isStudent = roleLower === 'student';

    let gradeValue = null;
    let classValue = null;

    if (isStudent) {
      gradeValue = Number(form.grade) || 1;
      classValue = form.classroom || 'A1';
    } else if (isTeacherOrEngineer) {
      gradeValue = form.grade ? Number(form.grade) : null;
      classValue = form.assignedClassrooms?.length > 0 ? form.assignedClassrooms.join(', ') : null;
    }

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim() || null,
      phoneNumber: form.phoneNumber.trim() || null,
      password: form.password.trim() || null,
      role: form.role,
      isSuperAdmin: form.isSuperAdmin,
      status: form.status === 'suspended' ? 3 : form.status === 'approved' ? 1 : 0,
      grade: gradeValue,
      classroom: classValue,
      specialty: form.role === 'TechnicalEngineer' ? (form.specialty || 'programming') : null,
    };

    const success = await onUpdateUser(form.id, payload);
    if (success) {
      onClose();
    }
  };

  const isTeacherOrEngineer = ['Teacher', 'TechnicalEngineer'].includes(form.role);

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full border border-slate-200 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto text-right"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5C2C90] flex items-center justify-center font-bold">
              <Edit3 size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">تعديل بيانات الحساب</h3>
              <p className="text-xs text-slate-400 font-mono">@{form.username}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">الاسم كاملًا *</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">الدور</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              >
                {ROLES_LIST.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">حالة الحساب</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
              >
                <option value="approved">نشط</option>
                <option value="suspended">موقوف</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">كلمة المرور الجديدة (اتركه فارغًا إذا لم ترغب بتغييرها)</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="كلمة مرور جديدة..."
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-3.5 pl-9 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم الهاتف</label>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              dir="ltr"
            />
          </div>

          {/* Technical Engineer Specialty Picker (Strictly 4: programming, networking, communication, ai) */}
          {form.role === 'TechnicalEngineer' && (
            <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-200/80 space-y-2">
              <label className="block font-black text-slate-800 text-xs">
                تخصص المهندس: *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {ENGINEER_SPECIALTIES.map((spec) => {
                  const isSelected = form.specialty === spec.id;
                  return (
                    <button
                      type="button"
                      key={spec.id}
                      onClick={() => setForm({ ...form, specialty: spec.id })}
                      className={`p-2.5 rounded-xl text-xs font-bold text-right border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? `${spec.color} ring-2 ring-[#5C2C90]/40 shadow-xs font-black`
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-extrabold">{spec.label}</span>
                      {isSelected && <span className="text-xs text-[#5C2C90]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Teacher/Engineer assigned classrooms picker */}
          {isTeacherOrEngineer && (
            <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200/70 space-y-2">
              <span className="font-black text-slate-800 block text-xs">
                الفصول المسندة:
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {[1, 2, 3].map((g) => {
                  const classList = classroomsMap[g] || [];
                  return (
                    <div key={g} className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-purple-200">
                      <span className="text-[10px] font-bold text-[#5C2C90] px-1">الصف {g}:</span>
                      {classList.map((cls) => {
                        const checked = (form.assignedClassrooms || []).includes(cls);
                        return (
                          <button
                            type="button"
                            key={cls}
                            onClick={() => handleToggleAssignedClass(cls)}
                            className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-all ${
                              checked
                                ? 'bg-[#5C2C90] text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {cls}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#5C2C90] hover:bg-[#461e70] shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
