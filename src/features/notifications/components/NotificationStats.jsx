import React from 'react';
import { Bell, Users, User, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function NotificationStats({ notifications = [] }) {
  const totalCount = notifications.length;
  const broadcastCount = notifications.filter(n => n.targetRole === 'all' || n.targetRole === 'all_school').length;
  const singleUserCount = notifications.filter(n => n.targetRole === 'single_user').length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' || n.priority === 'administrative').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Sent */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-bold">إجمالي الإشعارات</span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5C2C90] flex items-center justify-center">
            <Bell size={16} />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900">{totalCount}</div>
        <p className="text-[11px] text-slate-400 font-bold mt-1">توجيه وتعميم صادر</p>
      </div>

      {/* 2. Broadcast to all */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-bold">تعميمات الطاقم بالكامل</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Users size={16} />
          </div>
        </div>
        <div className="text-2xl font-black text-indigo-900">{broadcastCount}</div>
        <p className="text-[11px] text-slate-400 font-bold mt-1">يصل لكافة الـ 14 موظفاً</p>
      </div>

      {/* 3. Direct to single staff */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-bold">إشعارات فردية خاصة</span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <User size={16} />
          </div>
        </div>
        <div className="text-2xl font-black text-purple-900">{singleUserCount}</div>
        <p className="text-[11px] text-slate-400 font-bold mt-1">توجيه مباشر لشخص بعينه</p>
      </div>

      {/* 4. Urgent / Administrative */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-bold">عاجلة وتنبيهات إدارية</span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert size={16} />
          </div>
        </div>
        <div className="text-2xl font-black text-rose-700">{urgentCount}</div>
        <p className="text-[11px] text-slate-400 font-bold mt-1">تتطلب إجراءً سريعاً</p>
      </div>
    </div>
  );
}
