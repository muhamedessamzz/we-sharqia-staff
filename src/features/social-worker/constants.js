export const GRADE_NAMES = {
  1: 'الصف الأول (المرحلة A)',
  2: 'الصف الثاني (المرحلة B)',
  3: 'الصف الثالث (المرحلة C)',
};

export const CASE_TYPES = [
  'إرشاد أكاديمي وصعوبات تقنية',
  'متابعة سلوكية وانضباط مدرسي',
  'غياب متكرر وتعثر حضور',
  'دعم نفسي وتخفيف ضغوط',
  'رعاية تفوق ومواهب تكنولوجية',
  'إرشاد مهني وبناء مهارات سوق العمل',
];

export const PRIORITIES = [
  { value: 'عاجلة', label: 'عاجلة', color: 'text-rose-700 bg-rose-50 border-rose-200' },
  { value: 'متوسطة', label: 'متابعة دورية', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'عادية', label: 'عادية', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
];

export const STATUS_CONFIG = {
  open: { label: 'حالة جديدة', color: 'text-[#E4007C] bg-[#E4007C]/10 border-[#E4007C]/20' },
  inSupport: { label: 'قيد المتابعة', color: 'text-[#5C2C90] bg-[#5C2C90]/10 border-[#5C2C90]/20' },
  resolved: { label: 'مكتملة ومغلقة', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
};

// Initial Seeds - Empty for live production data
export const INITIAL_GROOMING_LOGS = [];
export const INITIAL_ABSENCE_LOGS = [];
export const INITIAL_DISRUPTION_LOGS = [];
export const INITIAL_SUMMONS = [];

