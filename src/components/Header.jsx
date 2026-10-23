import React from 'react';
import { LogOut, ExternalLink, Menu } from 'lucide-react';
import NotificationBell from './NotificationBell';
import HeaderAttendanceWidget from './HeaderAttendanceWidget';
import { getRoleBadgeInfo } from '../features/admin/constants';

export default function Header({ user, onLogout, activeTabItem, onToggleMobileMenu }) {
  const roleCfg = user ? getRoleBadgeInfo(user) : null;
  const rawName = user?.fullName === 'Master Super Admin' || user?.fullName?.includes('Super Admin')
    ? 'مسؤول النظام'
    : (user?.fullName || '');
  const displayName = rawName ? rawName.replace(/\s*\([^)]*\)\s*$/i, '').trim() : '';

  return (
    <header className="relative z-40 w-full transition-all">
      <div className="relative bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-sm rounded-3xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Right side in RTL: Mobile menu toggle + Active Section Breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger toggle */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-2xl bg-purple-50 text-[#5C2C90] hover:bg-purple-100 transition-colors"
              title="القائمة الجانبية"
            >
              <Menu size={18} />
            </button>
          )}

          {/* Active section info */}
          {activeTabItem && (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#5C2C90] flex items-center justify-center font-bold shrink-0">
                {activeTabItem.icon && <activeTabItem.icon size={18} />}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 leading-none">
                  القسم الحالي
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight mt-0.5">
                  {activeTabItem.title}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Left side in RTL: User Profile & Actions */}
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Staff Attendance Widget */}
            <HeaderAttendanceWidget user={user} />

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {displayName}
              </span>
              {roleCfg && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleCfg.color}`}>
                  {roleCfg.label}
                </span>
              )}
            </div>

            {/* Notification Bell */}
            <NotificationBell user={user} />

            <span className="text-slate-300">|</span>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition-colors py-1.5 px-2.5 rounded-xl hover:bg-rose-50 font-semibold cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>
        ) : (
          <a
            href="http://localhost:5173"
            className="flex items-center gap-1.5 text-xs font-bold text-[#5C2C90] bg-purple-50 hover:bg-purple-100 border border-purple-200/70 px-3 py-1.5 rounded-xl transition-all"
            title="الانتقال إلى بوابة الطلاب وأولياء الأمور"
          >
            <span>بوابة الطلاب وأولياء الأمور</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </header>
  );
}
