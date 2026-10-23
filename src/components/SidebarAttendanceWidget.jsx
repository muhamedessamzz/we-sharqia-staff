import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, LogOut, Sparkles, UserCheck } from 'lucide-react';
import { api } from '../api/client';

export default function SidebarAttendanceWidget({ user }) {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const fetchStatus = async () => {
    if (!user?.id) return;
    try {
      const records = await api.getTodayStaffAttendance();
      if (Array.isArray(records)) {
        const myRecord = records.find(
          (r) => r.userId === user.id || (r.userName && r.userName.toLowerCase() === user.fullName?.toLowerCase())
        );
        setRecord(myRecord || null);
      }
    } catch (err) {
      console.warn('Failed to load attendance status:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user?.id, user?.fullName]);

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
      setMsg('تم تسجيل حضورك بنجاح ✅');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'فشل تسجيل الحضور');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!confirm('هل تود تسجيل موعد الانصراف الآن؟')) return;
    setLoading(true);
    try {
      const res = await api.staffCheckOut(user.id);
      setRecord(res);
      setMsg('تم تسجيل انصرافك. يومك سعيد! 👋');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'فشل تسجيل الانصراف');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const formatRecordTime = (utcDate) => {
    if (!utcDate) return '';
    return new Date(utcDate).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-gradient-to-bl from-purple-50/70 to-slate-50 border border-purple-100/90 rounded-2xl p-3 shadow-2xs space-y-2">
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
        <span className="flex items-center gap-1.5 text-slate-700">
          <Clock size={13} className="text-[#5C2C90]" />
          <span>حضور الكادر اليوم</span>
        </span>
        <span className="font-mono text-slate-400 text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
          {currentTime}
        </span>
      </div>

      {msg && (
        <div className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-xl text-center animate-fade-in">
          {msg}
        </div>
      )}

      {!record ? (
        <button
          onClick={handleCheckIn}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white py-2 px-3 rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
        >
          <UserCheck size={14} />
          <span>{loading ? 'جارٍ الرصد...' : 'تسجيل حضور اليوم'}</span>
        </button>
      ) : record.checkOutTimeUtc ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-2 text-center text-slate-600 text-xs">
          <div className="flex items-center justify-center gap-1 font-bold text-slate-700">
            <CheckCircle2 size={13} className="text-slate-400" />
            <span>تم الانصراف</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
            {formatRecordTime(record.checkOutTimeUtc)} · يومك سعيد!
          </span>
        </div>
      ) : (
        <div className="bg-white border border-emerald-200/80 rounded-xl p-2 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-black text-emerald-900 block leading-tight truncate">
                حاضر ({formatRecordTime(record.checkInTimeUtc)})
              </span>
              <span className="text-[10px] text-emerald-700 block -mt-0.5 font-medium">
                {record.status === 'Late' ? 'متأخر' : 'في الموعد المحدد'}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckOut}
            disabled={loading}
            className="text-[10px] font-bold text-slate-500 hover:text-amber-800 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 px-2 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
            title="تسجيل الانصراف"
          >
            انصراف
          </button>
        </div>
      )}
    </div>
  );
}
