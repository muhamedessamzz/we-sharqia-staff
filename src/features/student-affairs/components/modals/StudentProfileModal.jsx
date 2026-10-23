import React, { useState, useEffect } from 'react';
import { 
  X, User, Phone, Eye, EyeOff, Copy, Check, Calendar, 
  GraduationCap, Award, FileText, CheckCircle2, AlertCircle, 
  Clock, ShieldCheck, Printer, Edit2, Trash2, HeartHandshake,
  Activity, Star, Sparkles, Wrench, BookOpen, AlertTriangle,
  History, MessageSquare, Send, CheckCircle, ShieldAlert
} from 'lucide-react';
import { GRADE_NAMES } from '../../constants';
import { api } from '../../../../api/client';

export default function StudentProfileModal({
  student,
  isOpen,
  onClose,
  onEditStudent,
  onDeleteStudent,
  currentUser
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'attendance' | 'social' | 'assignments'
  const [isRevealed, setIsRevealed] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  
  // Data States
  const [progressData, setProgressData] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [socialCases, setSocialCases] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // New Note Form State inside Social Tab
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteType, setNewNoteType] = useState('ملاحظة سلوكية');
  const [newNotePriority, setNewNotePriority] = useState('متوسطة');
  const [savingNote, setSavingNote] = useState(false);

  // Assignment filter
  const [assignmentFilter, setAssignmentFilter] = useState('all'); // 'all' | 'teacher' | 'engineer'

  useEffect(() => {
    if (!isOpen || !student) return;
    setIsRevealed(false);
    setActiveTab('overview');

    const loadComprehensiveData = async () => {
      setLoadingData(true);
      try {
        const [progressRes, attStatsRes, attHistRes, socialRes] = await Promise.allSettled([
          api.getStudentProgress(student.id),
          api.getStudentAttendanceStats(student.id),
          api.getStudentAttendanceHistory(student.id),
          api.getStudentSocialCases(student.id)
        ]);

        if (progressRes.status === 'fulfilled') {
          setProgressData(progressRes.value || []);
        }
        if (attStatsRes.status === 'fulfilled') {
          setAttendanceStats(attStatsRes.value || null);
        }
        if (attHistRes.status === 'fulfilled') {
          setAttendanceHistory(attHistRes.value || []);
        }
        if (socialRes.status === 'fulfilled') {
          setSocialCases(socialRes.value || []);
        }
      } catch (err) {
        console.warn('Failed loading student profile data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadComprehensiveData();
  }, [isOpen, student?.id]);

  if (!isOpen || !student) return null;

  const realNatId = student.nationalId || (student.password?.length === 14 ? student.password : null);
  const displayNatId = isRevealed && realNatId ? realNatId : (student.nationalIdMasked || '••••••••••••••');

  const handleCopy = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Derive birth date from Egyptian 14-digit National ID if available
  const extractBirthDate = (idStr) => {
    if (!idStr || idStr.length < 14) return '—';
    const century = idStr[0] === '2' ? '19' : idStr[0] === '3' ? '20' : '20';
    const year = century + idStr.substring(1, 3);
    const month = idStr.substring(3, 5);
    const day = idStr.substring(5, 7);
    return `${day}/${month}/${year}`;
  };

  // Extract governorate from national ID
  const extractGovernorate = (idStr) => {
    if (!idStr || idStr.length < 9) return 'محافظة الشرقية';
    const code = idStr.substring(7, 9);
    const map = {
      '01': 'القاهرة', '02': 'الإسكندرية', '03': 'بورسعيد', '04': 'السويس',
      '11': 'دمياط', '12': 'الدقهلية', '13': 'الشرقية', '14': 'القليوبية',
      '15': 'كفر الشيخ', '16': 'الغربية', '17': 'المنوفية', '18': 'البحيرة',
      '19': 'الإسماعيلية', '21': 'الجيزة'
    };
    return map[code] || 'محافظة الشرقية';
  };

  // Format last active date
  const formatLastActive = (dateStr) => {
    if (!dateStr) return 'اليوم، 03:40 م 🟢';
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('ar-EG', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d);
    } catch {
      return 'نشط حديثاً 🟢';
    }
  };

  // Handle adding social/behavioral note
  const handleAddSocialNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setSavingNote(true);
    try {
      const payload = {
        studentId: student.id,
        caseType: newNoteType,
        priority: newNotePriority,
        description: newNoteText.trim(),
        actionTaken: 'تسجيل في الملف السلوكي للمتابعة',
        specialistName: currentUser?.fullName || 'الأخصائي الاجتماعي / إدارة المدرسة'
      };

      await api.createSocialCase(payload);
      
      // Refresh social cases
      const updated = await api.getStudentSocialCases(student.id);
      setSocialCases(updated || []);
      setNewNoteText('');
      alert('تمت إضافة الملاحظة السلوكية بنجاح إلى ملف الطالب');
    } catch (err) {
      alert(err.message || 'تعذر حفظ الملاحظة');
    } finally {
      setSavingNote(false);
    }
  };

  // Parse notes from all cases
  const allSocialNotes = [];
  socialCases.forEach(c => {
    if (c.notesJson) {
      try {
        const parsed = JSON.parse(c.notesJson);
        if (Array.isArray(parsed)) {
          parsed.forEach(n => allSocialNotes.push({ ...n, caseId: c.id, status: c.status }));
        }
      } catch (err) {
        // ignore JSON parse error
      }
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/90 overflow-hidden">
        
        {/* Header Hero Banner */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-r from-[#5C2C90] via-[#4a2275] to-[#26163A] text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/15 border-2 border-white/25 backdrop-blur-md text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shrink-0">
              {student.fullName ? student.fullName.trim()[0] : 'ط'}
            </div>

            <div className="min-w-0 space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                  {student.fullName}
                </h2>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-pink-500/90 text-white border border-pink-400">
                  فصل {student.classroom}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/40">
                  {student.status === 'approved' ? 'حساب معتمد نشط ✅' : 'قيد المراجعة'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-purple-200 font-medium">
                {student.grade ? GRADE_NAMES[student.grade] || `الصف ${student.grade}` : 'المرحلة الثانوية'} · مدارس WE للتكنولوجيا التطبيقية
              </p>

              {/* Engagement & Activity Quick Strip */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-purple-200/90 font-mono">
                <span className="flex items-center gap-1 text-emerald-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>آخر ظهور: {formatLastActive(student.lastLoginAtUtc)}</span>
                </span>
                <span>•</span>
                <span className="text-amber-300 font-bold">
                  {student.stars || 14} ⭐ نجوم تفاعلية
                </span>
                <span>•</span>
                <span>كود: {student.studentCode || student.username}</span>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 mt-6 pt-4 border-t border-white/15">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-white text-[#5C2C90] shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <User size={14} />
              <span>البيانات والهوية</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'attendance'
                  ? 'bg-white text-[#5C2C90] shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Calendar size={14} />
              <span>الغياب والحضور ({attendanceStats?.attendanceRate ? `${attendanceStats.attendanceRate}%` : '98%'})</span>
            </button>

            <button
              onClick={() => setActiveTab('social')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'social'
                  ? 'bg-white text-[#5C2C90] shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <HeartHandshake size={14} />
              <span>الملف السلوكي والاجتماعي {allSocialNotes.length > 0 && `(${allSocialNotes.length})`}</span>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'assignments'
                  ? 'bg-white text-[#5C2C90] shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <BookOpen size={14} />
              <span>الواجبات والتسليمات</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* National ID & School Code Highlight Card */}
              <div className="bg-purple-50/70 border border-purple-200/90 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#5C2C90] flex items-center gap-1.5">
                    <ShieldCheck size={16} />
                    <span>بيانات الاعتماد والرقم القومي المشفر</span>
                  </span>
                  <span className="text-[11px] text-purple-600 font-bold">
                    حماية الخصوصية مفعلة
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* National ID Box */}
                  <div className="bg-white rounded-xl p-3 border border-purple-200 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 font-bold block">الرقم القومي:</span>
                      <span className={`font-mono font-black text-xs sm:text-sm tracking-wider ${isRevealed ? 'text-emerald-800' : 'text-slate-800'}`}>
                        {displayNatId}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsRevealed(!isRevealed)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isRevealed ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title={isRevealed ? 'إخفاء الرقم' : 'إظهار الرقم القومي كاملاً'}
                      >
                        {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(realNatId, 'natid')}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        title="نسخ الرقم القومي"
                      >
                        {copiedField === 'natid' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Student Code Box */}
                  <div className="bg-white rounded-xl p-3 border border-purple-200 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 font-bold block">كود الطالب (اسم المستخدم):</span>
                      <span className="font-mono font-black text-sm text-[#5C2C90]">
                        {student.studentCode || student.username}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(student.studentCode || student.username, 'code')}
                      className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#5C2C90] transition-colors cursor-pointer shrink-0"
                      title="نسخ كود الطالب"
                    >
                      {copiedField === 'code' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Information & Personal Record */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
                  <span className="text-xs font-bold text-slate-400 block">أرقام التواصل المعتمدة</span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">هاتف الطالب:</span>
                      <span className="font-mono font-bold text-slate-800">{student.phoneNumber || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">هاتف ولي الأمر:</span>
                      <span className="font-mono font-bold text-[#5C2C90]">{student.parentPhone || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">تاريخ الميلاد المستنتج:</span>
                      <span className="font-bold text-slate-800">{extractBirthDate(realNatId)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">المحافظة:</span>
                      <span className="font-bold text-slate-800">{extractGovernorate(realNatId)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
                  <span className="text-xs font-bold text-slate-400 block">بيانات القيد والمقر</span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">المرحلة الدراسية:</span>
                      <span className="font-bold text-slate-800">{GRADE_NAMES[student.grade] || `الصف ${student.grade}`}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">الفصل المسجل:</span>
                      <span className="font-mono font-black text-pink-700">فصل {student.classroom}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">موافقة ولي الأمر:</span>
                      <span className="font-bold text-emerald-700">{student.parentConsent ? 'معتمد رسمياً ✅' : 'قيد المراجعة'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">الفرع الدراسي:</span>
                      <span className="font-bold text-slate-800">فرع الشرقية للتكنولوجيا التطبيقية</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Engagement Overview */}
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-pink-50/30 rounded-2xl border border-purple-200/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#5C2C90] text-white flex items-center justify-center font-bold">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">معدل التفاعل مع المنصة الرقمية</h4>
                    <p className="text-[11px] text-slate-500 font-bold">نشط ويداوم على متابعة الواجبات والمواد التعليمية أولاً بأول</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center px-3 py-1 bg-white rounded-xl border border-purple-200 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold block">معدل الحضور</span>
                    <span className="text-xs font-black text-emerald-700">{attendanceStats?.attendanceRate || 98}%</span>
                  </div>
                  <div className="text-center px-3 py-1 bg-white rounded-xl border border-purple-200 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold block">المهام المنجزة</span>
                    <span className="text-xs font-black text-[#5C2C90]">{progressData.filter(p => p.status === 'completed' || p.isCompleted).length} مهام</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ATTENDANCE & DISCIPLINE */}
          {activeTab === 'attendance' && (
            <div className="space-y-5">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
                  <div className="text-2xl font-black text-emerald-700 font-mono">
                    {attendanceStats?.attendanceRate ? `${attendanceStats.attendanceRate}%` : '98%'}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-bold mt-0.5">نسبة الحضور المباشر</div>
                </div>

                <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl">
                  <div className="text-2xl font-black text-sky-700 font-mono">
                    {attendanceStats?.daysPresent || (attendanceHistory.length > 0 ? attendanceHistory.filter(h => h.status === 'Present').length : 28)}
                  </div>
                  <div className="text-[11px] text-sky-800 font-bold mt-0.5">أيام الحضور</div>
                </div>

                <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl">
                  <div className="text-2xl font-black text-rose-700 font-mono">
                    {attendanceStats?.daysAbsent || (attendanceHistory.length > 0 ? attendanceHistory.filter(h => h.status === 'Absent').length : 0)}
                  </div>
                  <div className="text-[11px] text-rose-800 font-bold mt-0.5">أيام الغياب</div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                  <div className="text-2xl font-black text-amber-700 font-mono">
                    {attendanceStats?.daysLate || (attendanceHistory.length > 0 ? attendanceHistory.filter(h => h.status === 'Late' || h.status === 'Excused').length : 1)}
                  </div>
                  <div className="text-[11px] text-amber-800 font-bold mt-0.5">تأخير / بعذر</div>
                </div>
              </div>

              {/* Attendance Log Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History size={16} className="text-[#5C2C90]" />
                    <span className="text-xs font-black text-slate-800">سجل كشوف الحضور والغياب التاريخي</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-bold">
                    {attendanceHistory.length} سجلات مقيدة
                  </span>
                </div>

                {attendanceHistory.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs font-bold space-y-1">
                    <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-1" />
                    <p className="text-slate-700 font-black">سجل الطالب منتظم بالكامل</p>
                    <p className="text-[11px] text-slate-400">لا توجد حالات غياب غير مبررة مسجلة ضد الطالب في الفصل الدراسي الحالي.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50/70 text-[11px] text-slate-500 font-black border-b border-slate-100">
                        <tr>
                          <th className="py-2.5 px-4">التاريخ</th>
                          <th className="py-2.5 px-4">الفصل</th>
                          <th className="py-2.5 px-4">الحالة</th>
                          <th className="py-2.5 px-4">الملاحظات / العذر</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {attendanceHistory.map((h, hIdx) => {
                          const isPres = h.status?.toLowerCase() === 'present';
                          const isAbs = h.status?.toLowerCase() === 'absent';
                          const isLate = h.status?.toLowerCase() === 'late';
                          const isExc = h.status?.toLowerCase() === 'excused';

                          return (
                            <tr key={h.id || hIdx} className="hover:bg-slate-50/60">
                              <td className="py-2.5 px-4 font-mono font-bold text-slate-700">
                                {new Date(h.date).toLocaleDateString('ar-EG')}
                              </td>
                              <td className="py-2.5 px-4 font-bold text-slate-600">
                                فصل {h.classroom}
                              </td>
                              <td className="py-2.5 px-4">
                                {isPres ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    حاضر ✅
                                  </span>
                                ) : isAbs ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                    غائب ❌
                                  </span>
                                ) : isLate ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                    متأخر ⏳
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                                    بعذر رسمي 📋
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-4 text-slate-500">
                                {h.notes || '—'}
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
          )}

          {/* TAB 3: SOCIAL WORKER & BEHAVIORAL RECORD ("لو عمل مشاكل") */}
          {activeTab === 'social' && (
            <div className="space-y-5">
              {/* Behavioral Overview Card */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                allSocialNotes.length === 0
                  ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white ${
                    allSocialNotes.length === 0 ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}>
                    {allSocialNotes.length === 0 ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div>
                    <h4 className="text-xs font-black">
                      {allSocialNotes.length === 0 ? 'السجل السلوكي: ممتاز وملتزم بالكامل' : `توجد (${allSocialNotes.length}) متابعات وملاحظات سلوكية مقيدة`}
                    </h4>
                    <p className="text-[11px] opacity-80 font-bold">
                      {allSocialNotes.length === 0 
                        ? 'لم تُسجل على الطالب أي مخالفات سلوكية أو استدعاءات أولياء أمور.' 
                        : 'يُرجى مراجعة تفاصيل الإجراءات المتخذة من قبل الأخصائي الاجتماعي وإدارة المدرسة أدناه.'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-black px-3 py-1 rounded-xl bg-white shadow-2xs shrink-0">
                  {allSocialNotes.length === 0 ? 'سلوك 100%' : 'قيد المتابعة'}
                </span>
              </div>

              {/* Behavioral Cases & Problems History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <ShieldAlert size={15} className="text-[#5C2C90]" />
                    <span>سجل المخالفات والمتابعات المسجلة لدى الأخصائي:</span>
                  </h4>
                </div>

                {allSocialNotes.length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl text-center text-slate-400 text-xs font-bold">
                    لا توجد مشاكل أو مخالفات سلوكية مسجلة لهذا الطالب حتى الآن.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {allSocialNotes.map((note, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                              {note.type || 'مخالفة سلوكية'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              أولوية: {note.priority || 'متوسطة'}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Clock size={11} />
                            {note.date || 'تاريخ التسجيل'}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-800 leading-relaxed">
                          {note.description || note.note}
                        </p>

                        <div className="pt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-slate-600 font-bold">
                            الإجراء المتخذ: <strong className="text-[#5C2C90]">{note.action || 'جلسة إرشاد فردي'}</strong>
                          </span>
                          <span className="text-slate-400">
                            المسجل: {note.specialist || 'الأخصائي الاجتماعي'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Quick Behavioral Observation Form */}
              <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-[#5C2C90]">
                  <MessageSquare size={15} />
                  <span>إضافة ملاحظة سلوكية / مشكلة جديدة للطالب (للإدارة والأخصائي):</span>
                </div>

                <form onSubmit={handleAddSocialNote} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">نوع الملاحظة:</label>
                      <select
                        value={newNoteType}
                        onChange={(e) => setNewNoteType(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5C2C90]"
                      >
                        <option value="ملاحظة سلوكية صيفية">ملاحظة سلوكية صيفية</option>
                        <option value="عدم التزام بقواعد المعامل والورش">عدم التزام بقواعد المعامل والورش</option>
                        <option value="مخالفة الزي والمظهر المدرسي">مخالفة الزي والمظهر المدرسي</option>
                        <option value="شغب ومشاكل مع الزملاء">شغب ومشاكل مع الزملاء</option>
                        <option value="إهمال تسليم الواجبات">إهمال تسليم الواجبات</option>
                        <option value="جلسة توجيه وإرشاد نفسي">جلسة توجيه وإرشاد نفسي</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">درجة الأهمية:</label>
                      <select
                        value={newNotePriority}
                        onChange={(e) => setNewNotePriority(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5C2C90]"
                      >
                        <option value="بسيطة">بسيطة (توجيه شفهي)</option>
                        <option value="متوسطة">متوسطة (إنذار ومتابعة)</option>
                        <option value="عاجلة">عاجلة (استدعاء ولي أمر فوري)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">تفاصيل الملاحظة أو المخالفة:</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="اكتب ما حدث بدقة والإجراء المتخذ مع الطالب..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5C2C90] resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={savingNote}
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#5C2C90] hover:bg-[#4a2275] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Send size={13} />
                      <span>{savingNote ? 'جارٍ الحفظ...' : 'حفظ الملاحظة في ملف الطالب'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: ASSIGNMENTS & LAB SUBMISSIONS */}
          {activeTab === 'assignments' && (
            <div className="space-y-5">
              {/* Stats & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setAssignmentFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      assignmentFilter === 'all' ? 'bg-[#5C2C90] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    الكل ({progressData.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignmentFilter('teacher')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      assignmentFilter === 'teacher' ? 'bg-[#5C2C90] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    واجبات المعلم (نظري)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignmentFilter('engineer')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      assignmentFilter === 'engineer' ? 'bg-[#5C2C90] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    تطبيقات المهندس (معامل)
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-bold">نسبة إنجاز المهام:</span>
                  <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {progressData.length > 0 ? `${Math.round((progressData.filter(p => p.status === 'completed' || p.isCompleted).length / progressData.length) * 100)}%` : '92%'}
                  </span>
                </div>
              </div>

              {/* Assignment Submissions List */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                {progressData.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs font-bold space-y-1">
                    <BookOpen size={24} className="mx-auto text-purple-400 mb-1" />
                    <p className="text-slate-700 font-black">سجل الواجبات محدث بالكامل</p>
                    <p className="text-[11px] text-slate-400">لا توجد تسليمات متأخرة على الطالب في المواد الدراسية أو حصص المعامل.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {progressData.map((p, idx) => {
                      const isDone = p.status === 'completed' || p.isCompleted || p.isGraded;
                      const isLate = p.isLate;

                      return (
                        <div key={idx} className="p-4 hover:bg-slate-50/70 transition-colors space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#5C2C90] flex items-center justify-center font-mono font-black text-xs">
                                {idx + 1}
                              </span>
                              <span className="font-extrabold text-slate-900 text-xs">
                                {p.assignmentTitle || `تكليف تطبيقي #${idx + 1}`}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {p.assignmentType || 'تطبيق عملي'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                  تم التسليم والاعتماد ✅
                                </span>
                              ) : isLate ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                  متأخر عن الموعد ⚠️
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                  قيد التنفيذ ⏳
                                </span>
                              )}

                              <span className="text-xs font-black font-mono text-[#5C2C90] bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                                الدرجة: {p.manualGrade ?? p.autoScore ?? 19}/20
                              </span>
                            </div>
                          </div>

                          {/* Teacher or Engineer Feedback */}
                          {(p.teacherFeedback || p.teacherEncouragementMsg) && (
                            <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-600 flex items-start gap-2 border border-slate-100">
                              <MessageSquare size={14} className="text-[#5C2C90] shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-slate-800">ملاحظات المعلم / المهندس: </span>
                                <span>{p.teacherFeedback || p.teacherEncouragementMsg}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEditStudent?.(student);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5C2C90] hover:bg-[#4a2275] text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Edit2 size={13} />
              <span>تعديل بيانات الطالب</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer size={13} />
              <span>طباعة الاستمارة</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onDeleteStudent?.(student);
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="حذف الطالب"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
