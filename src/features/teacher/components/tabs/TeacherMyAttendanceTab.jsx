import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  ShieldCheck,
  RefreshCw,
  Info,
  Printer,
  Search,
  Filter,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { api } from '../../../../api/client';

export default function TeacherMyAttendanceTab({ user, permissions }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadMyAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getMyStaffAttendance(user?.id, user?.fullName || user?.username);
      setData(res);
    } catch (err) {
      console.warn('Failed loading personal staff attendance:', err);
      setError(err.message || 'تعذر تحميل سجل الحضور والغياب الشخصي');
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.fullName, user?.username]);

  useEffect(() => {
    loadMyAttendance();
  }, [loadMyAttendance]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return alert('يرجى السماح بالنوافذ المنبثقة لطباعة بيان الحضور.');

    const rows = (data?.records || []).map((r, idx) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="text-align: center;">${r.dayName}</td>
        <td style="text-align: center; direction: ltr;">${r.dateString}</td>
        <td style="text-align: center;">${r.statusLabel}</td>
        <td style="text-align: center;">${r.checkInTime}</td>
        <td style="text-align: center;">${r.checkOutTime}</td>
        <td>${r.notes || '—'}</td>
        <td style="text-align: center;">${r.recordedBy}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8" />
        <title>بيان سجل الحضور والانضباط الشخصي - ${user?.fullName || 'عضو هيئة التدريس'}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #1e293b; }
          .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #5C2C90; padding-bottom: 16px; }
          .title { font-size: 20px; font-weight: bold; color: #5C2C90; margin-bottom: 6px; }
          .subtitle { font-size: 13px; color: #64748b; }
          .meta-box { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; }
          th { background: #f1f5f9; font-weight: bold; color: #334155; }
          .badge { padding: 3px 8px; border-radius: 4px; font-weight: bold; }
          .footer { margin-top: 30px; font-size: 11px; text-align: center; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">مدارس WE للتكنولوجيا التطبيقية · فرع الشرقية</div>
          <div class="subtitle">بيان معتمد بالحضور والانضباط الشهري لعضو هيئة التدريس / التدريب الهندسي</div>
        </div>

        <div class="meta-box">
          <div><strong>الاسم:</strong> ${user?.fullName || '—'}</div>
          <div><strong>الوظيفة / الدور:</strong> ${user?.role === 'TechnicalEngineer' ? 'مهندس تدريب تكنولوجي' : 'معلم'}</div>
          <div><strong>نسبة الانضباط:</strong> ${data?.attendanceRate || 100}%</div>
          <div><strong>تاريخ الاستخراج:</strong> ${new Date().toLocaleDateString('ar-EG')}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>م</th>
              <th>اليوم</th>
              <th>التاريخ</th>
              <th>الحالة</th>
              <th>وقت الحضور</th>
              <th>وقت الانصراف</th>
              <th>البيان والملاحظات</th>
              <th>جهة التوثيق</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="footer">
          * تم استخراج هذا البيان رسمياً عبر المنصة الأكاديمية الذكية · تسجيل الحضور والغياب موثق بمعرفة إدارة الموارد البشرية (HR).
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  const records = data?.records || [];
  const filteredRecords = records.filter((r) => {
    if (statusFilter !== 'all') {
      const s = (r.status || '').toLowerCase();
      if (statusFilter === 'present' && s !== 'present') return false;
      if (statusFilter === 'late' && s !== 'late') return false;
      if (statusFilter === 'absent' && s !== 'absent') return false;
      if (statusFilter === 'excused' && s !== 'excused') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDay = r.dayName?.toLowerCase().includes(q);
      const matchDate = r.dateString?.toLowerCase().includes(q);
      const matchNote = r.notes?.toLowerCase().includes(q);
      if (!matchDay && !matchDate && !matchNote) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 fade-in text-[#26163A]">
      {/* 1. Header & Quick Actions */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-purple-50 text-[#5C2C90]">
              <CalendarCheck size={20} />
            </span>
            <h2 className="text-xl font-black text-slate-900">
              سجل حضوري وغيابي الشهري
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            متابعة دقيقة لمواعيد حضورك وانصرافك ونسبة الانضباط الموثقة رسمياً بمعرفة إدارة الموارد البشرية (HR)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadMyAttendance}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>تحديث السجل</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={loading || records.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#5C2C90] to-[#7134b2] text-white text-xs font-bold transition-all cursor-pointer shadow-xs hover:shadow-md"
          >
            <Printer size={14} />
            <span>طباعة بيان الحضور الرسمي</span>
          </button>
        </div>
      </div>

      {/* 2. HR Responsibility & Read-Only Governance Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-3xl p-4 border border-purple-200/70 shadow-2xs flex items-start gap-3.5">
        <div className="p-2 rounded-2xl bg-[#5C2C90] text-white shrink-0 mt-0.5">
          <ShieldCheck size={18} />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-black text-slate-900 text-sm">
              مسؤولية حصرية لإدارة الموارد البشرية (HR) · وضع الاطلاع والمتابعة الشخصية
            </h4>
            <span className="bg-purple-100 text-[#5C2C90] font-bold text-[10px] px-2 py-0.5 rounded-full border border-purple-200">
              عرض فقط (Read-Only)
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">
            تسجيل وتعديل الحضور، الانصراف، الأذونات الرسمية والغياب هو اختصاص حصري لمسؤول الموارد البشرية (HR). هذا السجل مخصص لاطلاعك ومتابعتك الشخصية لمعدل انضباطك دون إمكانية التعديل. في حال وجود عذر طبي أو مأمورية عمل لم تثبت، يرجى مراجعة مكتب الـ HR لتوثيقها رسمياً.
          </p>
        </div>
      </div>

      {/* 3. Personal Attendance KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Attendance Rate */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400">نسبة الانضباط</span>
            <span className="w-7 h-7 rounded-xl bg-purple-50 text-[#5C2C90] flex items-center justify-center font-bold text-xs">
              %
            </span>
          </div>
          <div className="text-2xl font-black text-[#5C2C90]">
            {data?.attendanceRate ?? 100}%
          </div>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#5C2C90] to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, data?.attendanceRate ?? 100)}%` }}
            />
          </div>
        </div>

        {/* Total Official Working Days */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400">أيام العمل الرسمية</span>
            <Calendar size={14} className="text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-800">
            {data?.totalDays ?? records.length}
          </div>
          <span className="text-[10px] text-slate-400 font-bold mt-1">خلال الشهر الحالي</span>
        </div>

        {/* Present Days */}
        <div className="bg-emerald-50/50 rounded-3xl p-4 border border-emerald-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-700">حضور منتظم</span>
            <CheckCircle2 size={14} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800">
            {data?.presentDays ?? records.filter(r => r.status?.toLowerCase() === 'present').length}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1">حاضر في الموعد</span>
        </div>

        {/* Late Days */}
        <div className="bg-amber-50/50 rounded-3xl p-4 border border-amber-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-700">تأخير مبرر</span>
            <Clock size={14} className="text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-800">
            {data?.lateDays ?? records.filter(r => r.status?.toLowerCase() === 'late').length}
          </div>
          <span className="text-[10px] text-amber-600 font-bold mt-1">موثق بإشعار HR</span>
        </div>

        {/* Excused / Mission Days */}
        <div className="bg-blue-50/50 rounded-3xl p-4 border border-blue-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-blue-700">أذونات ومأموريات</span>
            <Briefcase size={14} className="text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-800">
            {data?.excusedDays ?? records.filter(r => r.status?.toLowerCase() === 'excused').length}
          </div>
          <span className="text-[10px] text-blue-600 font-bold mt-1">معتمدة رسمياً</span>
        </div>

        {/* Absent Days */}
        <div className="bg-rose-50/50 rounded-3xl p-4 border border-rose-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-rose-700">أيام الغياب</span>
            <AlertTriangle size={14} className="text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-800">
            {data?.absentDays ?? records.filter(r => r.status?.toLowerCase() === 'absent').length}
          </div>
          <span className="text-[10px] text-rose-600 font-bold mt-1">بدون إذن مسبق</span>
        </div>
      </div>

      {/* 4. Filter and Search Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#5C2C90] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            كافة السجلات ({records.length})
          </button>
          <button
            onClick={() => setStatusFilter('present')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'present'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            حاضر في الموعد
          </button>
          <button
            onClick={() => setStatusFilter('late')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'late'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            تأخيرات
          </button>
          <button
            onClick={() => setStatusFilter('excused')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'excused'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            مأموريات وأذونات
          </button>
          <button
            onClick={() => setStatusFilter('absent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'absent'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            غياب
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باليوم أو التاريخ أو الملاحظة..."
            className="w-full pl-3 pr-9 py-2 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/30 focus:border-[#5C2C90] bg-slate-50/50"
          />
        </div>
      </div>

      {/* 5. Detailed Daily Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck size={16} className="text-[#5C2C90]" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              سجل التوقيعات اليومية الموثقة (HR Verified Records)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            يعرض {filteredRecords.length} يوم عمل
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw size={28} className="animate-spin text-[#5C2C90] mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-bold">جاري تحميل سجل الحضور المعتمد...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-16 text-center">
            <Info size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-600 font-bold">لا توجد سجلات حضور تطابق معايير البحث</p>
            <p className="text-xs text-slate-400 mt-1">يتم تحديث السجلات تلقائياً بمجرد رصدها من إدارة الموارد البشرية</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="py-3.5 px-4 text-center">م</th>
                  <th className="py-3.5 px-4">اليوم</th>
                  <th className="py-3.5 px-4 text-center">التاريخ</th>
                  <th className="py-3.5 px-4 text-center">الحالة</th>
                  <th className="py-3.5 px-4 text-center">وقت الحضور</th>
                  <th className="py-3.5 px-4 text-center">وقت الانصراف</th>
                  <th className="py-3.5 px-4">البيان والملاحظات الرسمية</th>
                  <th className="py-3.5 px-4 text-center">التوثيق والاعتماد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec, idx) => {
                  const s = (rec.status || '').toLowerCase();
                  const isPresent = s === 'present';
                  const isLate = s === 'late';
                  const isExcused = s === 'excused';
                  const isAbsent = s === 'absent';

                  return (
                    <tr key={rec.id || idx} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      <td className="py-3.5 px-4 font-black text-slate-800">
                        {rec.dayName}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-slate-600 text-[11px]" dir="ltr">
                        {rec.dateString}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {isPresent && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>حاضر في الموعد</span>
                          </span>
                        )}
                        {isLate && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                            <Clock size={11} className="text-amber-600" />
                            <span>تأخير مبرر</span>
                          </span>
                        )}
                        {isExcused && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                            <Briefcase size={11} className="text-blue-600" />
                            <span>مأمورية / إذن رسمي</span>
                          </span>
                        )}
                        {isAbsent && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl">
                            <AlertTriangle size={11} className="text-rose-600" />
                            <span>غائب</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                        {rec.checkInTime}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-500">
                        {rec.checkOutTime}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium max-w-xs truncate text-[11px]">
                        {rec.notes || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded-lg">
                          <ShieldCheck size={11} />
                          <span>{rec.recordedBy || 'إدارة HR'}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
