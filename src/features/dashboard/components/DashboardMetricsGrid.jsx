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
} from 'lucide-react';

export default function DashboardMetricsGrid({ metrics, loading, onNavigateTab }) {
  const cards = [
    {
      id: 'students',
      title: 'إجمالي الطلاب',
      value: loading ? '...' : (metrics?.totalStudents || 150),
      unit: 'طالب',
      subtitle: 'الصفوف الأول والثاني والثالث',
      icon: Users,
      gradient: 'from-[#5C2C90] to-[#7938BE]',
      bgGlow: 'bg-purple-500/10',
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
      bgGlow: 'bg-blue-500/10',
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
      bgGlow: 'bg-emerald-500/10',
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
      bgGlow: 'bg-amber-500/10',
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
      bgGlow: 'bg-pink-500/10',
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
      bgGlow: 'bg-purple-500/10',
      textColor: 'text-violet-700',
      borderColor: 'border-violet-200/80',
      badge: 'متابعة سرية',
      badgeColor: 'bg-violet-100 text-violet-800',
      targetTab: 'social',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <TrendingUp size={18} className="text-[#5C2C90]" />
          <span>المؤشرات العامة للمدرسة</span>
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
