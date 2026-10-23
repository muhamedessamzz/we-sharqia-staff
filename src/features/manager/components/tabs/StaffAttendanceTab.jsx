import React from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  LogOut,
  Search,
  Filter,
  Printer,
  RefreshCw,
  UserCheck,
  UserX,
  Sparkles,
  Phone,
  Briefcase,
  CalendarCheck,
  ShieldCheck
} from 'lucide-react';
import { ROLES_LABELS } from '../../constants';

export default function StaffAttendanceTab({
  staffAttendance = [],
  metrics = {},
  loading = false,
  statusFilter = 'all',
  setStatusFilter,
  roleFilter = 'all',
  setRoleFilter,
  searchQuery = '',
  setSearchQuery,
  onRefresh,
}) {
  const formatTime = (utcDate) => {
    if (!utcDate) return '—';
    return new Date(utcDate).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrintDailySheet = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return alert('يرجى السماح بالنوافذ المنبثقة لطباعة كشف الحضور.');

    const todayDateStr = new Date().toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const rows = staffAttendance
      .map((s, idx) => `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td><b>${s.fullName}</b></td>
          <td>${ROLES_LABELS[s.role]?.label || s.role}</td>
          <td style="text-align: center;">${formatTime(s.checkInTimeUtc)}</td>
          <td style="text-align: center;">${formatTime(s.checkOutTimeUtc)}</td>
          <td style="text-align: center;">${
            s.status === 'present'
              ? 'حاضر في الموعد'
              : s.status === 'late'
              ? 'متأخر'
              : s.status === 'left'
              ? 'انصرف'
              : s.status === 'excused'
              ? 'مأمورية رسمية'
              : 'لم يسجل'
          }</td>
          <td>${s.notes || '—'}</td>
        </tr>
      `)
      .join('');

    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <title>كشف حضور وانصراف العاملين</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #26163A; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #5C2C90; padding-bottom: 12px; margin-bottom: 15px; }
            .title { font-size: 20px; font-weight: bold; color: #5C2C90; }
            .stats { display: flex; gap: 20px; margin-bottom: 20px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; }
            th { background: #5C2C90; color: white; }
            .footer { margin-top: 40px; display: flex; justify-content: space-between; text-align: center; font-size: 13px; font-weight: bold; }
            .sig { border-top: 1px dashed #94a3b8; width: 180px; padding-top: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">مدارس WE للتكنولوجيا التطبيقية · فرع الشرقية</div>
              <div style="font-size: 12px; color: #64748b;">كشف الحضور والانصراف اليومي للعاملين بالمدرسة</div>
            </div>
            <div style="font-size: 13px; font-weight: bold; color: #5C2C90;">${todayDateStr}</div>
          </div>

          <div class="stats">
            <span><b>إجمالي العاملين:</b> ${metrics.totalStaff}</span>
            <span><b>إجمالي الحضور:</b> ${metrics.totalAttendedToday} (${metrics.attendanceRate}%)</span>
            <span><b>حاضر في الموعد:</b> ${metrics.presentCount}</span>
            <span><b>المتأخرون:</b> ${metrics.lateCount}</span>
            <span><b>لم يسجل الحضور:</b> ${metrics.unregisteredCount}</span>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 35px;">#</th>
                <th>الاسم بالكامل</th>
                <th>الوظيفة / الدور</th>
                <th style="width: 80px;">وقت الحضور</th>
                <th style="width: 80px;">وقت الانصراف</th>
                <th style="width: 100px;">الحالة</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <div class="footer">
            <div class="sig">مسؤول الحضور والانصراف</div>
            <div class="sig">منسق الجودة والشؤون الإدارية</div>
            <div class="sig">مدير مدرسة WE للتكنولوجيا التطبيقية</div>
          </div>

          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              حضور وانصراف العاملين
            </h3>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>مباشر اليوم</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            متابعة حضور وانصراف المعلمين والمهندسين والإداريين وتسجيل التأخيرات اليومية.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="تحديث البيانات"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handlePrintDailySheet}
            className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Printer size={15} />
            <span>طباعة كشف الحضور</span>
          </button>
        </div>
      </div>

      {/* 1.5 HR Exclusive Responsibility & View-Only Governance Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-3xl p-4 border border-purple-200/80 shadow-2xs flex items-start gap-3">
        <div className="p-2 rounded-2xl bg-[#5C2C90] text-white shrink-0 mt-0.5">
          <ShieldCheck size={18} />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-black text-slate-900 text-sm">
              اختصاص ومسؤولية حصرية لإدارة الموارد البشرية (HR) · وضع المتابعة الإدارية (Read-Only)
            </h4>
            <span className="bg-purple-100 text-[#5C2C90] font-bold text-[10px] px-2 py-0.5 rounded-full border border-purple-200">
              للاطلاع فقط
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">
            تسجيل وتعديل حضور وانصراف وأذونات ومأموريات العاملين هو اختصاص تنظيمي حصري لإدارة الموارد البشرية (HR). هذا السجل مخصص لإدارة المدرسة للمتابعة الاستراتيجية والاطلاع المؤسسي اللحظي ومتابعة سير اليوم الدراسي والطباعة فقط دون إجراء أي تعديل مباشر.
          </p>
        </div>
      </div>

      {/* 2. KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>نسبة الحضور اليوم</span>
            <Sparkles size={18} className="text-[#5C2C90]" />
          </div>
          <div className="text-3xl font-black text-[#5C2C90]">
            {metrics.attendanceRate || 0}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#5C2C90] h-1.5 rounded-full transition-all"
              style={{ width: `${metrics.attendanceRate || 0}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            {metrics.totalAttendedToday || 0} من إجمالي {metrics.totalStaff || 0} موظفًا
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-emerald-200/80 shadow-2xs flex flex-col justify-between bg-gradient-to-bl from-emerald-50/40 to-white">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold mb-2">
            <span>حاضر في الموعد</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="text-3xl font-black text-emerald-700">
            {metrics.presentCount || 0}
          </div>
          <p className="text-[11px] text-emerald-700/80 font-bold mt-1">
            تسجيل قبل 8:15 صباحًا
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-2xs flex flex-col justify-between bg-gradient-to-bl from-amber-50/40 to-white">
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold mb-2">
            <span>تأخير</span>
            <Clock size={18} />
          </div>
          <div className="text-3xl font-black text-amber-600">
            {metrics.lateCount || 0}
          </div>
          <p className="text-[11px] text-amber-700/80 font-bold mt-1">
            حضور بعد 8:15 صباحًا
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-rose-200/80 shadow-2xs flex flex-col justify-between bg-gradient-to-bl from-rose-50/40 to-white">
          <div className="flex items-center justify-between text-rose-700 text-xs font-bold mb-2">
            <span>لم يسجل الحضور</span>
            <XCircle size={18} />
          </div>
          <div className="text-3xl font-black text-rose-600">
            {metrics.unregisteredCount || 0}
          </div>
          <p className="text-[11px] text-rose-700/80 font-medium mt-1">
            لم يسجل حتى الآن
          </p>
        </div>
      </div>

      {/* 3. Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الكل ({metrics.totalStaff})
            </button>
            <button
              onClick={() => setStatusFilter('present')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'present'
                  ? 'bg-emerald-600 text-white shadow-2xs font-black'
                  : 'text-emerald-700 hover:bg-emerald-100/60'
              }`}
            >
              حاضر ({metrics.presentCount})
            </button>
            <button
              onClick={() => setStatusFilter('late')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'late'
                  ? 'bg-amber-500 text-white shadow-2xs font-black'
                  : 'text-amber-700 hover:bg-amber-100/60'
              }`}
            >
              متأخر ({metrics.lateCount})
            </button>
            <button
              onClick={() => setStatusFilter('left')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'left'
                  ? 'bg-slate-700 text-white shadow-2xs font-black'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              انصرف ({metrics.leftCount})
            </button>
            <button
              onClick={() => setStatusFilter('unregistered')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'unregistered'
                  ? 'bg-rose-600 text-white shadow-2xs font-black'
                  : 'text-rose-700 hover:bg-rose-100/60'
              }`}
            >
              لم يسجل ({metrics.unregisteredCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو رقم الهاتف..."
              className="w-full pl-3 pr-10 py-2 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5C2C90] bg-slate-50/50"
            />
          </div>
        </div>

        {/* Filter by Role */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Filter size={12} />
            <span>الدور:</span>
          </span>
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'all'
                ? 'bg-[#5C2C90] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل
          </button>
          {['teacher', 'technicalengineer', 'studentaffairs', 'socialworker', 'assessmentcoordinator', 'qualitycoordinator', 'it'].map((r) => {
            const roleCfg = ROLES_LABELS[r] || { label: r };
            return (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  roleFilter === r
                    ? 'bg-purple-100 text-[#5C2C90] border-purple-300 font-black'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {roleCfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Table of Staff Attendance */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="py-3.5 px-4">الموظف</th>
                <th className="py-3.5 px-4">الوظيفة / الدور</th>
                <th className="py-3.5 px-4 text-center">الحالة</th>
                <th className="py-3.5 px-4 text-center">وقت الحضور</th>
                <th className="py-3.5 px-4 text-center">وقت الانصراف</th>
                <th className="py-3.5 px-4">ملاحظات</th>
                <th className="py-3.5 px-4 text-center">حالة التوثيق بـ HR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffAttendance.map((staff) => {
                const roleCfg = ROLES_LABELS[staff.role?.toLowerCase()] || { label: staff.role };
                const isPresent = staff.status === 'present';
                const isLate = staff.status === 'late';
                const isLeft = staff.status === 'left';
                const isExcused = staff.status === 'excused';
                const isUnregistered = staff.status === 'unregistered';

                return (
                  <tr key={staff.userId} className="hover:bg-slate-50/70 transition-colors">
                    {/* User info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#5C2C90] flex items-center justify-center font-black text-xs shrink-0 border border-purple-100">
                          {staff.fullName?.charAt(0) || 'ك'}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 block text-sm">
                            {staff.fullName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                            <Phone size={10} className="text-slate-400" />
                            {staff.phoneNumber || staff.username}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {roleCfg.label}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {isPresent && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>حاضر في الموعد</span>
                        </span>
                      )}
                      {isLate && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                          <Clock size={12} className="text-amber-600" />
                          <span>متأخر</span>
                        </span>
                      )}
                      {isLeft && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl">
                          <CheckCircle2 size={12} className="text-slate-500" />
                          <span>تم الانصراف</span>
                        </span>
                      )}
                      {isExcused && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                          <Briefcase size={12} className="text-blue-600" />
                          <span>مأمورية رسمية</span>
                        </span>
                      )}
                      {isUnregistered && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl">
                          <UserX size={12} />
                          <span>لم يسجل بعد</span>
                        </span>
                      )}
                    </td>

                    {/* Check In Time */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                      {formatTime(staff.checkInTimeUtc)}
                    </td>

                    {/* Check Out Time */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-500">
                      {formatTime(staff.checkOutTimeUtc)}
                    </td>

                    {/* Notes */}
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate text-[11px]">
                      {staff.notes || '—'}
                    </td>

                    {/* HR Verification Status (Read-Only) */}
                    <td className="py-3.5 px-4 text-center">
                      {isPresent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-purple-700 bg-purple-50 border border-purple-200/80 px-2.5 py-1 rounded-xl">
                          <ShieldCheck size={12} className="text-[#5C2C90]" />
                          <span>موثق بـ HR ✅</span>
                        </span>
                      ) : isLate ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                          <ShieldCheck size={12} className="text-amber-600" />
                          <span>تأخير موثق HR</span>
                        </span>
                      ) : isLeft ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl">
                          <CheckCircle2 size={12} className="text-slate-500" />
                          <span>انصراف معتمد</span>
                        </span>
                      ) : isExcused ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                          <Briefcase size={12} className="text-blue-600" />
                          <span>إذن معتمد بـ HR</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl">
                          <Clock size={12} className="text-slate-400" />
                          <span>بانتظار رصد HR ⏳</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
