export const STAGES_CONFIG = [
  { grade: 1, letter: 'A', name: 'الصف الأول', fullName: 'الصف الأول (المرحلة A)', color: '#0984e3', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { grade: 2, letter: 'B', name: 'الصف الثاني', fullName: 'الصف الثاني (المرحلة B)', color: '#7B3FA8', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { grade: 3, letter: 'C', name: 'الصف الثالث', fullName: 'الصف الثالث (المرحلة C)', color: '#E4007C', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
];

export const DEFAULT_GRADE_CLASSROOMS = {
  1: ['A1', 'A2', 'A3', 'A4'],
  2: ['B1', 'B2', 'B3'],
  3: ['C1', 'C2'],
};

export const GRADE_NAMES = {
  1: 'الصف الأول (المرحلة A)',
  2: 'الصف الثاني (المرحلة B)',
  3: 'الصف الثالث (المرحلة C)',
};

export const ROLES_LIST = [
  { value: 'Admin', label: 'مسؤول النظام الرئيسي', category: 'admin', isSuper: true },
  { value: 'SchoolManager', label: 'مدير المدرسة', category: 'school', isSuper: false },
  { value: 'Teacher', label: 'معلم', category: 'staff', isSuper: false },
  { value: 'TechnicalEngineer', label: 'مهندس تدريب ومعامل', category: 'staff', isSuper: false },
  { value: 'StudentAffairs', label: 'شؤون الطلاب', category: 'staff', isSuper: false },
  { value: 'SocialWorker', label: 'أخصائي اجتماعي', category: 'staff', isSuper: false },
  { value: 'AssessmentCoordinator', label: 'مسؤول التقييم والامتحانات', category: 'staff', isSuper: false },
  { value: 'QualityCoordinator', label: 'مسؤول الجودة', category: 'staff', isSuper: false },
  { value: 'SportsCoach', label: 'كابتن التربية البدنية والأنشطة الرياضية', category: 'staff', isSuper: false },
  { value: 'HR', label: 'مسؤول الموارد البشرية وشؤون العاملين', category: 'staff', isSuper: false },
  { value: 'IT', label: 'الدعم الفني وتكنولوجيا المعلومات', category: 'staff', isSuper: false },
];

export const ROLE_BADGES = {
  admin: { label: 'مسؤول النظام', color: 'bg-purple-100 text-[#5C2C90] border-purple-200' },
  schoolmanager: { label: 'مدير المدرسة', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  teacher: { label: 'معلم', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  technicalengineer: { label: 'مهندس تدريب ومعامل', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  studentaffairs: { label: 'شؤون الطلاب', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  socialworker: { label: 'أخصائي اجتماعي', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  assessmentcoordinator: { label: 'مسؤول التقييم والامتحانات', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  qualitycoordinator: { label: 'مسؤول الجودة', color: 'bg-violet-100 text-violet-800 border-violet-200' },
  sportscoach: { label: 'كابتن رياضي', color: 'bg-lime-100 text-lime-800 border-lime-200' },
  hr: { label: 'الموارد البشرية وشؤون العاملين', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  it: { label: 'الدعم الفني', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  student: { label: 'طالب', color: 'bg-slate-100 text-slate-800 border-slate-200' },
  parent: { label: 'ولي أمر', color: 'bg-orange-100 text-orange-800 border-orange-200' },
};

// 4 Official Engineering Specialties strictly specified: programming, networking, communication, ai
export const ENGINEER_SPECIALTIES = [
  {
    id: 'programming',
    key: 'programming',
    label: 'تطوير البرمجيات',
    shortLabel: 'برمجة',
    english: 'Programming',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    iconBg: 'bg-purple-50 text-[#5C2C90]',
  },
  {
    id: 'networking',
    key: 'networking',
    label: 'تكنولوجيا الشبكات',
    shortLabel: 'شبكات',
    english: 'Networking',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    iconBg: 'bg-blue-50 text-blue-700',
  },
  {
    id: 'communication',
    key: 'communication',
    label: 'تكنولوجيا الاتصالات',
    shortLabel: 'اتصالات',
    english: 'Communication',
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    iconBg: 'bg-pink-50 text-[#E4007C]',
  },
  {
    id: 'ai',
    key: 'ai',
    label: 'الذكاء الاصطناعي',
    shortLabel: 'ذكاء اصطناعي',
    english: 'AI',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-700',
  },
];

export const getSpecialtyConfig = (specialty) => {
  if (!specialty) return null;
  const key = specialty.toLowerCase().trim();
  return ENGINEER_SPECIALTIES.find((s) => s.id === key || s.english.toLowerCase() === key) || null;
};

// Returns exact label requested: مهندس برمجة، مهندس شبكات، مهندس اتصالات، مهندس ذكاء اصطناعي
export const getEngineerSpecialtyLabel = (specialty) => {
  if (!specialty) return 'مهندس';
  const s = specialty.toLowerCase().trim();
  if (s === 'programming' || s.includes('برمج')) return 'مهندس برمجة';
  if (s === 'networking' || s.includes('شبك')) return 'مهندس شبكات';
  if (s === 'communication' || s.includes('اتصال')) return 'مهندس اتصالات';
  if (s === 'ai' || s.includes('ذكاء')) return 'مهندس ذكاء اصطناعي';
  return `مهندس ${specialty}`;
};

// Unified Role & Specialty Badge Formatter
export const getRoleBadgeInfo = (userOrRole, specialty = null) => {
  const role = typeof userOrRole === 'object' ? userOrRole?.role : userOrRole;
  let spec = typeof userOrRole === 'object' ? (userOrRole?.specialty || specialty) : specialty;
  const r = (role || '').toLowerCase();

  // Smart fallback inference if specialty is empty or unpopulated on the user object:
  if ((r === 'technicalengineer' || r === 'engineer') && !spec && typeof userOrRole === 'object') {
    const un = (userOrRole.username || '').toLowerCase();
    const fn = (userOrRole.fullName || '').toLowerCase();
    if (un.includes('_ai') || fn.includes('ذكاء')) spec = 'ai';
    else if (un.includes('_comm') || fn.includes('اتصال')) spec = 'communication';
    else if (un.includes('_net') || fn.includes('شبك')) spec = 'networking';
    else if (un === 'engineer' || fn.includes('برمج') || fn.includes('تطوير')) spec = 'programming';
  }

  if (r === 'technicalengineer' || r === 'engineer') {
    const specCfg = getSpecialtyConfig(spec);
    return {
      label: getEngineerSpecialtyLabel(spec),
      color: specCfg?.color || 'bg-cyan-100 text-cyan-800 border-cyan-200',
      shortLabel: specCfg?.shortLabel || 'مهندس',
    };
  }

  const base = ROLE_BADGES[r] || { label: role || 'مستخدم', color: 'bg-slate-100 text-slate-800 border-slate-200' };
  return {
    ...base,
    shortLabel: base.label,
  };
};
