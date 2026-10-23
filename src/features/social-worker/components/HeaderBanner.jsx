import React from 'react';
import { HeartHandshake, Scissors, Calendar, AlertOctagon, Plus } from 'lucide-react';

export default function HeaderBanner({ 
  stats, 
  isSocialWorker = true,
  activeTab,
  onSelectTab,
  onOpenNewCase
}) {
  const { pendingGrooming = 0, totalAbsence = 0, totalDisruptions = 0, totalCases = 0 } = stats || {};

  const cards = [
    {
      id: 'cases',
      count: totalCases,
      title: 'حالات الدعم والإرشاد',
      subtitle: 'دراسة حالة ومتابعة فردية',
      icon: HeartHandshake,
      color: 'text-[#5C2C90]',
      iconBg: 'bg-purple-100 text-[#5C2C90]',
      border: 'border-purple-200/80 hover:border-purple-300 bg-purple-50/40 hover:bg-purple-50/80',
      activeBorder: 'border-[#5C2C90] ring-2 ring-purple-200 bg-purple-50/90 shadow-sm',
    },
    {
      id: 'grooming',
      count: pendingGrooming,
      title: 'المظهر والزي المدرسي',
      subtitle: 'مخالفات الزي والشعر',
      icon: Scissors,
      color: 'text-[#E4007C]',
      iconBg: 'bg-pink-100 text-[#E4007C]',
      border: 'border-pink-200/80 hover:border-pink-300 bg-pink-50/40 hover:bg-pink-50/80',
      activeBorder: 'border-[#E4007C] ring-2 ring-pink-200 bg-pink-50/90 shadow-sm',
    },
    {
      id: 'absence',
      count: totalAbsence,
      title: 'إنذارات الغياب',
      subtitle: 'سجلات الغياب والمتابعة',
      icon: Calendar,
      color: 'text-amber-700',
      iconBg: 'bg-amber-100 text-amber-700',
      border: 'border-amber-200/80 hover:border-amber-300 bg-amber-50/40 hover:bg-amber-50/80',
      activeBorder: 'border-amber-600 ring-2 ring-amber-200 bg-amber-50/90 shadow-sm',
    },
    {
      id: 'disruption',
      count: totalDisruptions,
      title: 'وقائع ومخالفات سلوكية',
      subtitle: 'مكافحة الشغب والانضباط',
      icon: AlertOctagon,
      color: 'text-rose-700',
      iconBg: 'bg-rose-100 text-rose-700',
      border: 'border-rose-200/80 hover:border-rose-300 bg-rose-50/40 hover:bg-rose-50/80',
      activeBorder: 'border-rose-600 ring-2 ring-rose-200 bg-rose-50/90 shadow-sm',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
      {/* Top Section: Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#5C2C90] to-[#E4007C] text-white flex items-center justify-center shadow-md shadow-purple-900/15 shrink-0">
            <HeartHandshake size={26} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              منظومة الإرشاد الطلابي والدعم السلوكي والتربوي
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              المتابعة النفسية، النظافة والشعر والزي، مكافحة الشغب، رصد الغياب، وإخطار واستدعاء أولياء الأمور.
            </p>
          </div>
        </div>

        {/* Social Worker Action Button (only for social workers) */}
        {isSocialWorker && onOpenNewCase && (
          <button
            onClick={onOpenNewCase}
            className="self-start md:self-auto flex items-center gap-2 bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-purple-900/15 transition-all cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>فتح ملف حالة جديدة</span>
          </button>
        )}
      </div>

      {/* 4 Coordinated Stat Cards in a balanced, responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
        {cards.map((card) => {
          const Icon = card.icon;
          const isActive = activeTab === card.id;
          return (
            <div
              key={card.id}
              onClick={() => onSelectTab && onSelectTab(card.id)}
              className={`rounded-2xl p-3.5 sm:p-4 border transition-all cursor-pointer ${
                isActive ? card.activeBorder : `${card.border} shadow-2xs`
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xl sm:text-2xl font-black ${card.color}`}>
                  {card.count}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="text-xs font-black text-slate-800 truncate">
                {card.title}
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
                {card.subtitle}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
