import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function DashboardHero({ user, onRefresh, loading }) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('ar-EG', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5C2C90] via-[#481f73] to-[#26163A] text-white p-6 sm:p-8 shadow-xl shadow-purple-950/15 border border-purple-800/40">
      {/* Decorative background glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#E4007C]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left/Main Column: Welcome */}
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            لوحة التحكم المدرسية
          </h1>

          <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed font-medium">
            أهلًا بك، <span className="font-extrabold text-white underline decoration-[#E4007C] decoration-2 underline-offset-4">{user?.fullName || 'زميلنا العزيز'}</span>. تابع سير اليوم الدراسي، واطّلع على الحضور والتقييمات، وانتقل بسهولة إلى أقسام المدرسة.
          </p>
        </div>

        {/* Right Column: Sleek Date/Time & Refresh */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 shadow-lg shadow-black/10 flex items-center gap-4">
            <div className="text-right">
              <div className="font-mono text-xl sm:text-2xl font-black text-white tracking-wider">
                {timeStr || '--:--:--'}
              </div>
              <div className="text-xs text-purple-200/90 font-medium">
                {dateStr || 'اليوم الدراسي'}
              </div>
            </div>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/15 hover:bg-white text-white hover:text-[#5C2C90] transition-all cursor-pointer active:scale-95 disabled:opacity-60 shrink-0 shadow-xs"
              title="تحديث البيانات"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
