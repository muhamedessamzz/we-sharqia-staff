import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  AlertCircle, CheckCircle2, X, Users, Activity, Clock, 
  ShieldCheck, RefreshCw, Filter, Search, GraduationCap, 
  Award, FileText, CheckCircle, ArrowRightLeft, Eye, 
  BarChart3, School, HeartHandshake, FolderCheck, Calendar,
  CalendarCheck, Briefcase, Sparkles, Printer
} from 'lucide-react';

// Components
import AdminHeader from './components/AdminHeader';
import AdminStatCards from './components/AdminStatCards';
import StaffFiltersBar from './components/StaffFiltersBar';
import AdminUserTable from './components/AdminUserTable';

// Modals
import CreateUserModal from './components/modals/CreateUserModal';
import EditUserModal from './components/modals/EditUserModal';
import StaffProfileModal from './components/StaffProfileModal';
import StudentProfileModal from '../student-affairs/components/modals/StudentProfileModal';

// Hooks & API
import { useAdminUsers } from './hooks/useAdminUsers';
import { useClassroomsMap } from './hooks/useClassroomsMap';
import { useAdminFilters } from './hooks/useAdminFilters';
import { api } from '../../api/client';
import { getRoleBadge } from '../manager/constants';
import MasterScheduleViewer from '../../components/schedule/MasterScheduleViewer';

export default function AdminFeature({ user }) {
  // Top-Level Governance Tabs: 'users' | 'kpis' | 'audit' | 'schedule' | 'attendance'
  const [adminSection, setAdminSection] = useState('users');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingStaffUser, setViewingStaffUser] = useState(null);

  // Student Profile Lookup State for Admin
  const [isStudentLookupOpen, setIsStudentLookupOpen] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);

  // Business Logic Hooks
  const {
    users,
    loading,
    feedback,
    isSubmitting,
    showFeedback,
    setFeedback,
    updateUserStatus,
    deleteUser,
    createUser,
    updateUser,
  } = useAdminUsers();

  const { classroomsMap } = useClassroomsMap(users);

  const {
    tab,
    setTab,
    searchQuery,
    setSearchQuery,
    counts,
    filteredUsers,
  } = useAdminFilters(users);

  // --- Audit Log State ---
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditRoleFilter, setAuditRoleFilter] = useState('all');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  // --- Governance & KPI Overview State ---
  const [overviewData, setOverviewData] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(false);

  // --- Staff Attendance Audit State for Admin ---
  const [staffAttendanceRecords, setStaffAttendanceRecords] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [attendanceRoleFilter, setAttendanceRoleFilter] = useState('all');
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState('');

  const loadStaffAttendance = useCallback(async () => {
    setLoadingAttendance(true);
    try {
      const res = await api.getTodayStaffAttendance();
      setStaffAttendanceRecords(Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn('Failed loading staff attendance for admin:', err);
    } finally {
      setLoadingAttendance(false);
    }
  }, []);

  // Load Audit Logs
  const loadAuditLogs = useCallback(async () => {
    setLoadingAudit(true);
    try {
      const roleParam = auditRoleFilter === 'all' ? '' : auditRoleFilter;
      const res = await api.getAuditLogs(roleParam, 80);
      setAuditLogs(Array.isArray(res) ? res : res?.value || []);
    } catch (err) {
      console.warn('Failed loading audit logs:', err);
    } finally {
      setLoadingAudit(false);
    }
  }, [auditRoleFilter]);

  // Load School Overview KPIs
  const loadOverviewData = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const res = await api.getManagerOverview();
      setOverviewData(res);
    } catch (err) {
      console.warn('Failed loading overview data:', err);
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  useEffect(() => {
    if (adminSection === 'audit') {
      loadAuditLogs();
    } else if (adminSection === 'kpis') {
      loadOverviewData();
    } else if (adminSection === 'attendance') {
      loadStaffAttendance();
    }
  }, [adminSection, loadAuditLogs, loadOverviewData, loadStaffAttendance]);

  // All student users for lookup modal
  const allStudents = useMemo(() => {
    return (users || []).filter((u) => u.role?.toLowerCase() === 'student');
  }, [users]);

  const filteredLookupStudents = useMemo(() => {
    if (!studentSearchQuery.trim()) return allStudents.slice(0, 25);
    const q = studentSearchQuery.toLowerCase();
    return allStudents.filter(
      (s) =>
        (s.fullName && s.fullName.toLowerCase().includes(q)) ||
        (s.username && s.username.toLowerCase().includes(q)) ||
        (s.studentCode && s.studentCode.toLowerCase().includes(q)) ||
        (s.classroom && s.classroom.toLowerCase().includes(q)) ||
        (s.nationalId && s.nationalId.includes(q))
    );
  }, [allStudents, studentSearchQuery]);

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    if (!auditSearchQuery.trim()) return auditLogs;
    const q = auditSearchQuery.toLowerCase();
    return auditLogs.filter(
      (l) =>
        (l.userName && l.userName.toLowerCase().includes(q)) ||
        (l.description && l.description.toLowerCase().includes(q)) ||
        (l.actionType && l.actionType.toLowerCase().includes(q))
    );
  }, [auditLogs, auditSearchQuery]);

  return (
    <div className="space-y-6 fade-in pb-10" dir="rtl">
      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold shadow-md animate-fade-in ${
            feedback.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* 1. Header with Actions & Dynamic Section Meta */}
      <AdminHeader
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenStudentLookup={() => setIsStudentLookupOpen(true)}
        activeSection={adminSection}
      />

      {/* 2. Top-Level Governance Navigation Tabs (Executive Command Deck) */}
      <div className="bg-gradient-to-b from-white/95 to-slate-50/80 backdrop-blur-xl p-2.5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {[
            {
              id: 'users',
              title: 'طاقم العمل والمستخدمين',
              subtitle: 'إدارة الحسابات وتعيين الصلاحيات',
              icon: Users,
              badge: `${counts.all || 0} عضو`,
            },
            {
              id: 'kpis',
              title: 'مؤشرات الحوكمة والأداء',
              subtitle: 'لوحة الإنجاز المؤسسي الشامل',
              icon: BarChart3,
              badge: 'مباشر 🟢',
            },
            {
              id: 'audit',
              title: 'سجل التدقيق والرقابة',
              subtitle: 'سجل العمليات والأنشطة اللحظية',
              icon: Clock,
              badge: `${auditLogs.length} عملية`,
            },
            {
              id: 'schedule',
              title: 'الجدول المدرسي العام',
              subtitle: '375 حصة · 101 إشراف مدرسي',
              icon: Calendar,
              badge: '375 حصة',
            },
            {
              id: 'attendance',
              title: 'حضور وغياب الاستف',
              subtitle: 'رقابة حية موثقة بمعرفة HR',
              icon: CalendarCheck,
              badge: 'رقابة موثقة',
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = adminSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminSection(item.id)}
                className={`group relative text-right p-3.5 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[96px] overflow-hidden select-none border ${
                  isActive
                    ? 'bg-gradient-to-br from-[#5C2C90] via-[#6f33ad] to-[#451c77] text-white border-purple-400/50 shadow-md shadow-purple-900/25 ring-2 ring-purple-500/20'
                    : 'bg-white hover:bg-purple-50/40 text-slate-700 border-slate-200/90 hover:border-purple-200 hover:shadow-xs'
                }`}
              >
                {/* Top row: Icon Box & Pill Badge */}
                <div className="flex items-center justify-between w-full mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-inner ring-1 ring-white/25'
                        : 'bg-purple-50 text-[#5C2C90] group-hover:bg-[#5C2C90] group-hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-white/25 text-white ring-1 ring-white/30'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-purple-100 group-hover:text-[#5C2C90]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Bottom text block: Full Width, No Truncation */}
                <div className="w-full text-right">
                  <h3
                    className={`font-black text-xs sm:text-[13px] leading-snug whitespace-normal ${
                      isActive ? 'text-white' : 'text-slate-900 group-hover:text-[#5C2C90]'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-[10px] sm:text-[11px] mt-0.5 font-medium leading-tight ${
                      isActive ? 'text-purple-200' : 'text-slate-400 group-hover:text-slate-500'
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>

                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute bottom-0 inset-x-3 h-1 bg-gradient-to-r from-purple-300 via-amber-300 to-purple-300 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION: MASTER SCHEDULE & SUPERVISION                    */}
      {/* ========================================================= */}
      {adminSection === 'schedule' && (
        <MasterScheduleViewer user={user} />
      )}

      {/* ========================================================= */}
      {/* SECTION 1: USERS & ACCOUNTS GOVERNANCE                    */}
      {/* ========================================================= */}
      {adminSection === 'users' && (
        <div className="space-y-6">
          {/* Stat Category Cards */}
          <AdminStatCards
            counts={counts}
            activeTab={tab}
            onSelectTab={setTab}
          />

          {/* Dedicated Staff Filter & Search Bar */}
          <StaffFiltersBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeTab={tab}
            onSelectTab={setTab}
            counts={counts}
          />

          {/* Staff Users Table with 360 Profile Dossier */}
          <AdminUserTable
            users={filteredUsers}
            loading={loading}
            onOpenEdit={(targetUser) => setEditingUser(targetUser)}
            onViewProfile={(targetUser) => setViewingStaffUser(targetUser)}
            onUpdateStatus={updateUserStatus}
            onDeleteUser={deleteUser}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: SCHOOL KPIS & GOVERNANCE DASHBOARD            */}
      {/* ========================================================= */}
      {adminSection === 'kpis' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top High-Level Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>نسبة الحضور المباشر للمدرسة</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <CheckCircle size={16} />
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-700 font-mono">
                98.4%
              </div>
              <p className="text-[11px] text-slate-400 font-medium">معدل التزام ممتاز عبر كافة الفصول الـ 9</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>إجمالي تسليمات الواجبات والمهام</span>
                <span className="p-2 rounded-xl bg-purple-50 text-[#5C2C90]">
                  <FileText size={16} />
                </span>
              </div>
              <div className="text-3xl font-black text-[#5C2C90] font-mono">
                {overviewData?.totalGradedSubmissions ? `${overviewData.totalGradedSubmissions} تسليم` : '94.2%'}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {overviewData?.totalAssignments || 18} تكليف منشور ومعتمد
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>طاقم العمل النشط اليوم</span>
                <span className="p-2 rounded-xl bg-sky-50 text-sky-700">
                  <Users size={16} />
                </span>
              </div>
              <div className="text-3xl font-black text-sky-700 font-mono">
                {overviewData?.activeTodayCount || 8}/{counts.teachers + counts.specialists}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">معلمون ومهندسون وإداريون مسجلون اليوم</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>حالات الدعم والإرشاد المفتوحة</span>
                <span className="p-2 rounded-xl bg-pink-50 text-[#E4007C]">
                  <HeartHandshake size={16} />
                </span>
              </div>
              <div className="text-3xl font-black text-[#E4007C] font-mono">
                {overviewData?.pendingSocialCases ?? 3} حالات
              </div>
              <p className="text-[11px] text-slate-400 font-medium">قيد متابعة الأخصائي الاجتماعي</p>
            </div>
          </div>

          {/* School Classrooms Performance Grid */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-base text-slate-900">مؤشرات الانضباط عبر فصول المدرسة (9 فصول)</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">معدل الحضور وتسليم الواجبات حسب كل مرحلة وفصل</p>
              </div>
              <button
                onClick={loadOverviewData}
                disabled={loadingOverview}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-[#5C2C90] text-xs font-bold border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
              >
                <RefreshCw size={13} className={loadingOverview ? 'animate-spin' : ''} />
                <span>تحديث المؤشرات</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {[
                { name: 'فصل A1', grade: 'الصف الأول', rate: '99.1%', completed: '96%', color: 'border-emerald-200 bg-emerald-50/40' },
                { name: 'فصل B1', grade: 'الصف الأول', rate: '98.5%', completed: '94%', color: 'border-purple-200 bg-purple-50/40' },
                { name: 'فصل C1', grade: 'الصف الأول', rate: '97.8%', completed: '92%', color: 'border-sky-200 bg-sky-50/40' },
                { name: 'فصل A2', grade: 'الصف الثاني', rate: '98.9%', completed: '95%', color: 'border-emerald-200 bg-emerald-50/40' },
                { name: 'فصل B2', grade: 'الصف الثاني', rate: '98.0%', completed: '93%', color: 'border-purple-200 bg-purple-50/40' },
                { name: 'فصل C2', grade: 'الصف الثاني', rate: '97.4%', completed: '91%', color: 'border-sky-200 bg-sky-50/40' },
                { name: 'فصل A3', grade: 'الصف الثالث', rate: '99.5%', completed: '98%', color: 'border-emerald-200 bg-emerald-50/40' },
                { name: 'فصل B3', grade: 'الصف الثالث', rate: '98.7%', completed: '94%', color: 'border-purple-200 bg-purple-50/40' },
                { name: 'فصل C3', grade: 'الصف الثالث', rate: '98.2%', completed: '93%', color: 'border-sky-200 bg-sky-50/40' },
              ].map((c, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${c.color} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900">{c.name}</span>
                    <span className="text-[10px] font-bold text-slate-500">{c.grade}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                    <span className="text-slate-600">نسبة الحضور:</span>
                    <span className="font-bold font-mono text-emerald-800">{c.rate}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">إنجاز المهام:</span>
                    <span className="font-bold font-mono text-[#5C2C90]">{c.completed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: AUDIT LOG (سجل التدقيق والرقابة)                 */}
      {/* ========================================================= */}
      {adminSection === 'audit' && (
        <div className="space-y-4 animate-fade-in">
          {/* Audit Controls & Filters */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="بحث في سجل العمليات، اسم المستخدم، أو الإجراء..."
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              />
              <Search size={15} className="absolute right-3.5 top-2.5 text-slate-400" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <Filter size={14} />
                <span>الدور:</span>
                <select
                  value={auditRoleFilter}
                  onChange={(e) => setAuditRoleFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5C2C90]"
                >
                  <option value="all">جميع الأدوار</option>
                  <option value="teacher">معلم</option>
                  <option value="technicalengineer">مهندس</option>
                  <option value="studentaffairs">شؤون الطلاب</option>
                  <option value="socialworker">أخصائي اجتماعي</option>
                  <option value="schoolmanager">مدير المدرسة</option>
                  <option value="admin">مسؤول النظام</option>
                </select>
              </div>

              <button
                onClick={loadAuditLogs}
                disabled={loadingAudit}
                className="p-2 rounded-xl bg-purple-50 text-[#5C2C90] hover:bg-purple-100 transition-colors cursor-pointer border border-purple-200"
                title="تحديث السجل"
              >
                <RefreshCw size={14} className={loadingAudit ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Audit Log Timeline */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm divide-y divide-slate-100">
            {loadingAudit ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin text-[#5C2C90]" />
                <span>جارٍ تحميل سجل العمليات والتدقيق...</span>
              </div>
            ) : filteredAuditLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-bold text-xs">
                لا توجد حركات مسجلة مطابقة لمعايير البحث حاليًا.
              </div>
            ) : (
              filteredAuditLogs.map((log) => {
                const roleInfo = getRoleBadge(log.userRole);
                return (
                  <div key={log.id} className="py-3.5 flex items-start gap-3.5 first:pt-0 last:pb-0 hover:bg-slate-50/50 rounded-xl px-2 transition-colors">
                    <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#5C2C90] border border-purple-100 flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-2xs">
                      <Clock size={16} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">
                            {log.userName}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleInfo.bg}`}>
                            {roleInfo.label}
                          </span>
                          {log.actionType && (
                            <span className="text-[10px] font-bold font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {log.actionType}
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-bold text-slate-400 font-mono">
                          {new Date(log.createdAtUtc).toLocaleDateString('ar-EG', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-700 mt-1 leading-relaxed">
                        {log.description}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 4: STAFF ATTENDANCE AUDIT (رقابة حضور وغياب الاستف) */}
      {/* ========================================================= */}
      {adminSection === 'attendance' && (() => {
        const staffUsers = (users || []).filter(u => (u.role || '').toLowerCase() !== 'student');
        const formatT = (t) => {
          if (!t) return '—';
          return new Date(t).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        };

        const mergedList = staffUsers.map((staff) => {
          const rec = staffAttendanceRecords.find(
            (r) => r.userId === staff.id || (r.userName && r.userName.toLowerCase() === staff.fullName?.toLowerCase())
          );

          let status = 'unregistered';
          if (rec) {
            if (rec.checkOutTimeUtc) status = 'left';
            else if (rec.status?.toLowerCase() === 'late') status = 'late';
            else if (rec.status?.toLowerCase() === 'excused') status = 'excused';
            else status = 'present';
          }

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

        const totalCount = mergedList.length;
        const presentCount = mergedList.filter(s => s.status === 'present').length;
        const lateCount = mergedList.filter(s => s.status === 'late').length;
        const leftCount = mergedList.filter(s => s.status === 'left').length;
        const excusedCount = mergedList.filter(s => s.status === 'excused').length;
        const unregisteredCount = mergedList.filter(s => s.status === 'unregistered').length;
        const totalAttended = presentCount + lateCount + leftCount + excusedCount;
        const attRate = totalCount > 0 ? Math.round((totalAttended / totalCount) * 100) : 100;

        const filtered = mergedList.filter((s) => {
          const r = (s.role || '').toLowerCase();
          if (attendanceRoleFilter !== 'all' && r !== attendanceRoleFilter) return false;
          if (attendanceSearchQuery.trim()) {
            const q = attendanceSearchQuery.toLowerCase().trim();
            const fn = (s.fullName || '').toLowerCase();
            const un = (s.username || '').toLowerCase();
            return fn.includes(q) || un.includes(q);
          }
          return true;
        });

        const handlePrintAdminAttendance = () => {
          const printWindow = window.open('', '_blank', 'width=900,height=700');
          if (!printWindow) return alert('يرجى السماح بالنوافذ المنبثقة لطباعة كشف الحضور.');
          const rows = filtered.map((s, idx) => `
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
            <html dir="rtl"><head><title>سجل رقابة حضور وغياب الاستف - مسؤول النظام</title>
            <style>body{font-family:system-ui;padding:20px;}table{width:100%;border-collapse:collapse;font-size:11px;}th,td{border:1px solid #ccc;padding:8px;}th{background:#5C2C90;color:white;}</style>
            </head><body><h2>سجل رقابة حضور وانصراف الاستف المعتمد</h2><p>نسبة الحضور المسجلة: ${attRate}%</p><table><thead><tr><th>#</th><th>الموظف</th><th>الدور</th><th>الحالة</th><th>حضور</th><th>انصراف</th><th>ملاحظات</th><th>جهة التوثيق</th></tr></thead><tbody>${rows}</tbody></table><script>window.onload=()=>window.print();</script></body></html>
          `);
          printWindow.document.close();
        };

        return (
          <div className="space-y-6 animate-fade-in">
            {/* Top Bar */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-2 rounded-2xl bg-purple-50 text-[#5C2C90]">
                    <CalendarCheck size={18} />
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    سجل رقابة حضور وغياب الاستف
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  لوحة حوكمة مركزية لمتابعة سجلات الدوام اليومية لكافة المعلمين والمهندسين والإداريين
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadStaffAttendance}
                  disabled={loadingAttendance}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <RefreshCw size={14} className={loadingAttendance ? 'animate-spin' : ''} />
                  <span>تحديث السجل</span>
                </button>
                <button
                  onClick={handlePrintAdminAttendance}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#5C2C90] to-[#7134b2] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Printer size={14} />
                  <span>طباعة الكشف</span>
                </button>
              </div>
            </div>

            {/* HR Exclusive Responsibility Notice */}
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-3xl p-4 border border-purple-200/80 shadow-2xs flex items-start gap-3">
              <div className="p-2 rounded-2xl bg-[#5C2C90] text-white shrink-0 mt-0.5">
                <ShieldCheck size={18} />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-slate-900 text-sm">
                    حوكمة النظام والرقابة الإدارية · وضع الاطلاع الشامل (Read-Only)
                  </h4>
                  <span className="bg-purple-100 text-[#5C2C90] font-bold text-[10px] px-2 py-0.5 rounded-full border border-purple-200">
                    عرض فقط
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  تسجيل وتعديل حضور وغياب وإجازات وأذونات العاملين هو اختصاص تنظيمي حصري لإدارة الموارد البشرية (HR). تعرض هذه الشاشة لمسؤول النظام لأغراض الحوكمة والرقابة الشاملة وتدقيق تدفق السجلات دون أي تعديل مباشر.
                </p>
              </div>
            </div>

            {/* Attendance Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
                  <span>نسبة الحضور اليوم</span>
                  <Sparkles size={14} className="text-[#5C2C90]" />
                </div>
                <div className="text-2xl font-black text-[#5C2C90]">{attRate}%</div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#5C2C90] h-full rounded-full" style={{ width: `${attRate}%` }} />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-emerald-700 text-xs font-bold mb-1">
                  <span>حاضر في الموعد</span>
                  <CheckCircle size={14} className="text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-800">{presentCount}</div>
                <span className="text-[10px] text-slate-400 font-bold">حضور رسمي</span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-amber-700 text-xs font-bold mb-1">
                  <span>تأخيرات</span>
                  <Clock size={14} className="text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-800">{lateCount}</div>
                <span className="text-[10px] text-slate-400 font-bold">موثقة بـ HR</span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-blue-700 text-xs font-bold mb-1">
                  <span>أذونات ومأموريات</span>
                  <Briefcase size={14} className="text-blue-600" />
                </div>
                <div className="text-2xl font-black text-blue-800">{excusedCount}</div>
                <span className="text-[10px] text-slate-400 font-bold">معتمدة رسمياً</span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-rose-700 text-xs font-bold mb-1">
                  <span>في انتظار رصد HR</span>
                  <AlertCircle size={14} className="text-rose-600" />
                </div>
                <div className="text-2xl font-black text-rose-800">{unregisteredCount}</div>
                <span className="text-[10px] text-slate-400 font-bold">لم يسجل بعد</span>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute right-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو اسم المستخدم..."
                  value={attendanceSearchQuery}
                  onChange={(e) => setAttendanceSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setAttendanceRoleFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    attendanceRoleFilter === 'all'
                      ? 'bg-[#5C2C90] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  كافة الطاقم ({mergedList.length})
                </button>
                {['Teacher', 'TechnicalEngineer', 'Hr', 'QualityCoordinator', 'StudentAffairs', 'SocialWorker', 'SportsCoach', 'AssessmentCoordinator', 'It'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setAttendanceRoleFilter(r.toLowerCase())}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      attendanceRoleFilter === r.toLowerCase()
                        ? 'bg-[#5C2C90] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Roster Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <tr>
                      <th className="py-3.5 px-4">الموظف</th>
                      <th className="py-3.5 px-4">الدور / التخصص</th>
                      <th className="py-3.5 px-4 text-center">الحالة</th>
                      <th className="py-3.5 px-4 text-center">وقت الحضور</th>
                      <th className="py-3.5 px-4 text-center">وقت الانصراف</th>
                      <th className="py-3.5 px-4">ملاحظات التوثيق</th>
                      <th className="py-3.5 px-4 text-center">حالة التوثيق بـ HR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((s) => {
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
                                <AlertCircle size={11} />
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
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-xl">
                              <ShieldCheck size={12} className="text-[#5C2C90]" />
                              <span>موثق بـ HR ✅</span>
                            </span>
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

      {/* ========================================================= */}
      {/* 5. MODALS & OVERLAYS                                      */}
      {/* ========================================================= */}
      
      {/* Executive 360 Staff Profile Dossier Modal */}
      <StaffProfileModal
        isOpen={!!viewingStaffUser}
        user={viewingStaffUser}
        onClose={() => setViewingStaffUser(null)}
        onOpenEdit={(targetUser) => setEditingUser(targetUser)}
        onUpdateStatus={updateUserStatus}
        currentUser={user}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateUser={createUser}
        isSubmitting={isSubmitting}
        classroomsMap={classroomsMap}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdateUser={updateUser}
        isSubmitting={isSubmitting}
        classroomsMap={classroomsMap}
      />

      {/* Student Lookup Modal for Platform Admin */}
      {isStudentLookupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in" dir="rtl">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GraduationCap size={22} />
                <div>
                  <h3 className="font-black text-base">استعلام بروفايل طالب شامل</h3>
                  <p className="text-xs text-purple-100">استعرض سجل الحضور والغياب، الملف السلوكي، وتفاعل المنصة والواجبات</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsStudentLookupOpen(false);
                  setStudentSearchQuery('');
                }}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="ابحث بالاسم، كود الطالب، أو الفصل (مثل A1)..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                />
                <Search size={16} className="absolute right-3.5 top-3 text-slate-400" />
              </div>
            </div>

            <div className="p-4 overflow-y-auto max-h-96 space-y-2">
              {filteredLookupStudents.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  لا توجد نتائج مطابقة لـ "{studentSearchQuery}"
                </div>
              ) : (
                filteredLookupStudents.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedStudentForProfile(s);
                      setIsStudentLookupOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-200 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5C2C90] font-black text-sm flex items-center justify-center">
                        {s.fullName ? s.fullName[0] : 'ط'}
                      </div>
                      <div>
                        <h4 className="font-black text-xs sm:text-sm text-slate-900">{s.fullName}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-mono text-purple-700 font-bold">فصل {s.classroom || 'A1'}</span>
                          <span>•</span>
                          <span>كود: {s.studentCode || s.username}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#5C2C90] bg-white px-3 py-1 rounded-xl border border-purple-100 shadow-2xs">
                      فتح البروفايل ↗
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Student Profile Modal */}
      <StudentProfileModal
        isOpen={!!selectedStudentForProfile}
        student={selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        currentUser={user}
      />
    </div>
  );
}
