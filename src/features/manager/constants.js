export const ROLE_BADGES = {
  teacher: { label: 'معلم', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  technicalengineer: { label: 'مهندس تدريب ومعامل', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
  studentaffairs: { label: 'شؤون الطلاب', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  socialworker: { label: 'أخصائي اجتماعي', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  assessmentcoordinator: { label: 'مسؤول الامتحانات', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  qualitycoordinator: { label: 'مسؤول الجودة', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
  sportscoach: { label: 'كابتن رياضي', bg: 'bg-lime-50 text-lime-800 border-lime-200' },
  hr: { label: 'الموارد البشرية وشؤون العاملين', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  it: { label: 'الدعم الفني', bg: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export const ROLES_LABELS = ROLE_BADGES;

export const getRoleBadge = (role) => {
  const key = role?.toLowerCase();
  return ROLE_BADGES[key] || { label: role || 'موظف', bg: 'bg-slate-50 text-slate-600 border-slate-200' };
};

export const INITIAL_EVALUATION_FORM = {
  punctuality: 5,
  pedagogy: 5,
  engagement: 5,
  cooperation: 5,
  notes: '',
  badge: 'معلم متميز'
};

export const INITIAL_NOTIFICATION_FORM = {
  title: '',
  content: '',
  targetRole: 'all',
  targetUserId: '',
  priority: 'administrative',
  requiresAcknowledgment: true
};

export const STAFF_ROLE_TABS = [
  { id: 'all', label: 'الكل' },
  { id: 'teacher', label: 'معلمون' },
  { id: 'technicalengineer', label: 'مهندسون' },
  { id: 'studentaffairs', label: 'شؤون الطلاب' },
  { id: 'socialworker', label: 'أخصائي اجتماعي' },
  { id: 'assessmentcoordinator', label: 'الامتحانات' },
  { id: 'qualitycoordinator', label: 'الجودة' },
  { id: 'sportscoach', label: 'كابتن رياضي' },
  { id: 'hr', label: 'الموارد البشرية' },
  { id: 'it', label: 'الدعم الفني' }
];

export const EVALUATION_CRITERIA = [
  { key: 'punctuality', label: 'الانضباط والالتزام بالمواعيد' },
  { key: 'pedagogy', label: 'جودة التدريس والعمل الفني' },
  { key: 'engagement', label: 'التفاعل وسرعة إنجاز المهام' },
  { key: 'cooperation', label: 'التعاون وروح المبادرة' }
];
