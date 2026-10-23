export const STATUS_CONFIG = {
  1: { label: 'قيد الحل والتنفيذ', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  2: { label: 'طلب توجيه أكاديمي', color: 'text-[#E4007C]', bg: 'bg-[#E4007C]/10', border: 'border-[#E4007C]/30' },
  3: { label: 'في انتظار المتابعة', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  4: { label: 'تم التسليم بنجاح', color: 'text-[#5C2C90]', bg: 'bg-purple-50', border: 'border-purple-200' },
};

export const DEFAULT_SCHOOL_CLASSROOMS = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'C1', 'C2'];

export const INITIAL_QUIZ_FORM = {
  title: '',
  targetClassroom: 'all',
  suggestedMinutes: 15,
  dueDate: '',
  instructions: '',
  driveUrl: '',
  questions: [
    {
      text: '',
      points: 5,
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: ''
    }
  ]
};

export const INITIAL_ANNOUNCEMENT_FORM = {
  title: '',
  content: '',
  classroom: 'all',
  importance: 'normal'
};

export const INITIAL_GRADING_FORM = {
  grade: 10,
  feedback: '',
  returnForRevision: false
};
