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
} from 'lucide-react';

export default function DashboardShortcuts({ onNavigateTab }) {
  const shortcuts = [
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
      tab: 'manager',
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

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Zap size={18} className="text-[#E4007C]" />
            <span>الوصول السريع</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            روابط مباشرة لأهم المهام اليومية للإداريين والمعلمين
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
