import React from 'react';
import { Users, CheckCircle2, Bell, Star, ArrowUpRight } from 'lucide-react';

export default function ManagerStatCards({
  overview,
  notificationsCount = 0,
  onSelectTab,
}) {
  const staffAttendancePercent = overview?.totalStaffCount
    ? Math.round((overview.activeTodayStaffCount / overview.totalStaffCount) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Active Staff Today (clickable to Attendance Tab) */}
      <div
        onClick={() => onSelectTab && onSelectTab('attendance')}
        className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        title="فتح سجل حضور وانصراف العاملين"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
            <span>حضور العاملين اليوم</span>
            <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Users size={20} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {overview?.activeTodayStaffCount || 0}
            </span>
            <span className="text-xs font-bold text-slate-400">
              من إجمالي {overview?.totalStaffCount || 0} موظفًا
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${staffAttendancePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card 2: Tasks Done & Correction Rate */}
      <div
        onClick={() => onSelectTab && onSelectTab('staff')}
        className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 group-hover:text-blue-700 transition-colors flex items-center gap-1">
            <span>الواجبات والتصحيح</span>
            <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <CheckCircle2 size={20} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {overview?.totalPublishedAssignments || 0}
            </span>
            <span className="text-xs font-bold text-slate-400">
              واجب منشور ({overview?.totalGradedSubmissions || 0} إجابة مصححة)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full w-[94%]" />
          </div>
        </div>
      </div>

      {/* Card 3: Active Notifications */}
      <div
        onClick={() => onSelectTab && onSelectTab('notifications')}
        className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 group-hover:text-[#5C2C90] transition-colors flex items-center gap-1">
            <span>الإشعارات النشطة</span>
            <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5C2C90] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Bell size={20} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {notificationsCount}
            </span>
            <span className="text-xs font-bold text-slate-400">
              إشعار مرسل
            </span>
          </div>
          <p className="text-[11px] font-bold text-purple-700 mt-2">
            متابعة نسبة القراءة والاطلاع
          </p>
        </div>
      </div>

      {/* Card 4: Staff Overall Performance Rating */}
      <div
        onClick={() => onSelectTab && onSelectTab('staff')}
        className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 group-hover:text-amber-700 transition-colors flex items-center gap-1">
            <span>متوسط تقييم العاملين</span>
            <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Star size={20} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {overview?.averageStaffRating || 4.8}
            </span>
            <span className="text-xs font-bold text-slate-400">من 5 نجوم</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
