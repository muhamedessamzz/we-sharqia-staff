import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle2, LogOut, UserCheck, Sparkles } from 'lucide-react';
import { api } from '../api/client';

export default function HeaderAttendanceWidget({ user }) {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchStatus = useCallback(async () => {
    if (!user?.id) return;
    try {
      const records = await api.getTodayStaffAttendance();
      if (Array.isArray(records)) {
        const myRecord = records.find(
          (r) =>
            r.userId === user.id ||
            (r.userName && r.userName.toLowerCase() === user.fullName?.toLowerCase()) ||
            (r.userName && r.userName.toLowerCase() === user.username?.toLowerCase())
        );
        setRecord(myRecord || null);
      }
    } catch (err) {
      console.warn('Failed to load header attendance status:', err);
    }
  }, [user?.id, user?.fullName, user?.username]);

  useEffect(() => {
    fetchStatus();

    // Listen for custom attendance sync events across components
    const handleUpdate = () => fetchStatus();
    window.addEventListener('staff_attendance_updated', handleUpdate);
    return () => window.removeEventListener('staff_attendance_updated', handleUpdate);
  }, [fetchStatus]);

  const notifyChange = () => {
    window.dispatchEvent(new CustomEvent('staff_attendance_updated'));
  };

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
        notes: 'تسجيل ذاتي من النظام',
      });
      setRecord(res);
      notifyChange();
      setMsg('تم تسجيل الحضور بنجاح');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'تعذر تسجيل الحضور');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!confirm('هل تريد تسجيل الانصراف الآن؟')) return;
    setLoading(true);
    try {
      const res = await api.staffCheckOut(user.id);
      setRecord((prev) => ({
        ...(prev || {}),
        checkOutTimeUtc: res.checkOutTime || new Date().toISOString(),
      }));
      notifyChange();
      setMsg('تم تسجيل الانصراف بنجاح');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'تعذر تسجيل الانصراف');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const formatRecordTime = (utcDate) => {
    if (!utcDate) return '';
    try {
      return new Date(utcDate).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Toast Notification */}
      {msg && (
        <div className="absolute top-11 left-0 z-50 whitespace-nowrap bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold shadow-xl border border-white/10 animate-fade-in flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#E4007C]" />
          <span>{msg}</span>
        </div>
      )}

      {/* State 1: Not Checked-in Yet */}
      {!record ? (
        <button
          onClick={handleCheckIn}
          disabled={loading}
          className="group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white font-extrabold text-xs shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          title="انقر لتسجيل حضورك اليوم في المدرسة"
        >
          <UserCheck size={14} className="shrink-0 transition-transform group-hover:scale-110" />
          <span className="hidden sm:inline">
            {loading ? 'جارٍ التسجيل...' : 'تسجيل الحضور'}
          </span>
          <span className="sm:hidden">
            {loading ? 'جارٍ...' : 'تسجيل الحضور'}
          </span>
        </button>
      ) : record.checkOutTimeUtc ? (
        /* State 2: Checked Out */
        <div
          className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 border border-slate-200/90 rounded-2xl px-2.5 sm:px-3 py-1 text-slate-600 text-xs font-bold"
          title="تم تسجيل الانصراف لليوم الدراسي"
        >
          <CheckCircle2 size={13} className="text-slate-400 shrink-0" />
          <span className="text-[11px] text-slate-700 font-extrabold">تم الانصراف</span>
          <span className="font-mono text-slate-500 text-[10px] bg-white px-1.5 py-0.5 rounded-md border border-slate-200/70">
            {formatRecordTime(record.checkOutTimeUtc)}
          </span>
        </div>
      ) : (
        /* State 3: Present / Active (Checked in, not checked out yet) */
        <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl px-2.5 sm:px-3 py-1 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="flex items-center gap-1 text-emerald-950 font-extrabold text-[11px] sm:text-xs">
            <span>حاضر</span>
            <span className="font-mono text-emerald-800 font-bold text-[10px] sm:text-[11px] bg-white/80 px-1.5 py-0.5 rounded-md border border-emerald-200/60">
              {formatRecordTime(record.checkInTimeUtc)}
            </span>
            {record.status === 'Late' && (
              <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md border border-amber-200">
                متأخر
              </span>
            )}
          </div>

          <button
            onClick={handleCheckOut}
            disabled={loading}
            className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-500 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer mr-0.5 shadow-2xs"
            title="تسجيل انصراف اليوم"
          >
            <LogOut size={11} />
            <span className="hidden sm:inline">تسجيل الانصراف</span>
          </button>
        </div>
      )}
    </div>
  );
}
