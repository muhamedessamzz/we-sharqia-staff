import React from 'react';
import {
  Users,
  Briefcase,
  Clock,
  FileCheck2,
  Inbox,
  HeartHandshake,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Trophy
} from 'lucide-react';

export default function DashboardMetricsGrid({ user, metrics, loading, onNavigateTab }) {
  const r = (user?.role || '').toLowerCase();
  const isPlatformAdmin = r === 'admin' || user?.isSuperAdmin;
  const isSchoolManager = r === 'schoolmanager';
  const isLeadership = isPlatformAdmin || isSchoolManager;
  const isTechnicalEngineer = r === 'technicalengineer';
  const isTeacher = r === 'teacher';
  const isStudentAffairs = r === 'studentaffairs';
  const isAssessmentCoordinator = r === 'assessmentcoordinator';
  const isSportsCoach = r === 'sportscoach';
  const isSocialWorker = r === 'socialworker';
  const isHR = r === 'hr';
  const isQualityOrIT = r === 'qualitycoordinator' || r === 'it';

  let sectionTitle = 'المؤشرات العامة للمدرسة';
  let cards = [];

  if (isTechnicalEngineer) {
    sectionTitle = 'مؤشرات التدريب العملي والمعامل';
    cards = [
      {
        id: 'students',
        title: 'طلاب المعامل والتدريب',
        value: loading ? '...' : (metrics?.totalStudents || 188),
        unit: 'طالب',
        subtitle: 'موزعون على معامل التخصص والتدريب العملي',
        icon: Users,
        gradient: 'from-[#5C2C90] to-[#7938BE]',
        textColor: 'text-[#5C2C90]',
        borderColor: 'border-purple-200/80',
        badge: 'المسارات التكنولوجية',
        badgeColor: 'bg-purple-100 text-purple-800',
        targetTab: 'teacher',
      },
      {
        id: 'assignments',
        title: 'التكليفات والمشاريع العملية',
        value: loading ? '...' : (metrics?.totalAssignments || 0),
        unit: 'تكليف',
        subtitle: `${metrics?.completionRate ?? 0}% نسبة التسليم (${metrics?.completedProgresses || 0} تسليم)`,
        icon: FileCheck2,
        gradient: 'from-amber-600 to-orange-600',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200/80',
        badge: 'مناهج الاتصالات والتكنولوجيا',
        badgeColor: 'bg-amber-100 text-amber-800',
        targetTab: 'teacher',
      },
      {
        id: 'attendance_rate',
        title: 'نسبة حضور الطلاب بالمعامل',
        value: '98.5%',
        unit: '',
        subtitle: 'معدل الحضور والانضباط داخل معامل التخصص',
        icon: CheckCircle2,
        gradient: 'from-emerald-600 to-teal-600',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200/80',
        badge: 'انضباط معملي عالي',
        badgeColor: 'bg-emerald-100 text-emerald-800',
        targetTab: 'teacher',
      },
      {
        id: 'schedule_sessions',
        title: 'جلسات التدريب العملي',
        value: 'مُجدول',
        unit: '',
        subtitle: 'فترات التدريب العملي المعتمدة لهذا الأسبوع',
        icon: Clock,
        gradient: 'from-blue-600 to-cyan-600',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200/80',
        badge: 'جدول المعامل',
        badgeColor: 'bg-blue-100 text-blue-800',
        targetTab: 'schedule',
      },
      {
        id: 'skills_evaluations',
        title: 'تقييمات الجدارات الفنية',
        value: 'رصد الدرجات',
        unit: '',
        subtitle: 'إدخال وتقييم المهارات العملية للطلاب',
        icon: GraduationCap,
        gradient: 'from-indigo-600 to-purple-600',
        textColor: 'text-indigo-700',
        borderColor: 'border-indigo-200/80',
        badge: 'جدارات عملية',
        badgeColor: 'bg-indigo-100 text-indigo-800',
        targetTab: 'assessment',
      },
    ];
  } else if (isTeacher) {
    sectionTitle = 'مؤشرات التدريس والفصول الدراسية';
    cards = [
      {
        id: 'students',
        title: 'إجمالي الطلاب بالفصول',
        value: loading ? '...' : (metrics?.totalStudents || 188),
        unit: 'طالب',
        subtitle: 'موزعون على الفصول الدراسية والمجموعات',
        icon: Users,
        gradient: 'from-[#5C2C90] to-[#7938BE]',
        textColor: 'text-[#5C2C90]',
        borderColor: 'border-purple-200/80',
        badge: 'الفصول الدراسية',
        badgeColor: 'bg-purple-100 text-purple-800',
        targetTab: 'teacher',
      },
      {
        id: 'assignments',
        title: 'الواجبات والتكليفات المدرسية',
        value: loading ? '...' : (metrics?.totalAssignments || 0),
        unit: 'تكليف',
        subtitle: `${metrics?.completionRate ?? 0}% نسبة التسليم (${metrics?.completedProgresses || 0} تسليم)`,
        icon: FileCheck2,
        gradient: 'from-amber-600 to-orange-600',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200/80',
        badge: 'المهام الأكاديمية',
        badgeColor: 'bg-amber-100 text-amber-800',
        targetTab: 'teacher',
      },
      {
        id: 'attendance_rate',
        title: 'نسبة حضور الطلاب اليوم',
        value: '98.5%',
        unit: '',
        subtitle: 'انضباط وحضور الطلاب داخل الفصول',
        icon: CheckCircle2,
        gradient: 'from-emerald-600 to-teal-600',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200/80',
        badge: 'حضور منتظم',
        badgeColor: 'bg-emerald-100 text-emerald-800',
        targetTab: 'teacher',
      },
      {
        id: 'schedule_sessions',
        title: 'جدول الحصص الدراسي',
        value: 'مُجدول',
        unit: '',
        subtitle: 'الحصص والفترات الدراسية المعتمدة',
        icon: Clock,
        gradient: 'from-blue-600 to-cyan-600',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200/80',
        badge: 'الجدول الأسبوعي',
        badgeColor: 'bg-blue-100 text-blue-800',
        targetTab: 'schedule',
      },
      {
        id: 'exams_eval',
        title: 'الامتحانات والتقييمات',
        value: 'رصد الدرجات',
        unit: '',
        subtitle: 'إدخال ومراجعة درجات الاختبارات الشهرية',
        icon: GraduationCap,
        gradient: 'from-indigo-600 to-purple-600',
        textColor: 'text-indigo-700',
        borderColor: 'border-indigo-200/80',
        badge: 'التقييم المستمر',
        badgeColor: 'bg-indigo-100 text-indigo-800',
        targetTab: 'assessment',
      },
    ];
  } else if (isStudentAffairs) {
    sectionTitle = 'مؤشرات شؤون الطلاب وقوائم الفصول';
    cards = [
      {
        id: 'students',
        title: 'إجمالي الطلاب المقيدين',
        value: loading ? '...' : (metrics?.totalStudents || 188),
        unit: 'طالب',
        subtitle: 'الصفوف الأول والثاني والثالث',
        icon: Users,
        gradient: 'from-[#5C2C90] to-[#7938BE]',
        textColor: 'text-[#5C2C90]',
        borderColor: 'border-purple-200/80',
        badge: 'موزعون على الفصول',
        badgeColor: 'bg-purple-100 text-purple-800',
        targetTab: 'affairs',
      },
      {
        id: 'parent_requests',
        title: 'طلبات أولياء الأمور المعلقة',
        value: loading ? '...' : (metrics?.pendingRequests ?? 0),
        unit: 'طلب',
        subtitle: 'في انتظار المراجعة والاعتماد بشؤون الطلاب',
        icon: Inbox,
        gradient: 'from-[#E4007C] to-rose-600',
        textColor: 'text-[#E4007C]',
        borderColor: 'border-pink-200/80',
        badge: (metrics?.pendingRequests || 0) > 0 ? 'قيد الانتظار' : 'تمت مراجعة الكل',
        badgeColor: (metrics?.pendingRequests || 0) > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800',
        targetTab: 'affairs',
      },
      {
        id: 'classrooms',
        title: 'الفصول الدراسية والقاعات',
        value: '9',
        unit: 'فصول',
        subtitle: 'موزعة على التخصصات الأربعة للمدرسة',
        icon: FileCheck2,
        gradient: 'from-blue-600 to-indigo-600',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200/80',
        badge: 'فصول المدرسة',
        badgeColor: 'bg-blue-100 text-blue-800',
        targetTab: 'affairs',
      },
      {
        id: 'attendance',
        title: 'نسبة انضباط حضور الطلاب',
        value: '98.5%',
        unit: '',
        subtitle: 'المعدل العام لحضور طلاب المدرسة',
        icon: CheckCircle2,
        gradient: 'from-emerald-600 to-teal-600',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200/80',
        badge: 'انضباط عام ممتاز',
        badgeColor: 'bg-emerald-100 text-emerald-800',
        targetTab: 'affairs',
      },
    ];
  } else if (isSocialWorker) {
    sectionTitle = 'مؤشرات الرعاية الاجتماعية والإرشاد';
    cards = [
      {
        id: 'social_cases',
        title: 'سجلات الرعاية والحالات الفردية',
        value: loading ? '...' : (metrics?.activeCasesCount ?? 0),
        unit: 'حالة',
        subtitle: 'متابعة سلوكية ونفسية فردية سرية',
        icon: HeartHandshake,
        gradient: 'from-violet-600 to-purple-800',
        textColor: 'text-violet-700',
        borderColor: 'border-violet-200/80',
        badge: 'متابعة سرية',
        badgeColor: 'bg-violet-100 text-violet-800',
        targetTab: 'social',
      },
      {
        id: 'students',
        title: 'إجمالي طلاب المدرسة المشمولين',
        value: loading ? '...' : (metrics?.totalStudents || 188),
        unit: 'طالب',
        subtitle: 'تحت مظلة التوجيه الاجتماعي والإرشاد',
        icon: Users,
        gradient: 'from-[#5C2C90] to-[#7938BE]',
        textColor: 'text-[#5C2C90]',
        borderColor: 'border-purple-200/80',
        badge: 'الرعاية المدرسية',
        badgeColor: 'bg-purple-100 text-purple-800',
        targetTab: 'social',
      },
      {
        id: 'warnings',
        title: 'مؤشرات الإنذار المبكر',
        value: 'متابعة مستمرة',
        unit: '',
        subtitle: 'رصد الغياب المتكرر والتراجع السلوكي',
        icon: AlertCircle,
        gradient: 'from-amber-600 to-orange-600',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200/80',
        badge: 'متابعة وقائية',
        badgeColor: 'bg-amber-100 text-amber-800',
        targetTab: 'social',
      },
    ];
  } else if (isSportsCoach) {
    sectionTitle = 'مؤشرات التربية الرياضية واللياقة البدنية';
    cards = [
      {
        id: 'students',
        title: 'إجمالي الطلاب المشاركين',
        value: loading ? '...' : (metrics?.totalStudents || 188),
        unit: 'طالب',
        subtitle: 'في الأنشطة الرياضية وطابور الصباح',
        icon: Users,
        gradient: 'from-[#5C2C90] to-[#7938BE]',
        textColor: 'text-[#5C2C90]',
        borderColor: 'border-purple-200/80',
        badge: 'اللياقة والنشاط',
        badgeColor: 'bg-purple-100 text-purple-800',
        targetTab: 'sports',
      },
      {
        id: 'assembly',
        title: 'انضباط طابور الصباح',
        value: '98%',
        unit: '',
        subtitle: 'الالتزام بالتمارين الصباحية والزي الرياضي',
        icon: CheckCircle2,
        gradient: 'from-emerald-600 to-teal-600',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200/80',
        badge: 'انضباط متميز',
        badgeColor: 'bg-emerald-100 text-emerald-800',
        targetTab: 'sports',
      },
      {
        id: 'fitness',
        title: 'بطاقات التقييم البدني',
        value: 'نشط',
        unit: '',
        subtitle: 'درجات اللياقة والسرعة والمرونة والتحمل',
        icon: Trophy,
        gradient: 'from-amber-600 to-orange-600',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200/80',
        badge: 'التقييم البدني',
        badgeColor: 'bg-amber-100 text-amber-800',
        targetTab: 'sports',
      },
    ];
  } else if (isHR) {
    sectionTitle = 'مؤشرات الموارد البشرية وشؤون العاملين';
    cards = [
      {
        id: 'staff',
        title: 'العاملون بالمدرسة',
        value: loading ? '...' : (metrics?.totalStaff || 18),
        unit: 'عضو',
        subtitle: 'معلمون ومهندسون وإداريون',
        icon: Briefcase,
        gradient: 'from-blue-600 to-indigo-600',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200/80',
        badge: 'فريق العمل',
        badgeColor: 'bg-blue-100 text-blue-800',
        targetTab: 'hr',
      },
      {
        id: 'attendance',
        title: 'نسبة حضور العاملين اليوم',
        value: loading ? '...' : `${metrics?.staffAttendanceRate ?? 0}%`,
        unit: '',
        subtitle: `${metrics?.activeStaffToday || 0} من إجمالي ${metrics?.totalStaff || 18} سجلوا الحضور اليوم`,
        icon: Clock,
        gradient: 'from-emerald-600 to-teal-600',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200/80',
        badge: metrics?.staffAttendanceRate >= 80 ? 'حضور منتظم' : 'يحتاج متابعة',
        badgeColor: 'bg-emerald-100 text-emerald-800',
        targetTab: 'hr',
      },
      {
        id: 'leaves',
        title: 'طلبات الإجازات والأذونات',
        value: 'المتابعة اليومية',
        unit: '',
        subtitle: 'طلبات الإجازات الاعتيادية والمرضية والمأموريات',
        icon: FileCheck2,
        gradient: 'from-amber-600 to-orange-600',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200/80',
        badge: 'شؤون العاملين',
        badgeColor: 'bg-amber-100 text-amber-800',
        targetTab: 'hr',
      },
    ];
  } else if (isAssessmentCoordinator) {
    sectionTitle = 'مؤشرات التقييم والامتحانات المدرسية';
    cards = [
      {
        id: 'students',
        title: 'إجمالي الطلاب المستهدفين',
        value: loading ? '...' : (metrics?.totalStudents || 188),
        unit: 'طالب',
        subtitle: 'المقيدين بالامتحانات الشهرية والجدارات',
        icon: Users,
        gradient: 'from-[#5C2C90] to-[#7938BE]',
        textColor: 'text-[#5C2C90]',
        borderColor: 'border-purple-200/80',
        badge: 'الكنترول المدرسي',
        badgeColor: 'bg-purple-100 text-purple-800',
        targetTab: 'assessment',
      },
      {
        id: 'exams',
        title: 'الامتحانات الرسمية والكنترول',
        value: 'رصد الدرجات',
        unit: '',
        subtitle: 'اختبارات الشهور والتقييمات العملية المعتمدة',
        icon: GraduationCap,
        gradient: 'from-blue-600 to-indigo-600',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200/80',
        badge: 'الامتحانات',
        badgeColor: 'bg-blue-100 text-blue-800',
        targetTab: 'assessment',
      },
      {
        id: 'remedial',
        title: 'برامج التحسين العلاجي',
        value: 'متابعة مستمرة',
        unit: '',
        subtitle: 'خطط دعم الطلاب لرفع الكفاءة الأكاديمية',
        icon: CheckCircle2,
        gradient: 'from-emerald-600 to-teal-600',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200/80',
        badge: 'دعم تعليمي',
        badgeColor: 'bg-emerald-100 text-emerald-800',
        targetTab: 'assessment',
      },
    ];
  } else if (isQualityOrIT) {
    sectionTitle = 'مؤشرات الجودة والدعم التقني';
    cards = [
      {
        id: 'quality',
        title: 'مؤشرات الجودة والاعتماد',
        value: 'مطابق للمعايير',
        unit: '',
        subtitle: 'متابعة جاهزية البيئة التعليمية والاعتماد',
        icon: CheckCircle2,
        gradient: 'from-teal-600 to-emerald-600',
        textColor: 'text-teal-700',
        borderColor: 'border-teal-200/80',
        badge: 'جودة التعليم',
        badgeColor: 'bg-teal-100 text-teal-800',
        targetTab: 'quality',
      },
      {
        id: 'labs',
        title: 'جاهزية المعامل التكنولوجية',
        value: '100%',
        unit: '',
        subtitle: 'استقرار الأجهزة والشبكات والبرمجيات',
        icon: FileCheck2,
        gradient: 'from-blue-600 to-cyan-600',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200/80',
        badge: 'معامل WE',
        badgeColor: 'bg-blue-100 text-blue-800',
        targetTab: 'quality',
      },
      {
        id: 'students',
        title: 'إجمالي الطلاب المستفيدين',
        value: loading ? '...' : (metrics?.totalStudents || 188),
        unit: 'طالب',
        subtitle: 'في المعامل وقاعات التدريب التكنولوجي',
        icon: Users,
        gradient: 'from-[#5C2C90] to-[#7938BE]',
        textColor: 'text-[#5C2C90]',
        borderColor: 'border-purple-200/80',
        badge: 'المسارات الأربعة',
        badgeColor: 'bg-purple-100 text-purple-800',
        targetTab: 'quality',
      },
    ];
  } else {
    // Platform Admin / School Manager (Full Leadership Overview)
    sectionTitle = 'المؤشرات العامة للمدرسة';
    cards = [
      {
        id: 'students',
        title: 'إجمالي الطلاب',
        value: loading ? '...' : (metrics?.totalStudents || 188),
        unit: 'طالب',
        subtitle: 'الصفوف الأول والثاني والثالث',
        icon: Users,
        gradient: 'from-[#5C2C90] to-[#7938BE]',
        textColor: 'text-[#5C2C90]',
        borderColor: 'border-purple-200/80',
        badge: 'موزعون على الفصول',
        badgeColor: 'bg-purple-100 text-purple-800',
        targetTab: 'affairs',
      },
      {
        id: 'staff',
        title: 'العاملون بالمدرسة',
        value: loading ? '...' : (metrics?.totalStaff || 18),
        unit: 'عضو',
        subtitle: 'معلمون ومهندسون وإداريون',
        icon: Briefcase,
        gradient: 'from-blue-600 to-indigo-600',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200/80',
        badge: 'فريق العمل',
        badgeColor: 'bg-blue-100 text-blue-800',
        targetTab: 'manager',
      },
      {
        id: 'attendance',
        title: 'نسبة حضور العاملين اليوم',
        value: loading ? '...' : `${metrics?.staffAttendanceRate ?? 0}%`,
        unit: '',
        subtitle: `${metrics?.activeStaffToday || 0} من إجمالي ${metrics?.totalStaff || 18} سجلوا الحضور اليوم`,
        icon: Clock,
        gradient: 'from-emerald-600 to-teal-600',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200/80',
        badge: metrics?.staffAttendanceRate >= 80 ? 'حضور منتظم' : 'يحتاج متابعة',
        badgeColor: 'bg-emerald-100 text-emerald-800',
        targetTab: 'manager',
      },
      {
        id: 'assignments',
        title: 'الواجبات والمهام العملية',
        value: loading ? '...' : (metrics?.totalAssignments || 0),
        unit: 'تكليف',
        subtitle: `${metrics?.completionRate ?? 0}% نسبة التسليم (${metrics?.completedProgresses || 0} تسليم)`,
        icon: FileCheck2,
        gradient: 'from-amber-600 to-orange-600',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200/80',
        badge: 'مناهج الاتصالات والتكنولوجيا',
        badgeColor: 'bg-amber-100 text-amber-800',
        targetTab: 'teacher',
      },
      {
        id: 'parent_requests',
        title: 'طلبات أولياء الأمور المعلقة',
        value: loading ? '...' : (metrics?.pendingRequests ?? 0),
        unit: 'طلب',
        subtitle: 'في انتظار المراجعة بشؤون الطلاب',
        icon: Inbox,
        gradient: 'from-[#E4007C] to-rose-600',
        textColor: 'text-[#E4007C]',
        borderColor: 'border-pink-200/80',
        badge: (metrics?.pendingRequests || 0) > 0 ? 'قيد الانتظار' : 'تمت مراجعة الكل',
        badgeColor: (metrics?.pendingRequests || 0) > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800',
        targetTab: 'affairs',
      },
      {
        id: 'social',
        title: 'متابعات الأخصائي الاجتماعي',
        value: loading ? '...' : (metrics?.activeCasesCount ?? 0),
        unit: 'حالة',
        subtitle: 'حالات إرشاد سلوكي ومتابعة فردية',
        icon: HeartHandshake,
        gradient: 'from-violet-600 to-purple-800',
        textColor: 'text-violet-700',
        borderColor: 'border-violet-200/80',
        badge: 'متابعة سرية',
        badgeColor: 'bg-violet-100 text-violet-800',
        targetTab: 'social',
      },
    ];
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <TrendingUp size={18} className="text-[#5C2C90]" />
          <span>{sectionTitle}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigateTab && onNavigateTab(card.targetTab)}
              className={`group bg-white rounded-3xl p-5 border ${card.borderColor} shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between`}
            >
              {/* Subtle hover background highlight */}
              <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-l ${card.gradient}`} />

              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-bold text-slate-600">
                    {card.title}
                  </span>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white bg-gradient-to-br ${card.gradient} shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon size={19} />
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                    {card.value}
                  </span>
                  {card.unit && (
                    <span className="text-xs font-bold text-slate-400">
                      {card.unit}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] font-medium leading-relaxed">
                  {card.subtitle}
                </span>
                <span className={`${card.textColor} font-bold text-[11px] shrink-0 group-hover:translate-x-[-3px] transition-transform`}>
                  عرض التفاصيل ←
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
