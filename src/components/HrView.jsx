import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Clock, FileText, CheckCircle2, AlertCircle, 
  Search, Filter, Plus, ShieldCheck, Award, AlertTriangle, 
  Printer, ArrowRight, Eye, Check, X, Building, Scale, MessageSquare
} from 'lucide-react';
import { api } from '../api/client';
import { getRoleBadgeInfo } from '../features/admin/constants';
import StaffProfileModal from '../features/admin/components/StaffProfileModal';

export default function HrView({ user }) {
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'investigations' | 'memos'
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modals
  const [selectedStaffProfile, setSelectedStaffProfile] = useState(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isInvModalOpen, setIsInvModalOpen] = useState(false);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [viewingMemo, setViewingMemo] = useState(null);
  const [viewingInv, setViewingInv] = useState(null);

  // Forms
  const [leaveForm, setLeaveForm] = useState({
    userId: '',
    leaveType: 'عارضة',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    daysCount: 1,
    reason: '',
    notes: ''
  });

  const [invForm, setInvForm] = useState({
    subject: '',
    staffUserId: '',
    staffUserName: '',
    staffRole: '',
    incidentDate: new Date().toISOString().split('T')[0],
    summaryOfAllegations: '',
    staffStatement: '',
    findings: '',
    decision: 'قيد الفحص والتحقيق',
    status: 'open'
  });

  const [memoForm, setMemoForm] = useState({
    memoType: 'مذكرة شكوى',
    title: '',
    targetStaffName: '',
    targetStaffRole: 'Teacher',
    content: '',
    recommendations: '',
    priority: 'عادية',
    status: 'قيد الفحص',
    managerRemarks: ''
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadHrData();
  }, []);

  const loadHrData = async () => {
    setLoading(true);
    try {
      const data = await api.getHrOverview();
      setOverview(data);
    } catch (err) {
      console.error('Failed to load HR overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAttendance = async (staffUser, status) => {
    try {
      await api.recordHrAttendance({
        userId: staffUser.id,
        status,
        notes: `تم التوثيق إلكترونياً بواسطة إدارة الموارد البشرية (${user?.fullName || 'HR'})`
      });
      await loadHrData();
    } catch (err) {
      alert('فشل تسجيل الحضور: ' + err.message);
    }
  };

  const handleLeaveStatus = async (leaveId, status) => {
    try {
      await api.updateHrLeaveStatus(leaveId, {
        status,
        approvedBy: `${user?.fullName || 'مسؤول الموارد البشرية'}`,
        notes: status === 'approved' ? 'تم اعتماد الإجازة وخصمها من الرصيد السنوي' : 'تم الرفض لتعذر تأمين البديل'
      });
      await loadHrData();
    } catch (err) {
      alert('فشل تحديث حالة الإجازة: ' + err.message);
    }
  };

  const handleCreateLeave = async (e) => {
    e.preventDefault();
    if (!leaveForm.userId) {
      alert('يرجى اختيار الموظف');
      return;
    }
    setSubmitting(true);
    try {
      await api.createHrLeave(leaveForm);
      alert('تم تقديم وتوثيق طلب الإجازة بنجاح');
      setIsLeaveModalOpen(false);
      setLeaveForm({
        userId: '',
        leaveType: 'عارضة',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        daysCount: 1,
        reason: '',
        notes: ''
      });
      await loadHrData();
    } catch (err) {
      alert('خطأ: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateInvestigation = async (e) => {
    e.preventDefault();
    if (!invForm.subject || !invForm.staffUserId) {
      alert('يرجى ملء موضوع التحقيق واختيار الموظف المحال');
      return;
    }
    setSubmitting(true);
    try {
      const selectedStaff = overview?.staff?.find(s => s.id === invForm.staffUserId);
      await api.createHrInvestigation({
        ...invForm,
        staffUserName: selectedStaff?.fullName || invForm.staffUserName,
        staffRole: selectedStaff?.role || invForm.staffRole,
        investigatorId: user?.id || '00000000-0000-0000-0000-000000000000',
        investigatorName: user?.fullName || 'أ. مها الشناوي (الموارد البشرية)'
      });
      alert('تم فتح ملف التحقيق الإداري بنجاح');
      setIsInvModalOpen(false);
      await loadHrData();
    } catch (err) {
      alert('خطأ: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateMemo = async (e) => {
    e.preventDefault();
    if (!memoForm.title || !memoForm.content) {
      alert('يرجى إدخال عنوان ومحتوى المذكرة');
      return;
    }
    setSubmitting(true);
    try {
      await api.createHrMemo({
        ...memoForm,
        createdById: user?.id || '00000000-0000-0000-0000-000000000000',
        createdByName: user?.fullName || 'أ. مها الشناوي (الموارد البشرية)'
      });
      alert('تم حفظ وإصدار المذكرة الإدارية بنجاح');
      setIsMemoModalOpen(false);
      await loadHrData();
    } catch (err) {
      alert('خطأ: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter staff list
  const staffList = overview?.staff || [];
  const filteredStaff = staffList.filter(s => {
    const matchSearch = !searchQuery.trim() || 
      (s.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.username || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || (s.role || '').toLowerCase() === roleFilter.toLowerCase();
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-800/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <Scale size={14} />
              <span>إدارة الموارد البشرية وشؤون العاملين (Human Resources)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              منظومة شؤون العاملين والرقابة الإدارية
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              متابعة الانضباط اليومي، الحضور والغياب، التحقيقات والمساءلات الإدارية، وإصدار مذكرات الشكاوى والالتماسات المعتمدة لكافة طاقم المدرسة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-2xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus size={16} />
              <span>تسجيل إجازة</span>
            </button>
            <button
              onClick={() => setIsInvModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-rose-900/30"
            >
              <Scale size={16} />
              <span>فتح ملف تحقيق إداري</span>
            </button>
            <button
              onClick={() => setIsMemoModalOpen(true)}
              className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-purple-900/30"
            >
              <FileText size={16} />
              <span>إصدار مذكرة إدارية</span>
            </button>
          </div>
        </div>

        {/* 4 Executive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
              <span>طاقم العمل المقيد</span>
              <Users size={16} className="text-purple-300" />
            </div>
            <div className="text-2xl font-black text-white">{overview?.totalStaffCount || 0}</div>
            <div className="text-[11px] text-purple-200 mt-1 font-medium">معلمون ومهندسون وإداريون</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
              <span>حضور اليوم الفعلي</span>
              <Clock size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {(overview?.todayPresentCount || 0) + (overview?.todayLateCount || 0)}
              <span className="text-xs text-slate-400 font-normal mr-1.5">/ {overview?.totalStaffCount || 0}</span>
            </div>
            <div className="text-[11px] text-emerald-300 mt-1 font-medium">
              منهم {overview?.todayLateCount || 0} متأخر بعلم
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
              <span>طلبات الإجازات المعلقة</span>
              <AlertCircle size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{overview?.pendingLeavesCount || 0}</div>
            <div className="text-[11px] text-amber-200 mt-1 font-medium">تتطلب فحص واعتماد HR</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
              <span>التحقيقات والمذكرات</span>
              <Scale size={16} className="text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-300">
              {overview?.activeInvestigationsCount || 0}
              <span className="text-xs text-slate-400 font-normal mr-1.5">تحقيق نشط</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-1 font-medium">
              {overview?.totalMemosCount || 0} مذكرة إدارية مسجلة
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-3 gap-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'attendance'
                ? 'bg-[#5C2C90] text-white shadow-md shadow-purple-900/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Clock size={16} />
            <span>🕒 حضور وغياب طاقم العمل والإجازات</span>
            {overview?.pendingLeavesCount > 0 && (
              <span className="bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-full text-[10px] font-black">
                {overview.pendingLeavesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('investigations')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'investigations'
                ? 'bg-rose-700 text-white shadow-md shadow-rose-900/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Scale size={16} />
            <span>⚖️ ملفات التحقيقات والمساءلات الإدارية</span>
            {overview?.activeInvestigationsCount > 0 && (
              <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-black">
                {overview.activeInvestigationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('memos')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'memos'
                ? 'bg-purple-900 text-white shadow-md shadow-purple-950/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <FileText size={16} />
            <span>📋 المذكرات الرسمية والشكاوى ({overview?.totalMemosCount || 0})</span>
          </button>
        </div>

        <button
          onClick={loadHrData}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-all cursor-pointer shrink-0"
        >
          تحديث السجلات 🔄
        </button>
      </div>

      {/* TAB 1: Staff Attendance & Leaves */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Leaves Section First */}
          {overview?.leaves && overview.leaves.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">سجل الإجازات والأذونات الرسمية للعاملين</h3>
                    <p className="text-xs text-slate-400">اعتماد ومتابعة الإجازات الاعتيادية والعارضة والمرضية</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>طلب إجازة جديد</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200/70">
                      <th className="py-2.5 px-3">العضو</th>
                      <th className="py-2.5 px-3">نوع الإجازة</th>
                      <th className="py-2.5 px-3">الفترة والمدة</th>
                      <th className="py-2.5 px-3">السبب</th>
                      <th className="py-2.5 px-3 text-center">الحالة</th>
                      <th className="py-2.5 px-3 text-center">الإجراء الإداري</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {overview.leaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900">
                          <div>{leave.userName}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{leave.userRole}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-[#5C2C90] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                            {leave.leaveType}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-mono text-slate-700">
                            {new Date(leave.startDate).toLocaleDateString('ar-EG')}
                          </div>
                          <span className="text-[10px] text-slate-400">({leave.daysCount} أيام)</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={leave.reason}>
                          {leave.reason || '—'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {leave.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <CheckCircle2 size={12} /> معتمدة
                            </span>
                          ) : leave.status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                              <X size={12} /> مرفوضة
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              <Clock size={12} /> قيد المراجعة
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {leave.status === 'pending' ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleLeaveStatus(leave.id, 'approved')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                              >
                                اعتماد
                              </button>
                              <button
                                onClick={() => handleLeaveStatus(leave.id, 'rejected')}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                              >
                                رفض
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {leave.approvedBy || 'تم البت فيها'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Daily Staff Attendance Roster */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5C2C90] flex items-center justify-center font-bold">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">كشف الانضباط والحضور اليومي لكافة العاملين</h3>
                  <p className="text-xs text-slate-400">تاريخ اليوم: {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="relative">
                  <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="بحث باسم الموظف..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="all">كافة الوظائف</option>
                  <option value="teacher">معلم</option>
                  <option value="technicalengineer">مهندس</option>
                  <option value="sportscoach">كابتن رياضي</option>
                  <option value="assessmentcoordinator">مسؤول الامتحانات</option>
                  <option value="socialworker">أخصائي اجتماعي</option>
                  <option value="studentaffairs">شؤون طلاب</option>
                  <option value="it">دعم فني IT</option>
                </select>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">اسم الموظف / الدور الوظيفي</th>
                    <th className="py-3 px-3">رقم الهاتف</th>
                    <th className="py-3 px-3 text-center">حالة الحضور اليوم</th>
                    <th className="py-3 px-3 text-center">تسجيل / تعديل الحالة</th>
                    <th className="py-3 px-3 text-center">ملف الأداء والبروفايل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((staff, idx) => {
                    const badge = getRoleBadgeInfo(staff.role);
                    const attRecord = overview?.todayAttendances?.find(a => a.userId === staff.id);
                    const currentStatus = attRecord?.status || 'لم يُرصد';

                    return (
                      <tr key={staff.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-400 font-bold">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-extrabold text-slate-900 text-sm">{staff.fullName}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.color}`}>
                              {badge.label}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{staff.username}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600 font-bold">
                          {staff.phoneNumber || '—'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {currentStatus === 'Present' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <CheckCircle2 size={12} /> حاضر بالمنصة والمدرسة
                            </span>
                          ) : currentStatus === 'Late' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              <Clock size={12} /> متأخر
                            </span>
                          ) : currentStatus === 'Absent' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                              <AlertCircle size={12} /> غائب
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                              في انتظار التسجيل
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleRecordAttendance(staff, 'Present')}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                              title="تسجيل حضور"
                            >
                              حاضر
                            </button>
                            <button
                              onClick={() => handleRecordAttendance(staff, 'Late')}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 cursor-pointer"
                              title="تسجيل تأخير"
                            >
                              متأخر
                            </button>
                            <button
                              onClick={() => handleRecordAttendance(staff, 'Absent')}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer"
                              title="تسجيل غياب"
                            >
                              غائب
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => setSelectedStaffProfile(staff)}
                            className="text-xs font-bold text-[#5C2C90] hover:text-[#421d69] bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye size={13} />
                            <span>عرض البروفايل</span>
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
      )}

      {/* TAB 2: Staff Investigations (التحقيقات الإدارية للعاملين) */}
      {activeTab === 'investigations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <div>
              <h3 className="text-base font-black text-slate-900">سجل التحقيقات والمساءلات الإدارية الرسمية</h3>
              <p className="text-xs text-slate-400 mt-0.5">توثيق إجراءات الفحص وسماع الإفادات وقرارات الجزاءات المعتمدة</p>
            </div>
            <button
              onClick={() => setIsInvModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>فتح ملف تحقيق جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(overview?.investigations || []).map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4 text-right"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                      {inv.investigationNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(inv.incidentDate).toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    inv.status === 'closed_decision_rendered'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {inv.status === 'closed_decision_rendered' ? 'تم القرار والاعتماد ✅' : 'قيد الفحص والتحقيق ⚖️'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-snug">{inv.subject}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{inv.summaryOfAllegations}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">العضو المشكو بحقه:</span>
                    <span className="font-bold text-slate-900">{inv.staffUserName} ({inv.staffRole})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">القائم بالتحقيق:</span>
                    <span className="font-semibold text-slate-700">{inv.investigatorName}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 font-bold">القرار الإداري:</span>
                    <span className="font-black text-rose-800">{inv.decision}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setViewingInv(inv)}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye size={14} />
                    <span>عرض التفاصيل والإفادات</span>
                  </button>
                  {inv.managerEndorsement && (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      معتمد إدارياً 🛡️
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Staff Administrative Memos (المذكرات الإدارية والشكاوى) */}
      {activeTab === 'memos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <div>
              <h3 className="text-base font-black text-slate-900">سجل المذكرات الإدارية والشكاوى والالتماسات</h3>
              <p className="text-xs text-slate-400 mt-0.5">الصياغات الرسمية المعتمدة والتأشيرات الإدارية لمدير المدرسة</p>
            </div>
            <button
              onClick={() => setIsMemoModalOpen(true)}
              className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>صياغة مذكرة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(overview?.memos || []).map((memo) => (
              <div
                key={memo.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-mono text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                      {memo.memoNumber}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {new Date(memo.createdAtUtc || Date.now()).toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                      {memo.memoType}
                    </span>
                    {memo.priority === 'عاجلة' && (
                      <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 animate-pulse">
                        عاجلة جداً
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-black text-slate-900 leading-snug">{memo.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{memo.content}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] text-slate-600">
                    <span className="text-slate-400">الحالة: </span>
                    <strong className="text-[#5C2C90]">{memo.status}</strong>
                  </div>
                  {memo.managerRemarks && (
                    <div className="text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200 text-slate-700">
                      <span className="text-[10px] text-slate-400 block font-bold">تأشيرة المدير:</span>
                      {memo.managerRemarks}
                    </div>
                  )}
                  <button
                    onClick={() => setViewingMemo(memo)}
                    className="w-full text-center text-xs font-bold text-[#5C2C90] hover:text-[#421d69] bg-purple-50 hover:bg-purple-100 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Printer size={14} />
                    <span>معاينة وطباعة المذكرة الرسمية</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Request Leave */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 text-right my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">تسجيل وتوثيق طلب إجازة موظف</h3>
              <button onClick={() => setIsLeaveModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateLeave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">الموظف المعني *</label>
                <select
                  required
                  value={leaveForm.userId}
                  onChange={(e) => setLeaveForm({ ...leaveForm, userId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                >
                  <option value="">اختر الموظف...</option>
                  {(overview?.staff || []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع الإجازة *</label>
                  <select
                    value={leaveForm.leaveType}
                    onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  >
                    <option value="عارضة">إجازة عارضة</option>
                    <option value="اعتيادية">إجازة اعتيادية سنوية</option>
                    <option value="مرضية">إجازة مرضية معتمدة</option>
                    <option value="إذن خروج ساعتين">إذن خروج طارئ (ساعتين)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">عدد الأيام</label>
                  <input
                    type="number"
                    min="1"
                    value={leaveForm.daysCount}
                    onChange={(e) => setLeaveForm({ ...leaveForm, daysCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">من تاريخ</label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">إلى تاريخ</label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">سبب الإجازة وملاحظات</label>
                <textarea
                  rows="2"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="بيان ظرف الإجازة..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'جارٍ الحفظ...' : 'حفظ طلب الإجازة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Open Investigation */}
      {isInvModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-right my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-rose-800 flex items-center gap-2">
                <Scale size={18} />
                <span>فتح ملف تحقيق ومساءلة إدارية</span>
              </h3>
              <button onClick={() => setIsInvModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvestigation} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">موضوع التحقيق *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مذكرة بشأن التأخر عن الحصة الأولى بدون إذن"
                  value={invForm.subject}
                  onChange={(e) => setInvForm({ ...invForm, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الموظف المحال للتحقيق *</label>
                <select
                  required
                  value={invForm.staffUserId}
                  onChange={(e) => setInvForm({ ...invForm, staffUserId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-rose-600"
                >
                  <option value="">اختر الموظف...</option>
                  {(overview?.staff || []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملخص الواقعة والمخالفة المنسوبة *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="وصف تفصيلي للواقعة ومكانها وتوقيتها..."
                  value={invForm.summaryOfAllegations}
                  onChange={(e) => setInvForm({ ...invForm, summaryOfAllegations: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">إفادة الموظف / أقواله (إن وجدت)</label>
                <textarea
                  rows="2"
                  placeholder="إفادة الزميل أثناء جلسة الاستماع..."
                  value={invForm.staffStatement}
                  onChange={(e) => setInvForm({ ...invForm, staffStatement: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">القرار والجزاء المقترح</label>
                <select
                  value={invForm.decision}
                  onChange={(e) => setInvForm({ ...invForm, decision: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-rose-600"
                >
                  <option value="قيد الفحص والتحقيق">قيد الفحص والتحقيق</option>
                  <option value="حفظ التحقيق لعدم وجود مخالفة">حفظ التحقيق لعدم المخالفة</option>
                  <option value="لفت نظر وتنبيه شفوي">لفت نظر وتنبيه شفوي</option>
                  <option value="إنذار إداري كتابي">إنذار إداري كتابي</option>
                  <option value="خصم يوم من الراتب">خصم يوم من الراتب</option>
                  <option value="إحالة للشؤون القانونية المركزية">إحالة للشؤون القانونية المركزية</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInvModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'جارٍ الحفظ...' : 'قيد واعتماد التحقيق'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Create Memo */}
      {isMemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-right my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-purple-900 flex items-center gap-2">
                <FileText size={18} />
                <span>صياغة مذكرة إدارية رسمية</span>
              </h3>
              <button onClick={() => setIsMemoModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateMemo} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع المذكرة *</label>
                  <select
                    value={memoForm.memoType}
                    onChange={(e) => setMemoForm({ ...memoForm, memoType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  >
                    <option value="مذكرة شكوى">مذكرة شكوى</option>
                    <option value="مذكرة لفت نظر / مخالفة إدارية">مذكرة لفت نظر / مخالفة</option>
                    <option value="مذكرة التماس / عرض">مذكرة التماس / عرض على المدير</option>
                    <option value="مذكرة إشادة وتقدير">مذكرة إشادة وتقدير</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الأولوية</label>
                  <select
                    value={memoForm.priority}
                    onChange={(e) => setMemoForm({ ...memoForm, priority: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  >
                    <option value="عادية">عادية</option>
                    <option value="عاجلة">عاجلة</option>
                    <option value="سرية للغاية">سرية للغاية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان المذكرة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مذكرة بخصوص تنظيم عمل المعامل الفنية"
                  value={memoForm.title}
                  onChange={(e) => setMemoForm({ ...memoForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نص وتفاصيل المذكرة *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="اكتب تفاصيل وموضوع المذكرة..."
                  value={memoForm.content}
                  onChange={(e) => setMemoForm({ ...memoForm, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">التوصيات والمقترح الإداري</label>
                <textarea
                  rows="2"
                  placeholder="التوصية المرفوعة للسيد مدير المدرسة..."
                  value={memoForm.recommendations}
                  onChange={(e) => setMemoForm({ ...memoForm, recommendations: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMemoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'جارٍ الحفظ...' : 'اعتماد وحفظ المذكرة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Printable Official Memo Sheet */}
      {viewingMemo && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6 text-right my-auto print:shadow-none print:border-none print:max-w-none">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#5C2C90] print:border-black">
              <div>
                <h3 className="text-xs font-bold text-slate-600">جمهورية مصر العربية</h3>
                <h4 className="text-xs font-bold text-slate-600">وزارة التربية والتعليم والتعليم الفني</h4>
                <h2 className="text-sm font-black text-[#5C2C90] mt-1">مدارس WE للتكنولوجيا التطبيقية — محافظة الشرقية</h2>
                <p className="text-[10px] text-[#E4007C] font-bold">إدارة الموارد البشرية وشؤون العاملين</p>
              </div>
              <div className="flex flex-col items-center">
                <img src="/Purple Code and Signal Crest.png" alt="Crest" className="w-14 h-14 object-contain" />
                <span className="text-[9px] font-mono text-slate-400 mt-1">{viewingMemo.memoNumber}</span>
              </div>
            </div>

            <div className="text-center py-2 bg-purple-50 rounded-2xl border border-purple-200">
              <h2 className="text-base font-black text-[#5C2C90]">{viewingMemo.memoType}</h2>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-800">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span><strong>الموضوع: </strong>{viewingMemo.title}</span>
                <span className="font-mono text-slate-500">التاريخ: {new Date(viewingMemo.createdAtUtc || Date.now()).toLocaleDateString('ar-EG')}</span>
              </div>

              <div className="py-2">
                <strong className="block text-slate-700 mb-1">تفاصيل ومحتوى المذكرة:</strong>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap">
                  {viewingMemo.content}
                </p>
              </div>

              {viewingMemo.recommendations && (
                <div className="py-2">
                  <strong className="block text-slate-700 mb-1">التوصيات والمقترح الإداري:</strong>
                  <p className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-rose-900 leading-relaxed">
                    {viewingMemo.recommendations}
                  </p>
                </div>
              )}

              {viewingMemo.managerRemarks && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <strong className="block text-[#5C2C90] mb-0.5">تأشيرة وتوجيه السيد مدير المدرسة:</strong>
                  <p className="font-bold text-slate-900">{viewingMemo.managerRemarks}</p>
                </div>
              )}
            </div>

            {/* Signature blocks */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-center text-xs gap-6">
              <div>
                <p className="text-slate-500 font-bold mb-6">مسؤول الموارد البشرية وشؤون العاملين</p>
                <p className="font-black text-slate-900">أ / مها الشناوي</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold mb-6">يعتمد ،،، مدير المدرسة</p>
                <p className="font-black text-slate-900">د / خالد السعدني</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 print:hidden">
              <button
                onClick={() => window.print()}
                className="bg-[#5C2C90] hover:bg-[#461e70] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={15} />
                <span>طباعة المذكرة</span>
              </button>
              <button
                onClick={() => setViewingMemo(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Profile Modal */}
      {selectedStaffProfile && (
        <StaffProfileModal
          user={selectedStaffProfile}
          isOpen={!!selectedStaffProfile}
          onClose={() => setSelectedStaffProfile(null)}
          currentUser={user}
        />
      )}
    </div>
  );
}
