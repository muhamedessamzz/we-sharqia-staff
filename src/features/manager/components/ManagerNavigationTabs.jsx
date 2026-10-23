import React from 'react';
import { Users, Clock, Bell, CalendarCheck, Calendar } from 'lucide-react';

export default function ManagerNavigationTabs({
  activeTab,
  setActiveTab,
  staffCount = 0,
  notificationsCount = 0,
  attendanceRate = 0,
  attendedCount = 0,
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-2 flex flex-wrap gap-2 shadow-sm">
      <button
        onClick={() => setActiveTab('staff')}
        className={`flex-1 sm:flex-initial px-4 sm:px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
          activeTab === 'staff'
            ? 'bg-[#5C2C90] text-white shadow-md shadow-purple-900/20'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <Users size={16} />
        <span>العاملون بالمدرسة</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'staff' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
          {staffCount}
        </span>
      </button>

      <button
        onClick={() => setActiveTab('schedule')}
        className={`flex-1 sm:flex-initial px-4 sm:px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
          activeTab === 'schedule'
            ? 'bg-[#5C2C90] text-white shadow-md shadow-purple-900/20'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <Calendar size={16} />
        <span>الجدول وكارتات الإشراف</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'schedule' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
          معتمد
        </span>
      </button>

      <button
        onClick={() => setActiveTab('attendance')}
        className={`flex-1 sm:flex-initial px-4 sm:px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
          activeTab === 'attendance'
            ? 'bg-[#5C2C90] text-white shadow-md shadow-purple-900/20'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <CalendarCheck size={16} />
        <span>حضور وانصراف العاملين</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${activeTab === 'attendance' ? 'bg-emerald-400 text-slate-950 font-black' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
          {attendedCount}/{staffCount} ({attendanceRate}%)
        </span>
      </button>

      <button
        onClick={() => setActiveTab('audit')}
        className={`flex-1 sm:flex-initial px-4 sm:px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
          activeTab === 'audit'
            ? 'bg-[#5C2C90] text-white shadow-md shadow-purple-900/20'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <Clock size={16} />
        <span>سجل العمليات</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'audit' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
          مباشر
        </span>
      </button>

      <button
        onClick={() => setActiveTab('notifications')}
        className={`flex-1 sm:flex-initial px-4 sm:px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
          activeTab === 'notifications'
            ? 'bg-[#5C2C90] text-white shadow-md shadow-purple-900/20'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <Bell size={16} />
        <span>الإشعارات المدرسية</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'notifications' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
          {notificationsCount}
        </span>
      </button>
    </div>
  );
}
