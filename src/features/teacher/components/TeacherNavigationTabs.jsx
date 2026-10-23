import React from 'react';
import { Activity, BookOpen, PenTool, Megaphone, Award, CalendarCheck, Calendar, UserCheck } from 'lucide-react';

export default function TeacherNavigationTabs({ activeTab, setActiveTab, counts = {} }) {
  const tabs = [
    {
      id: 'live',
      title: 'المتابعة المباشرة',
      count: counts.live ?? 0,
      icon: Activity
    },
    {
      id: 'attendance',
      title: 'غياب الطلاب',
      icon: CalendarCheck
    },
    {
      id: 'my_attendance',
      title: 'سجل حضوري وغيابي',
      icon: UserCheck
    },
    {
      id: 'schedule',
      title: 'جدولي المدرسي',
      icon: Calendar
    },
    {
      id: 'assignments',
      title: 'الواجبات والاختبارات',
      count: counts.assignments ?? 0,
      icon: BookOpen
    },
    {
      id: 'grading',
      title: 'تصحيح الإجابات',
      count: counts.submissions ?? 0,
      icon: PenTool
    },
    {
      id: 'announcements',
      title: 'تنبيهات الفصل',
      count: counts.announcements ?? 0,
      icon: Megaphone
    },
    {
      id: 'gradebook',
      title: 'سجل الدرجات',
      icon: Award
    }
  ];

  return (
    <div className="w-full bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 py-2.5 rounded-xl font-bold text-[11px] 2xl:text-xs transition-all cursor-pointer select-none text-center whitespace-nowrap ${
                isActive
                  ? 'bg-[#5C2C90] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Icon size={14} className="shrink-0" />
              <span>{tab.title}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
