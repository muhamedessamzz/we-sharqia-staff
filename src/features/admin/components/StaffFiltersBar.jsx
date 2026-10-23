import React from 'react';
import { Search, Filter, ShieldCheck, Briefcase, GraduationCap, Users } from 'lucide-react';

export default function StaffFiltersBar({
  searchQuery,
  onSearchChange,
  activeTab,
  onSelectTab,
  counts,
}) {
  const tabs = [
    { id: 'all', label: 'جميع الطاقم', count: counts.all, icon: Users },
    { id: 'teachers', label: 'المعلمون والمهندسون', count: counts.teachers, icon: GraduationCap },
    { id: 'managers', label: 'إدارة المدرسة', count: counts.managers, icon: Briefcase },
    { id: 'specialists', label: 'الأخصائيون والمنسقون', count: counts.specialists, icon: Filter },
    { id: 'superadmin', label: 'مسؤولو النظام', count: counts.superadmin, icon: ShieldCheck },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
      {/* Top Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTab(t.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-l from-[#5C2C90] to-[#7134b2] text-white shadow-md shadow-purple-900/15'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-white' : 'text-slate-500'} />
              <span>{t.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder="ابحث بالاسم الكامل، اسم المستخدم، البريد، أو التخصص..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2C90] focus:bg-white transition-all"
        />
        <Search size={17} className="absolute right-3.5 top-3 text-slate-400" />
      </div>
    </div>
  );
}
