import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, LogOut, ArrowRightCircle } from 'lucide-react';
import { api } from '../api/client';

export default function StaffAttendanceButton({ user }) {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchStatus = async () => {
    if (!user?.id) return;
    try {
      const records = await api.getTodayStaffAttendance();
      if (Array.isArray(records)) {
        const myRecord = records.find(
          (r) => r.userId === user.id || r.fullName === user.fullName
        );
        setRecord(myRecord || null);
      }
    } catch (err) {
      console.warn('Failed to load staff attendance status:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user?.id]);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const res = await api.staffCheckIn({
        userId: user.id,
        userName: user.fullName || user.username,
        fullName: user.fullName || user.username,
        userRole: user.role || 'staff',
        role: user.role || 'staff',
        status: 'present',
        notes: 'تسجيل ذاتي عبر البوابة',
      });
      setRecord(res);
      setMsg('تم تسجيل حضورك اليوم بنجاح ✅');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'فشل تسجيل الحضور');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!confirm('هل تود تسجيل الانصراف الآن؟')) return;
    setLoading(true);
    try {
      const res = await api.staffCheckOut(user.id);
      setRecord(res);
      setMsg('تم تسجيل انصرافك بنجاح. يومك سعيد! 👋');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'فشل تسجيل الانصراف');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const formatTime = (utcDate) => {
    if (!utcDate) return '';
    return new Date(utcDate).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex items-center gap-2">
      {msg && (
        <span className="hidden md:inline-flex text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl animate-fade-in">
          {msg}
        </span>
      )}

      {!record ? (
        <button
          onClick={handleCheckIn}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          title="تسجيل حضورك اليوم في المدرسة"
        >
          <Clock size={14} className="animate-spin-slow" />
          <span>{loading ? 'جارٍ الرصد...' : 'تسجيل حضور اليوم 🕒'}</span>
        </button>
      ) : record.checkOutUtc ? (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
          <CheckCircle2 size={14} className="text-slate-500" />
          <span>تم الانصراف ({formatTime(record.checkOutUtc)})</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>حاضر ({formatTime(record.checkInUtc)})</span>
          </div>

          <button
            onClick={handleCheckOut}
            disabled={loading}
            className="text-[11px] font-bold text-slate-500 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 px-2 py-1 rounded-lg transition-all cursor-pointer"
            title="تسجيل موعد الانصراف"
          >
            <span className="hidden sm:inline">تسجيل انصراف</span>
            <LogOut size={12} className="inline sm:hidden" />
          </button>
        </div>
      )}
    </div>
  );
}
