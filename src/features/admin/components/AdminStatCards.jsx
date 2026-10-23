import React from 'react';
import { ShieldCheck, Briefcase, GraduationCap, Award, Ban } from 'lucide-react';

export default function AdminStatCards({ counts, activeTab, onSelectTab }) {
  const cards = [
    {
      id: 'all',
      title: 'إجمالي المستخدمين',
      count: counts.all,
      subtitle: 'إدارة، معلمون، وأخصائيون',
      color: 'text-[#5C2C90]',
      activeBorder: 'border-[#5C2C90] ring-2 ring-purple-100 shadow-md',
      icon: Briefcase,
    },
    {
      id: 'superadmin',
      title: 'مسؤولو النظام',
      count: counts.superadmin,
      subtitle: 'صلاحيات كاملة',
      color: 'text-purple-700',
      activeBorder: 'border-purple-600 ring-2 ring-purple-100 shadow-md',
      icon: ShieldCheck,
    },
    {
      id: 'managers',
      title: 'إدارة المدرسة',
      count: counts.managers,
      subtitle: 'الإدارة المدرسية',
      color: 'text-indigo-700',
      activeBorder: 'border-indigo-600 ring-2 ring-indigo-100 shadow-md',
      icon: Award,
    },
    {
      id: 'teachers',
      title: 'المعلمون والمهندسون',
      count: counts.teachers,
      subtitle: 'المعلمون ومهندسو التدريب',
      color: 'text-blue-700',
      activeBorder: 'border-blue-600 ring-2 ring-blue-100 shadow-md',
      icon: GraduationCap,
    },
    {
      id: 'specialists',
      title: 'الأخصائيون والمنسقون',
      count: counts.specialists,
      subtitle: 'شؤون الطلاب والإرشاد والجودة',
      color: 'text-teal-700',
      activeBorder: 'border-teal-600 ring-2 ring-teal-100 shadow-md',
      icon: Award,
    },
    {
      id: 'suspended',
      title: 'حسابات موقوفة',
      count: counts.suspended,
      subtitle: 'حسابات غير نشطة',
      color: 'text-rose-600',
      activeBorder: 'border-rose-600 ring-2 ring-rose-100 shadow-md',
      icon: Ban,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = activeTab === c.id;
        return (
          <div
            key={c.id}
            onClick={() => onSelectTab(c.id)}
            className={`bg-white rounded-3xl p-4 border cursor-pointer transition-all ${
              isActive ? c.activeBorder : 'border-slate-200/80 shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xl sm:text-2xl font-black ${c.color}`}>{c.count}</span>
              <Icon size={18} className={c.color} />
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1 truncate">{c.title}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 truncate">{c.subtitle}</div>
          </div>
        );
      })}
    </div>
  );
}
