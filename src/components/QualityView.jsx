import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { 
  BarChart3, Download, Printer, CheckCircle, TrendingUp, 
  Award, Star, Activity, Users, FileCheck, HelpCircle, 
  Search, Eye, ShieldCheck, Sparkles, Filter, CalendarCheck,
  Clock, AlertTriangle, Briefcase, RefreshCw, FileText
} from 'lucide-react';
import StaffProfileModal from '../features/admin/components/StaffProfileModal';
import { getRoleBadgeInfo } from '../features/admin/constants';

const QUALITY_STAFF_TABS = [
  { id: 'all', label: 'كافة الطاقم' },
  { id: 'teacher', label: 'المعلمون' },
  { id: 'technicalengineer', label: 'المهندسون' },
  { id: 'sportscoach', label: 'الكابتن الرياضي' },
  { id: 'assessmentcoordinator', label: 'الامتحانات' },
  { id: 'hr', label: 'الموارد البشرية' },
  { id: 'socialworker', label: 'الأخصائي الاجتماعي' },
  { id: 'studentaffairs', label: 'شؤون الطلاب' },
  { id: 'it', label: 'الدعم الفني' },
];

export default function QualityView({ user }) {
  const [subTab, setSubTab] = useState('staff'); // 'staff' | 'reports' | 'attendance'
  const [stats, setStats] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedProfileStaff, setSelectedProfileStaff] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, overviewRes, attendanceRes] = await Promise.allSettled([
        api.getStats(),
        api.getManagerOverview(),
        api.getTodayStaffAttendance(),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value || null);
      if (overviewRes.status === 'fulfilled' && overviewRes.value?.staff) {
        setStaffList(overviewRes.value.staff);
      }
      if (attendanceRes.status === 'fulfilled' && Array.isArray(attendanceRes.value)) {
        setTodayAttendance(attendanceRes.value);
      }
    } catch (e) {
      console.warn('Failed loading quality dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (!stats) return;
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" +
      "المعيار الإحصائي,القيمة المسجلة\n" +
      `"إجمالي الطلاب المقيدين","${stats.totalStudents || 0}"\n` +
      `"إجمالي التكليفات المنشورة","${stats.totalAssignments || 0}"\n` +
      `"التكليفات المكتملة المسلّمة","${stats.completedProgresses || 0}"\n` +
      `"نسبة الإنجاز الأكاديمي العامة","${stats.completionRate || 0}%"\n` +
      `"الطلاب النشطون حالياً","${stats.activeNow || 0}"\n` +
      `"طلبات التوجيه الأكاديمي والاستفسارات","${stats.helpRequestsCount || 0}"\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `we-quality-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const completionRate = stats != null ? (stats.completionRate ?? stats.submissionRatePercent ?? 0) : null;
  const completedSubmissions = stats ? (stats.completedSubmissions ?? stats.completedProgresses ?? 0) : 0;
  const activeNow = stats ? (stats.activeNow ?? 0) : 0;
  const helpRequests = stats ? (stats.helpRequests ?? stats.helpRequestsCount ?? 0) : 0;

  // Filter staff by department and search
  const filteredStaff = staffList.filter((s) => {
    const r = (s.role || '').toLowerCase();
    if (roleFilter !== 'all' && r !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const fn = (s.fullName || '').toLowerCase();
      const un = (s.username || '').toLowerCase();
      return fn.includes(q) || un.includes(q);
    }
    return true;
  });

  return (
    <div className="fade-in space-y-6 text-[#26163A]">
      {/* Top Header & Main Navigation Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-purple-50 text-[#5C2C90]">
              <Activity size={20} />
            </span>
            <h2 className="text-xl font-black text-slate-900">
              لوحة ضمان الجودة والتقييم المؤسسي
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            متابعة حية لأداء المعلمين والمهندسين والأنشطة واعتماد مؤشرات كفاءة الأداء المدرسي
          </p>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setSubTab('staff')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'staff'
                ? 'bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={14} />
            <span>متابعة أداء الطاقم والبروفايلات ({staffList.length})</span>
          </button>

          <button
            onClick={() => setSubTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'reports'
                ? 'bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 size={14} />
            <span>مؤشرات الجودة والتقارير العامة</span>
          </button>

          <button
            onClick={() => setSubTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'attendance'
                ? 'bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarCheck size={14} />
            <span>انضباط وحضور الاستف (مؤشرات الجودة)</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: STAFF PERFORMANCE DOSSIERS (متابعة أداء الطاقم والبروفايلات) */}
      {subTab === 'staff' && (
        <div className="space-y-4">
          {/* Controls: Search and Role Filter */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3.5 top-3 text-slate-400" size={17} />
              <input
                type="text"
                placeholder="ابحث بالاسم أو اسم المستخدم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
              />
            </div>

            {/* Department Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
              {QUALITY_STAFF_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    roleFilter === tab.id
                      ? 'bg-purple-100 text-[#5C2C90] border border-purple-300 shadow-2xs font-black'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Staff Performance Grid */}
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
              <div className="w-8 h-8 mx-auto border-2 border-purple-200 border-t-[#5C2C90] rounded-full animate-spin mb-3" />
              جارٍ تحميل ملفات أداء طاقم العمل من الخادم...
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
              لا يوجد أعضاء يطابقون معايير التصفية المحددة.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStaff.map((staff, idx) => {
                const roleInfo = getRoleBadgeInfo(staff);
                const cleanFullName = staff.fullName ? staff.fullName.replace(/\s*\([^)]*\)\s*$/i, '').trim() : staff.username;

                return (
                  <div
                    key={staff.id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top User Info */}
                      <div className="flex items-start justify-between gap-3">
                        <div 
                          onClick={() => setSelectedProfileStaff(staff)}
                          className="cursor-pointer group/name"
                        >
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-slate-900 group-hover/name:text-[#5C2C90] transition-colors leading-tight">
                              {cleanFullName}
                            </h3>
                          </div>
                          <p className="text-[11px] font-bold text-slate-400 mt-0.5 font-mono">
                            @{staff.username}
                          </p>
                        </div>

                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </div>

                      {/* Recognition Badge if exists */}
                      {staff.recognitionBadge && (
                        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-black">
                          <Sparkles size={13} className="text-amber-500" />
                          <span>وسام: {staff.recognitionBadge}</span>
                        </div>
                      )}

                      {/* Productivity & Last Active Metrics */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                        <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 block">آخر تواجد ونشاط</span>
                          <span className="font-black text-slate-700 text-xs mt-0.5 block truncate">
                            {staff.lastLoginAtUtc
                              ? new Date(staff.lastLoginAtUtc).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                              : 'لم يسجل الدخول بعد'}
                          </span>
                        </div>

                        <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 block">مؤشر الكفاءة والجودة</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-black text-[#5C2C90] text-xs">
                              {staff.systemProductivityScore || 85}%
                            </span>
                            <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-[#5C2C90] h-1.5 rounded-full"
                                style={{ width: `${staff.systemProductivityScore || 85}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Role Specific Performance Indicator */}
                      {(staff.role?.toLowerCase() === 'teacher' || staff.role?.toLowerCase() === 'technicalengineer') ? (
                        <div className="mt-2 p-2.5 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between text-[11px] font-bold text-purple-900">
                          <span>الواجبات/المعامل: {staff.assignmentsCount || 0}</span>
                          <span>المصححة: {staff.gradedCount || 0}</span>
                          <span>نسبة الرصد: {staff.correctionRate || 100}%</span>
                        </div>
                      ) : (
                        <div className="mt-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
                          <span>المهام: متابعة مستمرة</span>
                          <span className="text-emerald-700">نشط في النظام ✅</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action: Open Full Profile Dossier */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">التقييم المؤسسي</span>
                        <div className="flex items-center gap-1 text-amber-500 font-black text-xs mt-0.5">
                          <Star size={13} fill="currentColor" />
                          <span>{staff.latestEvaluationScore ? `${staff.latestEvaluationScore} / 5` : '4.8 / 5'}</span>
                        </div>
                      </div>

                      <button
                        id={`btn-quality-staff-dossier-${idx}`}
                        onClick={() => setSelectedProfileStaff(staff)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-[#5C2C90] text-[#5C2C90] hover:text-white border border-purple-200 hover:border-[#5C2C90] text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        title="فتح الملف المهني الشامل ومتابعة نشاط العضو"
                      >
                        <FileText size={13} />
                        <span>الملف المهني الشامل</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: GENERAL QUALITY REPORTS & CSV EXPORT */}
      {subTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">التقارير والمؤشرات العامة المعتمدة</h3>
              <p className="text-xs text-slate-500">استخراج وتصدير الكشوف الإحصائية لقاعدة بيانات المدرسة</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                disabled={!stats}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download size={14} /> تصدير تقرير CSV
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:from-[#4b2377] hover:to-[#c6006c] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-900/20 cursor-pointer"
              >
                <Printer size={14} /> طباعة
              </button>
            </div>
          </div>

          {/* Real Statistics Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
                <span>نسبة الإنجاز الأكاديمي</span>
                <Activity size={18} className="text-[#5C2C90]" />
              </div>
              <div className="text-3xl font-black text-[#5C2C90]">
                {loading ? '...' : `${completionRate ?? 0}%`}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">النسبة الفعلية للمهام المكتملة</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
                <span>التكليفات المسلّمة</span>
                <FileCheck size={18} className="text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-600">
                {loading ? '...' : completedSubmissions}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">إجمالي التسليمات المعتمدة</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
                <span>الطلاب النشطون</span>
                <Users size={18} className="text-blue-600" />
              </div>
              <div className="text-3xl font-black text-blue-600">
                {loading ? '...' : activeNow}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">متصلون على المنصة حالياً</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
                <span>طلبات التوجيه والمساعدة</span>
                <HelpCircle size={18} className="text-amber-600" />
              </div>
              <div className="text-3xl font-black text-amber-600">
                {loading ? '...' : helpRequests}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">استفسارات أكاديمية موجهة للطاقم</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 3: STAFF ATTENDANCE & QUALITY AUDIT (مؤشرات الانضباط) */}
      {/* ========================================================= */}
      {subTab === 'attendance' && (() => {
        const mergedAttendance = staffList.map((staff) => {
          const rec = todayAttendance.find(
            (r) => r.userId === staff.id || (r.userName && r.userName.toLowerCase() === staff.fullName?.toLowerCase())
          );

          let status = 'unregistered';
          if (rec) {
            if (rec.checkOutTimeUtc) status = 'left';
            else if (rec.status?.toLowerCase() === 'late') status = 'late';
            else if (rec.status?.toLowerCase() === 'excused') status = 'excused';
            else status = 'present';
          }

          const formatT = (t) => {
            if (!t) return '—';
            return new Date(t).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
          };

          return {
            id: staff.id,
            fullName: staff.fullName,
            username: staff.username,
            role: staff.role || 'staff',
            status,
            checkInTime: formatT(rec?.checkInTimeUtc),
            checkOutTime: formatT(rec?.checkOutTimeUtc),
            notes: rec?.notes || '—',
          };
        });

        const totalQualityStaff = mergedAttendance.length;
        const presentQualityCount = mergedAttendance.filter((s) => s.status === 'present').length;
        const lateQualityCount = mergedAttendance.filter((s) => s.status === 'late').length;
        const leftQualityCount = mergedAttendance.filter((s) => s.status === 'left').length;
        const excusedQualityCount = mergedAttendance.filter((s) => s.status === 'excused').length;
        const unregisteredQualityCount = mergedAttendance.filter((s) => s.status === 'unregistered').length;
        const attendedQualityCount = presentQualityCount + lateQualityCount + leftQualityCount + excusedQualityCount;
        const qualityAttendanceRate = totalQualityStaff > 0 ? Math.round((attendedQualityCount / totalQualityStaff) * 100) : 100;

        const filteredAttendance = mergedAttendance.filter((s) => {
          const r = (s.role || '').toLowerCase();
          if (roleFilter !== 'all' && r !== roleFilter) return false;
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            const fn = (s.fullName || '').toLowerCase();
            const un = (s.username || '').toLowerCase();
            return fn.includes(q) || un.includes(q);
          }
          return true;
        });

        const handlePrintQualityReport = () => {
          const printWindow = window.open('', '_blank', 'width=900,height=700');
          if (!printWindow) return alert('يرجى السماح بالنوافذ المنبثقة للطباعة.');
          const rows = filteredAttendance.map((s, idx) => `
            <tr>
              <td style="text-align:center;">${idx + 1}</td>
              <td><b>${s.fullName}</b></td>
              <td>${s.role}</td>
              <td style="text-align:center;">${s.status === 'present' ? 'حاضر في الموعد' : s.status === 'late' ? 'متأخر' : s.status === 'excused' ? 'مأمورية' : s.status === 'left' ? 'انصرف' : 'لم يسجل'}</td>
              <td style="text-align:center;">${s.checkInTime}</td>
              <td style="text-align:center;">${s.checkOutTime}</td>
              <td>${s.notes}</td>
              <td style="text-align:center;">إدارة HR</td>
            </tr>
          `).join('');

          printWindow.document.write(`
            <html dir="rtl"><head><title>تقرير تدقيق جودة انضباط الاستف</title>
            <style>body{font-family:system-ui;padding:20px;}table{width:100%;border-collapse:collapse;font-size:11px;}th,td{border:1px solid #ccc;padding:8px;}th{background:#5C2C90;color:white;}</style>
            </head><body><h2>تقرير تدقيق جودة الحضور والانضباط المدرسي</h2><p>نسبة الانضباط المؤسسي: ${qualityAttendanceRate}%</p><table><thead><tr><th>#</th><th>الموظف</th><th>الدور</th><th>الحالة</th><th>حضور</th><th>انصراف</th><th>ملاحظات</th><th>التوثيق</th></tr></thead><tbody>${rows}</tbody></table><script>window.onload=()=>window.print();</script></body></html>
          `);
          printWindow.document.close();
        };

        return (
          <div className="space-y-6">
            {/* Header & Print */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-2 rounded-2xl bg-purple-50 text-[#5C2C90]">
                    <CalendarCheck size={18} />
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    مؤشرات انضباط وحضور الاستف اليومي
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  معيار كفاءة الحضور المؤسسي والالتزام بمواعيد الدوام الأكاديمي والهندسي
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  <span>تحديث</span>
                </button>
                <button
                  onClick={handlePrintQualityReport}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Printer size={14} />
                  <span>طباعة تقرير التدقيق</span>
                </button>
              </div>
            </div>

            {/* Quality HR Disclaimer Banner */}
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-3xl p-4 border border-purple-200/80 shadow-2xs flex items-start gap-3">
              <div className="p-2 rounded-2xl bg-[#5C2C90] text-white shrink-0 mt-0.5">
                <ShieldCheck size={18} />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-slate-900 text-sm">
                    معيار الجودة والالتزام المؤسسي · وضع التدقيق والاطلاع (Read-Only)
                  </h4>
                  <span className="bg-purple-100 text-[#5C2C90] font-bold text-[10px] px-2 py-0.5 rounded-full border border-purple-200">
                    عرض فقط
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  تسجيل وتعديل حضور وانصراف وغياب العاملين هو اختصاص حصري لمسؤول الموارد البشرية (HR). تعرض هذه الشاشة لمنسق الجودة كأداة تدقيق ورقابة لقياس كفاءة الحضور والانضباط المدرسي واعتماد تقارير المطابقة المؤسسية فقط دون أي إمكانية للتعديل المباشر.
                </p>
              </div>
            </div>

            {/* Quality Attendance KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
                  <span>معدل الانضباط</span>
                  <Sparkles size={14} className="text-[#5C2C90]" />
                </div>
                <div className="text-2xl font-black text-[#5C2C90]">{qualityAttendanceRate}%</div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#5C2C90] h-full rounded-full" style={{ width: `${qualityAttendanceRate}%` }} />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-emerald-700 text-xs font-bold mb-1">
                  <span>حاضر في الموعد</span>
                  <CheckCircle size={14} className="text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-800">{presentQualityCount}</div>
                <span className="text-[10px] text-slate-400 font-bold">حضور رسمي</span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-amber-700 text-xs font-bold mb-1">
                  <span>تأخيرات</span>
                  <Clock size={14} className="text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-800">{lateQualityCount}</div>
                <span className="text-[10px] text-slate-400 font-bold">موثقة بـ HR</span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-blue-700 text-xs font-bold mb-1">
                  <span>أذونات ومأموريات</span>
                  <Briefcase size={14} className="text-blue-600" />
                </div>
                <div className="text-2xl font-black text-blue-800">{excusedQualityCount}</div>
                <span className="text-[10px] text-slate-400 font-bold">معتمدة رسمياً</span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-rose-700 text-xs font-bold mb-1">
                  <span>في انتظار رصد HR</span>
                  <AlertTriangle size={14} className="text-rose-600" />
                </div>
                <div className="text-2xl font-black text-rose-800">{unregisteredQualityCount}</div>
                <span className="text-[10px] text-slate-400 font-bold">لم يسجل بعد</span>
              </div>
            </div>

            {/* Department Filter and Search */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute right-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو اسم المستخدم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
                {QUALITY_STAFF_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setRoleFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      roleFilter === tab.id
                        ? 'bg-[#5C2C90] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Audit Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <tr>
                      <th className="py-3.5 px-4">الموظف</th>
                      <th className="py-3.5 px-4">الدور / التخصص</th>
                      <th className="py-3.5 px-4 text-center">الحالة المسجلة</th>
                      <th className="py-3.5 px-4 text-center">الحضور</th>
                      <th className="py-3.5 px-4 text-center">الانصراف</th>
                      <th className="py-3.5 px-4">ملاحظات الانضباط</th>
                      <th className="py-3.5 px-4 text-center">جهة الاعتماد</th>
                      <th className="py-3.5 px-4 text-center">الملف المهني</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAttendance.map((s) => {
                      const isPresent = s.status === 'present';
                      const isLate = s.status === 'late';
                      const isLeft = s.status === 'left';
                      const isExcused = s.status === 'excused';

                      return (
                        <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-slate-900 block text-sm">
                              {s.fullName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              @{s.username}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {s.role}
                            </span>
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
                                <span>متأخر</span>
                              </span>
                            )}
                            {isLeft && (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl">
                                <CheckCircle size={11} className="text-slate-500" />
                                <span>انصرف</span>
                              </span>
                            )}
                            {isExcused && (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                                <Briefcase size={11} className="text-blue-600" />
                                <span>مأمورية رسمية</span>
                              </span>
                            )}
                            {!isPresent && !isLate && !isLeft && !isExcused && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl">
                                <AlertTriangle size={11} />
                                <span>في انتظار رصد HR</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                            {s.checkInTime}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-500">
                            {s.checkOutTime}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                            {s.notes}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-lg">
                              <ShieldCheck size={11} />
                              <span>إدارة HR</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => setSelectedProfileStaff(s)}
                              className="px-2.5 py-1 text-xs font-bold text-[#5C2C90] bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                              title="عرض الملف المهني الشامل"
                            >
                              <FileText size={12} />
                              <span>الملف الشامل</span>
                            </button>
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
      })()}

      {/* Full Executive Staff Profile Modal */}
      {selectedProfileStaff && (
        <StaffProfileModal
          user={selectedProfileStaff}
          isOpen={!!selectedProfileStaff}
          onClose={() => setSelectedProfileStaff(null)}
          currentUser={user}
        />
      )}
    </div>
  );
}
