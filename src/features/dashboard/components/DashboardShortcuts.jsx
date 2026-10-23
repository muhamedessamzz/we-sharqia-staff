import React from 'react';
import {
  Zap,
  UserCheck,
  MailQuestion,
  CalendarCheck2,
  GraduationCap,
  BellRing,
  Shirt,
  HeartHandshake,
  BarChart3,
  ArrowLeft,
  Calendar,
  Trophy,
  FileCheck2,
  Laptop,
  Activity,
  Users,
  AlertCircle,
  Award
} from 'lucide-react';

export default function DashboardShortcuts({ user, onNavigateTab }) {
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

  let shortcuts = [];
  let subtitle = 'روابط مباشرة لأهم المهام اليومية المتخصصة';

  if (isTechnicalEngineer) {
    subtitle = 'روابط مباشرة لمهام التدريب العملي والمعامل التخصصية';
    shortcuts = [
      {
        id: 'lab_attendance',
        title: 'حضور وغياب معمل التخصص',
        description: 'تسجيل حضور وغياب الطلاب في معامل التدريب العملي',
        icon: UserCheck,
        tab: 'teacher',
        tag: 'المعامل والتدريب',
        color: 'hover:border-purple-300 hover:bg-purple-50/50',
        iconBg: 'bg-purple-100 text-[#5C2C90]',
        btnColor: 'text-[#5C2C90]',
      },
      {
        id: 'live_board',
        title: 'لوحة المتابعة الحية في المعمل',
        description: 'متابعة تفاعل الطلاب اللحظي وطلبات المساعدة وتسليم التجارب',
        icon: Activity,
        tab: 'teacher',
        tag: 'المعمل التفاعلي',
        color: 'hover:border-emerald-300 hover:bg-emerald-50/50',
        iconBg: 'bg-emerald-100 text-emerald-700',
        btnColor: 'text-emerald-700',
      },
      {
        id: 'lab_assignments',
        title: 'التكليفات والمشاريع العملية',
        description: 'إدارة وتصحيح التكليفات العملية للمسارات التكنولوجية',
        icon: FileCheck2,
        tab: 'teacher',
        tag: 'التدريب العملي',
        color: 'hover:border-amber-300 hover:bg-amber-50/50',
        iconBg: 'bg-amber-100 text-amber-700',
        btnColor: 'text-amber-700',
      },
      {
        id: 'grades_entry',
        title: 'رصد تقييمات الجدارات',
        description: 'إدخال درجات التقييم العملي والمهاري والاختبارات',
        icon: GraduationCap,
        tab: 'assessment',
        tag: 'الامتحانات والدرجات',
        color: 'hover:border-blue-300 hover:bg-blue-50/50',
        iconBg: 'bg-blue-100 text-blue-600',
        btnColor: 'text-blue-600',
      },
      {
        id: 'lab_schedule',
        title: 'جدول المعامل الأسبوعي',
        description: 'استعراض مواعيد فترات التدريب العملي وقاعات المعامل',
        icon: Calendar,
        tab: 'schedule',
        tag: 'الجدول المدرسي',
        color: 'hover:border-indigo-300 hover:bg-indigo-50/50',
        iconBg: 'bg-indigo-100 text-indigo-700',
        btnColor: 'text-indigo-700',
      },
    ];
  } else if (isTeacher) {
    subtitle = 'روابط مباشرة للمهام التدريسية ومتابعة الفصول الدراسية';
    shortcuts = [
      {
        id: 'student_attendance',
        title: 'تسجيل غياب الطلاب',
        description: 'تسجيل حضور وغياب الطلاب في الفصول الدراسية',
        icon: UserCheck,
        tab: 'teacher',
        tag: 'التدريس والفصول',
        color: 'hover:border-purple-300 hover:bg-purple-50/50',
        iconBg: 'bg-purple-100 text-[#5C2C90]',
        btnColor: 'text-[#5C2C90]',
      },
      {
        id: 'live_board',
        title: 'لوحة المتابعة الحية بالفصل',
        description: 'متابعة تفاعل الطلاب أثناء الحصة ونشاطهم الفصلي',
        icon: Activity,
        tab: 'teacher',
        tag: 'الفصل الذكي',
        color: 'hover:border-emerald-300 hover:bg-emerald-50/50',
        iconBg: 'bg-emerald-100 text-emerald-700',
        btnColor: 'text-emerald-700',
      },
      {
        id: 'assignments',
        title: 'الواجبات والتكليفات المدرسية',
        description: 'إنشاء ومتابعة تسليمات الواجبات والاختبارات التدرجية',
        icon: FileCheck2,
        tab: 'teacher',
        tag: 'التدريس',
        color: 'hover:border-amber-300 hover:bg-amber-50/50',
        iconBg: 'bg-amber-100 text-amber-700',
        btnColor: 'text-amber-700',
      },
      {
        id: 'grades_entry',
        title: 'درجات الامتحانات والتقييمات',
        description: 'إدخال درجات الاختبارات الشهرية والتقييمات التراكمية',
        icon: GraduationCap,
        tab: 'assessment',
        tag: 'الامتحانات',
        color: 'hover:border-blue-300 hover:bg-blue-50/50',
        iconBg: 'bg-blue-100 text-blue-600',
        btnColor: 'text-blue-600',
      },
      {
        id: 'schedule',
        title: 'جدول الحصص الأسبوعي',
        description: 'استعراض مواعيد الحصص الدراسية وجدول الإشراف المعتمد',
        icon: Calendar,
        tab: 'schedule',
        tag: 'الجدول المدرسي',
        color: 'hover:border-indigo-300 hover:bg-indigo-50/50',
        iconBg: 'bg-indigo-100 text-indigo-700',
        btnColor: 'text-indigo-700',
      },
    ];
  } else if (isStudentAffairs) {
    subtitle = 'روابط سريعة لإدارة شؤون الطلاب وخدمات أولياء الأمور';
    shortcuts = [
      {
        id: 'student_roster',
        title: 'الطلاب والفصول الدراسية',
        description: 'استعراض سجلات وبيانات الطلاب وقوائم الفصول المعتمدة',
        icon: Users,
        tab: 'affairs',
        tag: 'شؤون الطلاب',
        color: 'hover:border-purple-300 hover:bg-purple-50/50',
        iconBg: 'bg-purple-100 text-[#5C2C90]',
        btnColor: 'text-[#5C2C90]',
      },
      {
        id: 'parent_requests',
        title: 'طلبات أولياء الأمور',
        description: 'متابعة وفحص طلبات الإجازات والأعذار الطبية والمقابلات',
        icon: MailQuestion,
        tab: 'affairs',
        tag: 'شؤون الطلاب',
        color: 'hover:border-pink-300 hover:bg-pink-50/50',
        iconBg: 'bg-pink-100 text-[#E4007C]',
        btnColor: 'text-[#E4007C]',
      },
      {
        id: 'uniform_log',
        title: 'متابعة الزي والمظهر المدرسي',
        description: 'متابعة التزام الطلاب بالزي المدرسي الموحد وقواعد الانضباط',
        icon: Shirt,
        tab: 'affairs',
        tag: 'الانضباط المدرسي',
        color: 'hover:border-emerald-300 hover:bg-emerald-50/50',
        iconBg: 'bg-emerald-100 text-emerald-700',
        btnColor: 'text-emerald-700',
      },
      {
        id: 'schedule',
        title: 'الجدول المدرسي والإشراف',
        description: 'استعراض خطة توزيع الحصص وفترات الإشراف اليومي',
        icon: Calendar,
        tab: 'schedule',
        tag: 'الجدول المدرسي',
        color: 'hover:border-indigo-300 hover:bg-indigo-50/50',
        iconBg: 'bg-indigo-100 text-indigo-700',
        btnColor: 'text-indigo-700',
      },
    ];
  } else if (isAssessmentCoordinator) {
    subtitle = 'روابط سريعة لأعمال الكنترول ورصد الدرجات والتقييمات';
    shortcuts = [
      {
        id: 'grades_entry',
        title: 'درجات الامتحانات والجدارات',
        description: 'رصد ومراجعة درجات الاختبارات الشهرية والتقييمات التطبيقية',
        icon: GraduationCap,
        tab: 'assessment',
        tag: 'الامتحانات والدرجات',
        color: 'hover:border-amber-300 hover:bg-amber-50/50',
        iconBg: 'bg-amber-100 text-amber-700',
        btnColor: 'text-amber-700',
      },
      {
        id: 'exam_management',
        title: 'إدارة الامتحانات المدرسية',
        description: 'جداول الامتحانات ورصد نتائج الفصول واللجان',
        icon: FileCheck2,
        tab: 'assessment',
        tag: 'الكنترول المدرسي',
        color: 'hover:border-blue-300 hover:bg-blue-50/50',
        iconBg: 'bg-blue-100 text-blue-600',
        btnColor: 'text-blue-600',
      },
      {
        id: 'remedial',
        title: 'برامج التحسين العلاجي',
        description: 'متابعة الطلاب دون المستوى المطلوب وخطط الدعم الأكاديمي',
        icon: Award,
        tab: 'assessment',
        tag: 'التقييم والجودة',
        color: 'hover:border-emerald-300 hover:bg-emerald-50/50',
        iconBg: 'bg-emerald-100 text-emerald-700',
        btnColor: 'text-emerald-700',
      },
      {
        id: 'schedule',
        title: 'الجدول المدرسي وجداول اللجان',
        description: 'مواعيد الفترات وجداول الاختبارات واللجان المدرسية',
        icon: Calendar,
        tab: 'schedule',
        tag: 'الجدول المدرسي',
        color: 'hover:border-indigo-300 hover:bg-indigo-50/50',
        iconBg: 'bg-indigo-100 text-indigo-700',
        btnColor: 'text-indigo-700',
      },
    ];
  } else if (isSportsCoach) {
    subtitle = 'روابط سريعة لمهام التربية الرياضية واللياقة البدنية';
    shortcuts = [
      {
        id: 'morning_assembly',
        title: 'طابور الصباح والنشاط الرياضي',
        description: 'تسجيل حضور وانضباط الطلاب في الطابور الصباحي',
        icon: UserCheck,
        tab: 'sports',
        tag: 'التربية الرياضية',
        color: 'hover:border-emerald-300 hover:bg-emerald-50/50',
        iconBg: 'bg-emerald-100 text-emerald-700',
        btnColor: 'text-emerald-700',
      },
      {
        id: 'fitness_assessment',
        title: 'بطاقات التقييم البدني',
        description: 'رصد درجات اللياقة والسرعة والتحمل البدني للطلاب',
        icon: Trophy,
        tab: 'sports',
        tag: 'اللياقة البدنية',
        color: 'hover:border-amber-300 hover:bg-amber-50/50',
        iconBg: 'bg-amber-100 text-amber-700',
        btnColor: 'text-amber-700',
      },
      {
        id: 'tournaments',
        title: 'البطولات والأنشطة المدرسية',
        description: 'إدارة دوري كرة القدم والمسابقات الرياضية بين الفصول',
        icon: Award,
        tab: 'sports',
        tag: 'البطولات المدرسية',
        color: 'hover:border-purple-300 hover:bg-purple-50/50',
        iconBg: 'bg-purple-100 text-[#5C2C90]',
        btnColor: 'text-[#5C2C90]',
      },
      {
        id: 'schedule',
        title: 'الجدول المدرسي وإشراف الفناء',
        description: 'مواعيد الحصص الرياضية وخطة الإشراف الميداني',
        icon: Calendar,
        tab: 'schedule',
        tag: 'الجدول المدرسي',
        color: 'hover:border-indigo-300 hover:bg-indigo-50/50',
        iconBg: 'bg-indigo-100 text-indigo-700',
        btnColor: 'text-indigo-700',
      },
    ];
  } else if (isSocialWorker) {
    subtitle = 'روابط سريعة لخدمات الإرشاد السلوكي والرعاية الاجتماعية';
    shortcuts = [
      {
        id: 'social_support',
        title: 'سجلات الرعاية الاجتماعية',
        description: 'متابعة الحالات الطلابية وجلسات الإرشاد السلوكي',
        icon: HeartHandshake,
        tab: 'social',
        tag: 'الأخصائي الاجتماعي',
        color: 'hover:border-violet-300 hover:bg-violet-50/50',
        iconBg: 'bg-violet-100 text-violet-700',
        btnColor: 'text-violet-700',
      },
      {
        id: 'summons',
        title: 'استدعاءات أولياء الأمور',
        description: 'إرسال ومتابعة خطابات استدعاء ولي الأمر للمدرسة',
        icon: MailQuestion,
        tab: 'social',
        tag: 'استدعاءات رسمية',
        color: 'hover:border-pink-300 hover:bg-pink-50/50',
        iconBg: 'bg-pink-100 text-[#E4007C]',
        btnColor: 'text-[#E4007C]',
      },
      {
        id: 'early_warnings',
        title: 'مؤشرات الإنذار المبكر',
        description: 'رصد حالات تكرار الغياب والتراجع السلوكي والتحصيل',
        icon: AlertCircle,
        tab: 'social',
        tag: 'المتابعة الوقائية',
        color: 'hover:border-amber-300 hover:bg-amber-50/50',
        iconBg: 'bg-amber-100 text-amber-700',
        btnColor: 'text-amber-700',
      },
      {
        id: 'workshops',
        title: 'الندوات وورش التوعية',
        description: 'توثيق المبادرات التوعوية والإرشادية المنفذة للطلاب',
        icon: Users,
        tab: 'social',
        tag: 'التوعية والإرشاد',
        color: 'hover:border-blue-300 hover:bg-blue-50/50',
        iconBg: 'bg-blue-100 text-blue-600',
        btnColor: 'text-blue-600',
      },
    ];
  } else if (isHR) {
    subtitle = 'روابط سريعة لمهام شؤون العاملين والموارد البشرية';
    shortcuts = [
      {
        id: 'staff_log',
        title: 'حضور وانصراف العاملين',
        description: 'متابعة الحضور اليومي والتأخيرات وسجلات البصمة',
        icon: CalendarCheck2,
        tab: 'hr',
        tag: 'الموارد البشرية',
        color: 'hover:border-blue-300 hover:bg-blue-50/50',
        iconBg: 'bg-blue-100 text-blue-600',
        btnColor: 'text-blue-600',
      },
      {
        id: 'leave_requests',
        title: 'طلبات الإجازات والأذونات',
        description: 'فحص واعتماد الإجازات الاعتيادية والمرضية والمأموريات',
        icon: MailQuestion,
        tab: 'hr',
        tag: 'شؤون العاملين',
        color: 'hover:border-amber-300 hover:bg-amber-50/50',
        iconBg: 'bg-amber-100 text-amber-700',
        btnColor: 'text-amber-700',
      },
      {
        id: 'evaluations',
        title: 'تقييمات أداء العاملين',
        description: 'نماذج التقييم السنوي والانضباط المهني لطاقم المدرسة',
        icon: Award,
        tab: 'hr',
        tag: 'تقييم الأداء',
        color: 'hover:border-purple-300 hover:bg-purple-50/50',
        iconBg: 'bg-purple-100 text-[#5C2C90]',
        btnColor: 'text-[#5C2C90]',
      },
      {
        id: 'schedule',
        title: 'الجدول المدرسي والإشراف',
        description: 'متابعة توزيع الحصص والتواجد المدرسي اليومي',
        icon: Calendar,
        tab: 'schedule',
        tag: 'الجدول المدرسي',
        color: 'hover:border-indigo-300 hover:bg-indigo-50/50',
        iconBg: 'bg-indigo-100 text-indigo-700',
        btnColor: 'text-indigo-700',
      },
    ];
  } else if (isQualityOrIT) {
    subtitle = 'روابط سريعة لمتابعة الجودة والدعم التقني والمعامل';
    shortcuts = [
      {
        id: 'quality_reports',
        title: 'تقارير ومؤشرات الجودة',
        description: 'متابعة مؤشرات الاعتماد ونسب النجاح المدرسية',
        icon: BarChart3,
        tab: 'quality',
        tag: 'تقارير الجودة',
        color: 'hover:border-teal-300 hover:bg-teal-50/50',
        iconBg: 'bg-teal-100 text-teal-700',
        btnColor: 'text-teal-700',
      },
      {
        id: 'lab_readiness',
        title: 'جاهزية المعامل التكنولوجية',
        description: 'متابعة أجهزة الحواسيب والشبكات والبرمجيات وقاعات التدريب',
        icon: Laptop,
        tab: 'quality',
        tag: 'الدعم التقني',
        color: 'hover:border-blue-300 hover:bg-blue-50/50',
        iconBg: 'bg-blue-100 text-blue-600',
        btnColor: 'text-blue-600',
      },
      {
        id: 'schedule',
        title: 'الجدول المدرسي والإشراف',
        description: 'متابعة استغلال قاعات المعامل وجدول الحصص الدراسية',
        icon: Calendar,
        tab: 'schedule',
        tag: 'الجدول المدرسي',
        color: 'hover:border-indigo-300 hover:bg-indigo-50/50',
        iconBg: 'bg-indigo-100 text-indigo-700',
        btnColor: 'text-indigo-700',
      },
    ];
  } else {
    // Leadership: Platform Admin or School Manager
    subtitle = 'روابط مباشرة لأهم المهام اليومية للإداريين والقيادة المدرسية';
    shortcuts = [
      {
        id: 'student_attendance',
        title: 'تسجيل غياب الطلاب',
        description: 'تسجيل حضور وغياب الطلاب في الفصول والمعامل',
        icon: UserCheck,
        tab: 'teacher',
        tag: 'التدريس والفصول',
        color: 'hover:border-purple-300 hover:bg-purple-50/50',
        iconBg: 'bg-purple-100 text-[#5C2C90]',
        btnColor: 'text-[#5C2C90]',
      },
      {
        id: 'parent_requests',
        title: 'طلبات أولياء الأمور',
        description: 'متابعة طلبات الإجازات والأعذار الطبية والمقابلات',
        icon: MailQuestion,
        tab: 'affairs',
        tag: 'شؤون الطلاب',
        color: 'hover:border-pink-300 hover:bg-pink-50/50',
        iconBg: 'bg-pink-100 text-[#E4007C]',
        btnColor: 'text-[#E4007C]',
      },
      {
        id: 'staff_log',
        title: 'حضور وانصراف العاملين',
        description: 'متابعة الحضور اليومي والتأخيرات والانصراف للعاملين',
        icon: CalendarCheck2,
        tab: 'manager',
        tag: 'إدارة المدرسة',
        color: 'hover:border-blue-300 hover:bg-blue-50/50',
        iconBg: 'bg-blue-100 text-blue-600',
        btnColor: 'text-blue-600',
      },
      {
        id: 'grades_entry',
        title: 'درجات الامتحانات والجدارات',
        description: 'إدخال درجات الاختبارات الشهرية والتقييمات العملية',
        icon: GraduationCap,
        tab: 'assessment',
        tag: 'الامتحانات والدرجات',
        color: 'hover:border-amber-300 hover:bg-amber-50/50',
        iconBg: 'bg-amber-100 text-amber-700',
        btnColor: 'text-amber-700',
      },
      {
        id: 'broadcast',
        title: 'إرسال إشعار',
        description: 'إرسال تنبيهات وتوجيهات للمعلمين والإداريين',
        icon: BellRing,
        tab: 'notifications',
        tag: 'إشعارات الإدارة',
        color: 'hover:border-indigo-300 hover:bg-indigo-50/50',
        iconBg: 'bg-indigo-100 text-indigo-700',
        btnColor: 'text-indigo-700',
      },
      {
        id: 'uniform_log',
        title: 'متابعة الزي والمظهر المدرسي',
        description: 'متابعة التزام الطلاب بالزي المدرسي وقواعد الانضباط',
        icon: Shirt,
        tab: 'affairs',
        tag: 'الانضباط المدرسي',
        color: 'hover:border-emerald-300 hover:bg-emerald-50/50',
        iconBg: 'bg-emerald-100 text-emerald-700',
        btnColor: 'text-emerald-700',
      },
      {
        id: 'social_support',
        title: 'سجلات الرعاية الاجتماعية',
        description: 'متابعة الحالات الطلابية وجلسات الإرشاد السلوكي',
        icon: HeartHandshake,
        tab: 'social',
        tag: 'الأخصائي الاجتماعي',
        color: 'hover:border-violet-300 hover:bg-violet-50/50',
        iconBg: 'bg-violet-100 text-violet-700',
        btnColor: 'text-violet-700',
      },
      {
        id: 'quality_reports',
        title: 'تقارير ومؤشرات الجودة',
        description: 'متابعة مؤشرات الاعتماد ونسب النجاح المدرسية',
        icon: BarChart3,
        tab: 'quality',
        tag: 'تقارير الجودة',
        color: 'hover:border-teal-300 hover:bg-teal-50/50',
        iconBg: 'bg-teal-100 text-teal-700',
        btnColor: 'text-teal-700',
      },
    ];
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Zap size={18} className="text-[#E4007C]" />
            <span>الوصول السريع</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {shortcuts.map((sc) => {
          const Icon = sc.icon;
          return (
            <button
              key={sc.id}
              onClick={() => onNavigateTab && onNavigateTab(sc.tab)}
              className={`text-right bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between group cursor-pointer ${sc.color} hover:shadow-md hover:-translate-y-0.5`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sc.iconBg} shadow-2xs group-hover:scale-110 transition-transform`}>
                    <Icon size={19} />
                  </div>
                  <span className="text-[10px] font-black bg-white border border-slate-200/60 px-2 py-0.5 rounded-lg text-slate-600">
                    {sc.tag}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 mb-1 leading-snug">
                  {sc.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {sc.description}
                </p>
              </div>

              <div className={`mt-3 pt-2.5 border-t border-slate-200/50 flex items-center justify-between text-xs font-black ${sc.btnColor}`}>
                <span>فتح القسم</span>
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
