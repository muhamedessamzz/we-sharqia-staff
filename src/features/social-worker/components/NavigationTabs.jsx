import React from 'react';
import { 
  HeartHandshake, Scissors, Calendar, AlertOctagon, 
  PhoneCall, AlertTriangle 
} from 'lucide-react';

export default function NavigationTabs({ activeTab, onSelectTab, counts }) {
  const tabs = [
    { id: 'cases', title: 'دراسة الحالة', count: counts.cases || 0, icon: HeartHandshake },
    { id: 'grooming', title: 'المظهر والزي المدرسي', count: counts.grooming || 0, icon: Scissors },
    { id: 'absence', title: 'الغياب والإنذارات', count: counts.absence || 0, icon: Calendar },
    { id: 'disruption', title: 'لائحة الانضباط السلوكي', count: counts.disruption || 0, icon: AlertOctagon },
    { id: 'summons', title: 'استدعاء أولياء الأمور', count: counts.summons || 0, icon: PhoneCall },
    { id: 'warnings', title: 'المتابعة المبكرة', count: counts.earlyWarnings || 0, icon: AlertTriangle },
  ];

  return (
    <div className="w-full bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl font-bold text-xs lg:text-[13px] transition-all cursor-pointer select-none text-center ${
                isActive
                  ? 'bg-[#5C2C90] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Icon size={15} className="shrink-0" />
              <span className="truncate">{tab.title}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black shrink-0 transition-colors ${
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
