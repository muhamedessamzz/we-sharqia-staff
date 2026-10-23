import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { UserPlus, Lock, Eye, EyeOff, X, Sparkles, CheckCircle2, Calendar, Link as LinkIcon } from 'lucide-react';
import { ROLES_LIST, STAGES_CONFIG, ENGINEER_SPECIALTIES } from '../../constants';
import { api } from '../../../../api/client';
import fallbackSchedule from '../../../../data/school_schedule.json';

const normalizeArabic = (text) => {
  if (!text) return '';
  return text
    .replace(/^([مأا]\/|\bمهندس\b|\bأستاذ\b|\bاستاذ\b|\bد\b|\bدكتور\b)\s*/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};

export default function CreateUserModal({
  isOpen,
  onClose,
  onCreateUser,
  isSubmitting,
  classroomsMap,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedStaffPicker, setSelectedStaffPicker] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: '',
    role: 'Teacher',
    isSuperAdmin: false,
    grade: 1,
    classroom: 'A1',
    assignedClassrooms: ['A1', 'A2'],
    specialty: 'programming',
  });

  // Check if current name matches any staff in schedule
  const detectedStaff = useMemo(() => {
    if (!form.fullName.trim()) return null;
    const norm = normalizeArabic(form.fullName);
    if (!norm) return null;
    return fallbackSchedule?.staff?.find(
      (s) => s.normalizedName === norm || s.normalizedName.includes(norm) || norm.includes(s.normalizedName)
    ) || null;
  }, [form.fullName]);

  if (!isOpen) return null;

  const handleQuickStaffSelect = (staffId) => {
    setSelectedStaffPicker(staffId);
    if (!staffId) return;

    const staff = fallbackSchedule?.staff?.find((s) => s.id === staffId);
    if (!staff) return;

    const isEng = staff.role === 'مهندس';
    const roleValue = isEng ? 'TechnicalEngineer' : 'Teacher';
    const cleanEnName = staff.cleanName
      .replace(/عبدال/g, 'abdel')
      .replace(/عبد/g, 'abd')
      .replace(/محمد/g, 'mohamed')
      .replace(/أحمد|احمد/g, 'ahmed')
      .replace(/إبراهيم|ابراهيم/g, 'ibrahim')
      .replace(/يارة|يارا/g, 'yara')
      .replace(/إيمان|ايمان/g, 'eman')
      .replace(/فرح/g, 'farah')
      .replace(/عصام/g, 'essam')
      .replace(/سارة|ساره/g, 'sara')
      .replace(/محمود/g, 'mahmoud')
      .replace(/كريم/g, 'karim')
      .replace(/ولاء/g, 'walaa')
      .replace(/سامح/g, 'sameh')
      .replace(/نهى/g, 'noha')
      .replace(/هناء/g, 'hanaa')
      .replace(/ماجدة/g, 'magda')
      .replace(/[\s\/]/g, '.')
      .toLowerCase();

    const suggestedUser = cleanEnName.length >= 3 ? cleanEnName : `staff_${staff.id.replace('staff-', '')}`;

    setForm((prev) => ({
      ...prev,
      fullName: staff.canonicalName,
      role: roleValue,
      assignedClassrooms: staff.classrooms?.length > 0 ? staff.classrooms : ['A1', 'A2'],
      grade: staff.classrooms?.some((c) => c.startsWith('A')) ? 1 : staff.classrooms?.some((c) => c.startsWith('B')) ? 2 : 3,
      username: prev.username || suggestedUser,
      email: prev.email || `${suggestedUser}@wesharkia.edu`,
      specialty: isEng ? 'programming' : prev.specialty,
    }));
  };

  const handleRoleChange = (roleValue) => {
    const selected = ROLES_LIST.find((r) => r.value === roleValue);
    const isTeacherEng = ['Teacher', 'TechnicalEngineer'].includes(roleValue);
    setForm((prev) => ({
      ...prev,
      role: roleValue,
      isSuperAdmin: selected ? selected.isSuper : false,
      grade: isTeacherEng || roleValue === 'Student' ? 1 : null,
      classroom: roleValue === 'Student' ? 'A1' : null,
      assignedClassrooms: isTeacherEng ? prev.assignedClassrooms || ['A1', 'A2'] : [],
    }));
  };

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
    if (!form.username.trim() || form.username.trim().length < 3)
      return alert('اسم المستخدم يجب ألا يقل عن 3 أحرف');
    if (!form.password || form.password.length < 4) return alert('كلمة المرور يجب ألا تقل عن 4 خانات');

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
      username: form.username.trim().toLowerCase(),
      password: form.password,
      role: form.role,
      email: form.email.trim() || null,
      phoneNumber: form.phoneNumber.trim() || null,
      isSuperAdmin: form.isSuperAdmin || form.role === 'Admin',
      grade: gradeValue,
      classroom: classValue,
      specialty: form.role === 'TechnicalEngineer' ? (form.specialty || 'programming') : null,
    };

    const success = await onCreateUser(payload);
    if (success) {
      // If detected in schedule, also automatically link the account in ScheduleController
      if (detectedStaff) {
        try {
          await api.linkStaffAccount({
            staffId: detectedStaff.id,
            staffName: detectedStaff.canonicalName,
            userEmail: payload.email || `${payload.username}@wesharkia.edu`,
            userId: payload.username,
          });
        } catch (linkErr) {
          console.warn('Auto schedule link info:', linkErr);
        }
      }

      setForm({
        fullName: '',
        email: '',
        phoneNumber: '',
        username: '',
        password: '',
        role: 'Teacher',
        isSuperAdmin: false,
        grade: 1,
        classroom: 'A1',
        assignedClassrooms: ['A1', 'A2'],
        specialty: 'programming',
      });
      setSelectedStaffPicker('');
      onClose();
    }
  };

  const isTeacherOrEngineer = ['Teacher', 'TechnicalEngineer'].includes(form.role);

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in"
      dir="rtl"
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5C2C90] to-[#E4007C] text-white flex items-center justify-center font-bold shadow-xs">
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">إضافة مستخدم جديد</h3>
              <p className="text-xs text-slate-500">حدد الدور والصلاحيات والفصول المسندة</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Quick Schedule Staff Picker */}
          <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black text-[#5C2C90] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#5C2C90]" />
                <span>اختيار سريع من كادر الجدول المدرسي المعتمد (28 كادر جاهز):</span>
              </label>
              <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                اختياري ⚡
              </span>
            </div>
            <select
              value={selectedStaffPicker}
              onChange={(e) => handleQuickStaffSelect(e.target.value)}
              className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90] cursor-pointer"
            >
              <option value="">-- أو يمكنك كتابة البيانات يدوياً بالأسفل --</option>
              <optgroup label="المهندسون والمتخصصون">
                {fallbackSchedule?.staff
                  ?.filter((s) => s.role === 'مهندس')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.canonicalName} ({s.weeklyClassesCount} حصة • فصول: {s.classrooms?.join(', ') || 'عام'})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="المعلمون والأخصائيون">
                {fallbackSchedule?.staff
                  ?.filter((s) => s.role !== 'مهندس')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.canonicalName} ({s.weeklyClassesCount} حصة • {s.weeklyDutiesCount} إشراف)
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Schedule Detection Status Banner */}
          {detectedStaff && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-3 flex items-center justify-between text-xs animate-fade-in shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <div>
                  <div className="font-black text-slate-900">
                    تم التعرف على الكادر في الجدول: {detectedStaff.canonicalName}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-bold">
                    النصاب: {detectedStaff.weeklyClassesCount} حصة أسبوعياً • {detectedStaff.weeklyDutiesCount} نوبات إشراف واحتياطي
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-1 rounded-lg shrink-0">
                ربط تلقائي ⚡
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">الاسم كاملًا *</label>
              <input
                type="text"
                required
                placeholder="مثال: م/ إبراهيم رجب أو أستاذ أحمد الشافعي"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">الدور والصلاحية *</label>
                <select
                  value={form.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المستخدم *</label>
                <input
                  type="text"
                  required
                  placeholder="ibrahim.ragab"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90] text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">كلمة المرور *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-3.5 pl-9 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني *</label>
                <input
                  type="email"
                  required
                  placeholder="name@wesharkia.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم الهاتف (اختياري)</label>
              <input
                type="tel"
                placeholder="010xxxxxxxx"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                dir="ltr"
              />
            </div>

            {/* Engineer Specialty */}
            {form.role === 'TechnicalEngineer' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">تخصص المهندس</label>
                <select
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                >
                  {ENGINEER_SPECIALTIES.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Classrooms for Teacher / Engineer */}
            {isTeacherOrEngineer && (
              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-700">الفصول المسندة للتدريس:</label>
                <div className="flex flex-wrap gap-1.5">
                  {['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'C1', 'C2'].map((cls) => {
                    const isSelected = form.assignedClassrooms?.includes(cls);
                    return (
                      <button
                        type="button"
                        key={cls}
                        onClick={() => handleToggleAssignedClass(cls)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#5C2C90] text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        فصل {cls}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold transition-all cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white font-black shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'جارٍ الإنشاء...' : 'إضافة المستخدم وتأكيد التفعيل'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
