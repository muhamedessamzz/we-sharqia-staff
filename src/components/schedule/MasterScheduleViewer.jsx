import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Laptop,
  Users,
  Shield,
  Layers,
  Filter,
  Search,
  Printer,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Info,
  Check
} from 'lucide-react';
import { api } from '../../api/client';
import fallbackSchedule from '../../data/school_schedule.json';

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const ALL_CLASSROOMS = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'C1', 'C2'];
const PERIOD_TIMES = [
  { period: 1, name: 'الأولى', time: '08:00 - 08:50' },
  { period: 2, name: 'الثانية', time: '08:50 - 09:40' },
  { period: 3, name: 'الثالثة', time: '09:40 - 10:30' },
  { period: 'b1', name: 'الفسحة 1', time: '10:30 - 11:00', isBreak: true },
  { period: 4, name: 'الرابعة', time: '11:00 - 11:50' },
  { period: 5, name: 'الخامسة', time: '11:50 - 12:40' },
  { period: 6, name: 'السادسة', time: '12:40 - 01:30' },
  { period: 'b2', name: 'الفسحة 2', time: '01:30 - 01:50', isBreak: true },
  { period: 7, name: 'السابعة', time: '01:50 - 02:40' },
  { period: 8, name: 'الثامنة', time: '02:40 - 03:30' },
];

const PERIOD_ORDINALS = {
  1: 'الأولى',
  2: 'الثانية',
  3: 'الثالثة',
  4: 'الرابعة',
  5: 'الخامسة',
  6: 'السادسة',
  7: 'السابعة',
  8: 'الثامنة',
  '1': 'الأولى',
  '2': 'الثانية',
  '3': 'الثالثة',
  '4': 'الرابعة',
  '5': 'الخامسة',
  '6': 'السادسة',
  '7': 'السابعة',
  '8': 'الثامنة'
};

export const formatPeriodLabel = (periodNumber, periodName) => {
  if (periodName && isNaN(periodName) && periodName !== 'درس' && periodName !== 'أساسي') {
    return periodName.startsWith('الحصة') ? periodName : `الحصة ${periodName}`;
  }
  const ordinal = PERIOD_ORDINALS[periodNumber];
  return ordinal ? `الحصة ${ordinal}` : `الحصة ${periodNumber}`;
};

export const formatRoomLabel = (room) => {
  if (!room) return '';
  return room
    .replace(/قاعة\s+([A-Za-z]\d+)\s+الذكية/gi, 'فصل $1')
    .replace(/قاعة\s+([A-Za-z]\d+)/gi, 'فصل $1')
    .replace(/قاعة\s+فصل\s+/gi, 'فصل ');
};

export default function MasterScheduleViewer() {
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'supervision' | 'workload'
  const [scheduleData, setScheduleData] = useState(fallbackSchedule);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedClassroom, setSelectedClassroom] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Link Modal State
  const [linkingStaff, setLinkingStaff] = useState(null);
  const [linkEmail, setLinkEmail] = useState('');
  const [linkUserId, setLinkUserId] = useState('');
  const [linkFeedback, setLinkFeedback] = useState(null);

  const fetchMasterSchedule = async () => {
    setLoading(true);
    try {
      const res = await api.getMasterSchedule();
      if (res && res.classes && res.classes.length > 0) {
        setScheduleData(res);
      }
    } catch (err) {
      console.warn('Using local fallback master schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterSchedule();
  }, []);

  // Filtered Classes
  const filteredClasses = useMemo(() => {
    if (!scheduleData?.classes) return [];
    return scheduleData.classes.filter((item) => {
      if (selectedDay !== 'all' && item.dayName !== selectedDay && item.dayOfWeek !== selectedDay) return false;
      if (selectedClassroom !== 'all' && item.classroom.toUpperCase() !== selectedClassroom.toUpperCase()) return false;
      if (selectedTeacher !== 'all') {
        const t = item.teacherName || '';
        const c = item.cleanTeacherName || '';
        const matchTeacher = t === selectedTeacher || c === selectedTeacher || t.includes(selectedTeacher) || c.includes(selectedTeacher) || selectedTeacher.includes(c);
        if (!matchTeacher) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchSubject = item.subjectName?.toLowerCase().includes(q);
        const matchTeacher = item.teacherName?.toLowerCase().includes(q);
        const matchClass = item.classroom?.toLowerCase().includes(q);
        const matchRoom = (item.roomName || item.roomOrLab)?.toLowerCase().includes(q);
        if (!matchSubject && !matchTeacher && !matchClass && !matchRoom) return false;
      }
      return true;
    });
  }, [scheduleData, selectedDay, selectedClassroom, selectedTeacher, searchQuery]);

  // Filtered Duties
  const filteredDuties = useMemo(() => {
    if (!scheduleData?.duties) return [];
    return scheduleData.duties.filter((item) => {
      if (selectedDay !== 'all' && item.dayName !== selectedDay && item.dayOfWeek !== selectedDay) return false;
      if (selectedTeacher !== 'all' && item.teacherName !== selectedTeacher && item.cleanTeacherName !== selectedTeacher) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchDuty = item.dutyType?.toLowerCase().includes(q);
        const matchTeacher = item.teacherName?.toLowerCase().includes(q);
        if (!matchDuty && !matchTeacher) return false;
      }
      return true;
    });
  }, [scheduleData, selectedDay, selectedTeacher, searchQuery]);

  // Handle Account Link Submission
  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!linkingStaff) return;
    try {
      const res = await api.linkStaffAccount({
        staffId: linkingStaff.id,
        staffName: linkingStaff.canonicalName,
        userEmail: linkEmail,
        userId: linkUserId || `user-${Date.now()}`
      });
      setLinkFeedback({ type: 'success', text: `تم ربط ${linkingStaff.canonicalName} بنجاح!` });

      // Update in local state
      setScheduleData((prev) => ({
        ...prev,
        staff: prev.staff.map((s) =>
          s.id === linkingStaff.id ? { ...s, userAccountId: linkUserId || 'linked', matchedUserEmail: linkEmail } : s
        )
      }));

      setTimeout(() => {
        setLinkingStaff(null);
        setLinkFeedback(null);
        setLinkEmail('');
        setLinkUserId('');
      }, 1500);
    } catch (err) {
      setLinkFeedback({ type: 'error', text: 'فشل في حفظ الربط: ' + (err.message || 'خطأ غير متوقع') });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Master Schedule Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#39175D] to-[#5C2C90] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#E4007C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#5C2C90]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm">
              <Sparkles size={13} />
              الجدول المدرسي العام وكارتات الإشراف المعتمدة
            </span>
            <span className="text-purple-200 text-xs font-bold bg-white/10 px-3 py-1 rounded-full border border-white/10">
              العام الدراسي 2026 / 2027
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-snug">
            التفريغ الشامل للجدول الدراسي الأسبوعي ({scheduleData?.classes?.length || 366} حصة • {scheduleData?.staff?.length || 27} كادر • 9 فصول)
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-bold max-w-4xl">
            نظام التعرف التلقائي على المعلمين والمهندسين والربط المباشر بالحسابات فور إنشائها، مع كارتات الإشراف وحل التعارضات بتطبيق قاعدة الأولوية للحصة الدراسية.
          </p>
        </div>
      </div>

      {/* Metrics Row: 4 Cards Underneath */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>إجمالي الحصص</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {scheduleData?.classes?.length || 366}
          </div>
          <div className="text-[11px] text-amber-600 mt-1 font-bold">حصة أسبوعياً موزعة على 5 أيام</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>الكادر الأكاديمي</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {scheduleData?.staff?.length || 27}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-bold">كادر تدريس وإشراف معتمد</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>الفصول الدراسية</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Layers size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">9</div>
          <div className="text-[11px] text-sky-600 mt-1 font-bold">فصول المراحل A و B و C</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>التكليفات والإشراف</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Shield size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">101</div>
          <div className="text-[11px] text-rose-600 mt-1 font-bold">تكليف إشراف واحتياطي أسبوعي</div>
        </div>
      </div>

      {/* Tabs & Filters Navigation */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          {/* Main View Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('grid')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'grid'
                  ? 'bg-[#5C2C90] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar size={15} />
              <span>جدول الحصص الشامل ({filteredClasses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('supervision')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'supervision'
                  ? 'bg-[#5C2C90] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield size={15} />
              <span>كارتات الإشراف والاحتياطي ({filteredDuties.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('workload')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'workload'
                  ? 'bg-[#5C2C90] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={15} />
              <span>أنصبة العاملين والربط بالحسابات ({scheduleData?.staff?.length || 27})</span>
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer self-start md:self-auto"
          >
            <Printer size={15} />
            <span>طباعة الكشوف المعتمدة</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Day Filter */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 mb-1">
              اليوم:
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90] cursor-pointer"
            >
              <option value="all">جميع أيام الأسبوع (الأحد - الخميس)</option>
              {DAYS_AR.map((day) => (
                <option key={day} value={day}>
                  يوم {day}
                </option>
              ))}
            </select>
          </div>

          {/* Classroom Filter */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 mb-1">
              الفصل الدراسي:
            </label>
            <select
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90] cursor-pointer"
            >
              <option value="all">جميع الفصول (A1 - C2)</option>
              {ALL_CLASSROOMS.map((cls) => (
                <option key={cls} value={cls}>
                  فصل {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Staff Filter */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 mb-1">
              المعلم / المهندس / المشرف:
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90] cursor-pointer"
            >
              <option value="all">جميع الكادر ({scheduleData?.staff?.length || 27} عضو)</option>
              {scheduleData?.staff?.map((s) => (
                <option key={s.id} value={s.canonicalName}>
                  {s.canonicalName} ({s.role})
                </option>
              ))}
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 mb-1">
              بحث سريع بالمادة أو المكان:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن مادة، معمل، كابستون..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-8 pl-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              />
              <Search size={14} className="absolute right-2.5 top-2.5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab 1: Comprehensive Classes Schedule */}
      {activeTab === 'grid' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Calendar size={16} className="text-[#5C2C90]" />
                <span>كشف الحصص الدراسية المعتمد</span>
                <span className="text-[11px] text-[#5C2C90] bg-white px-2 py-0.5 rounded-full border border-purple-200 font-mono">
                  {filteredClasses.length} حصة
                </span>
              </h3>
              <span className="text-xs text-slate-500 font-bold">
                8 حصص يومياً (تبدأ 8:00 صباحاً وتنتهي 3:30 عصراً مع فسحتين)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 font-black border-b border-slate-200">
                    <th className="py-3 px-4">اليوم</th>
                    <th className="py-3 px-4">الحصة والتوقيت</th>
                    <th className="py-3 px-4">الفصل</th>
                    <th className="py-3 px-4">المادة الدراسية</th>
                    <th className="py-3 px-4">المعلم / المهندس المسند</th>
                    <th className="py-3 px-4">المعمل / القاعة</th>
                    <th className="py-3 px-4">النوع / الملاحظة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClasses.slice(0, 100).map((cls) => {
                    const isLab = cls.isLab || cls.isLabSession;
                    return (
                      <tr key={cls.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-3 px-4 font-black text-slate-900">
                          {cls.dayOfWeek || cls.dayName}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#5C2C90] bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100 text-xs">
                            {formatPeriodLabel(cls.periodNumber, cls.periodName)}
                          </span>
                          <span className="text-slate-400 text-[10px] mr-2 font-mono">
                            ({cls.startTime} - {cls.endTime})
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-slate-900">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">
                            فصل {cls.classroom}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-slate-900">
                          {cls.subjectName || cls.subject}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {cls.teacherName}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-600 flex items-center gap-1">
                          <MapPin size={11} className="text-[#5C2C90]" />
                          <span>{formatRoomLabel(cls.roomName || cls.roomOrLab)}</span>
                        </td>
                        <td className="py-3 px-4">
                          {isLab ? (
                            <span className="text-rose-700 bg-rose-50 border border-rose-200 text-[10px] font-black px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <Laptop size={10} />
                              معمل تطبيقي
                            </span>
                          ) : (
                            <span className="text-slate-600 bg-slate-100 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {cls.note || 'نظري أساسي'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredClasses.length > 100 && (
                <div className="p-3 text-center text-xs text-slate-500 font-bold bg-slate-50 border-t border-slate-100">
                  تم عرض أول 100 حصة من إجمالي {filteredClasses.length} حصة. يمكنك استخدام فلاتر اليوم والفصل بالأعلى لتخصيص العرض.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Daily Supervision & Reserve Cards */}
      {activeTab === 'supervision' && (
        <div className="space-y-4">
          <div className="bg-amber-50/60 rounded-3xl p-5 border border-amber-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
                <Shield size={18} className="text-amber-700" />
                <span>كارتات الإشراف اليومي وجدول الاحتياطي (101 تكليف)</span>
              </h3>
              <span className="text-xs font-bold text-amber-900 bg-white px-3 py-1 rounded-full border border-amber-200">
                مطبّق بها قاعدة الأولوية للحصة الدراسية
              </span>
            </div>
            <p className="text-xs text-amber-800 font-bold">
              توزيع نوبات الإشراف على الأدوار (الثالث، الرابع، الخامس)، فناء المدرسة (الحوش)، وأوقات الفسحتين، بالإضافة لمسؤولي الاحتياطي لكل يوم حسب الفراغات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredDuties.map((duty) => (
              <div
                key={duty.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2 hover:border-amber-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-100/80 text-amber-950">
                    {duty.dutyType}
                  </span>
                  <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    يوم {duty.dayOfWeek || duty.dayName}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-black text-slate-900">
                    {duty.teacherName}
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                    الحصص: {duty.periodsText}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-mono font-bold flex items-center gap-1">
                  <Clock size={12} className="text-amber-600" />
                  <span>{duty.startTime} - {duty.endTime}</span>
                </div>

                {duty.notes && (
                  <div className={`text-[11px] p-2 rounded-xl flex items-start gap-1.5 ${
                    duty.isConflictResolved
                      ? 'bg-rose-50 text-rose-800 border border-rose-200 font-bold'
                      : 'bg-slate-50 text-slate-600 border border-slate-100 font-bold'
                  }`}>
                    <Info size={13} className="shrink-0 mt-0.5" />
                    <span>{duty.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Staff Workloads & Account Linker */}
      {activeTab === 'workload' && (
        <div className="space-y-4">
          <div className="bg-purple-50/70 rounded-3xl p-5 border border-purple-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-purple-950 flex items-center gap-2">
                <Users size={18} className="text-[#5C2C90]" />
                <span>نصاب أعضاء هيئة التدريس والإشراف ({scheduleData?.staff?.length || 27} عضو كادر)</span>
              </h3>
              <p className="text-xs text-purple-800 font-bold">
                كشف إحصائي كامل بنصاب كل معلم ومهندس وأخصائي في الحصص ونوبات الإشراف، مع حالة الربط بحسابات المنصة.
              </p>
            </div>
            <div className="text-xs bg-white px-3 py-1.5 rounded-xl border border-purple-200 font-bold text-slate-700 shadow-2xs">
              💡 ملحوظة: يتعرف النظام تلقائياً على اسم المعلم عند إنشاء حسابه فوراً.
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 font-black border-b border-slate-200">
                    <th className="py-3.5 px-4">#</th>
                    <th className="py-3.5 px-4">الاسم في الجدول المدرسي</th>
                    <th className="py-3.5 px-4">الصفة / التخصص</th>
                    <th className="py-3.5 px-4">نصاب الحصص الأسبوعي</th>
                    <th className="py-3.5 px-4">تكليفات الإشراف والاحتياطي</th>
                    <th className="py-3.5 px-4">المواد المسندة</th>
                    <th className="py-3.5 px-4">حالة الربط بالحساب</th>
                    <th className="py-3.5 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scheduleData?.staff?.map((s, idx) => {
                    const isLinked = !!s.userAccountId || !!s.matchedUserEmail;
                    return (
                      <tr key={s.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                          {s.canonicalName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            s.role === 'مهندس'
                              ? 'bg-sky-50 text-sky-800 border border-sky-200'
                              : 'bg-purple-50 text-purple-800 border border-purple-200'
                          }`}>
                            {s.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-black text-sm text-[#5C2C90]">
                          {s.weeklyClassesCount} حصة
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          {s.weeklyDutiesCount} نوبات
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-600">
                          {s.subjects?.join(' • ') || '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          {isLinked ? (
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <CheckCircle2 size={11} />
                              مرتبط بالحساب ({s.matchedUserEmail || 'نشط'})
                            </span>
                          ) : (
                            <span className="text-amber-800 bg-amber-50 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <Sparkles size={10} className="text-amber-600" />
                              جاهز للربط التلقائي فور التسجيل
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => {
                              setLinkingStaff(s);
                              setLinkEmail(s.matchedUserEmail || '');
                              setLinkUserId(s.userAccountId || '');
                              setLinkFeedback(null);
                            }}
                            className="text-xs font-bold text-[#5C2C90] hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <LinkIcon size={12} />
                            <span>{isLinked ? 'تعديل الربط' : 'ربط يدوي'}</span>
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

      {/* Manual Link Modal */}
      {linkingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <LinkIcon size={16} className="text-[#5C2C90]" />
                <span>ربط جدول {linkingStaff.canonicalName}</span>
              </h4>
              <button
                onClick={() => setLinkingStaff(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100 text-xs font-bold text-purple-900 space-y-1">
              <div>المعلم / المهندس: <span className="font-black text-slate-900">{linkingStaff.canonicalName}</span></div>
              <div>النصاب: <span className="font-mono text-[#5C2C90]">{linkingStaff.weeklyClassesCount} حصة</span> • الإشراف: <span className="font-mono text-amber-800">{linkingStaff.weeklyDutiesCount} نوبات</span></div>
            </div>

            <form onSubmit={handleLinkSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  البريد الإلكتروني لحساب المستخدم (User Email):
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ibrahim.ragab@wesharkia.edu"
                  value={linkEmail}
                  onChange={(e) => setLinkEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  معرّف الحساب في النظام (User ID اختياري):
                </label>
                <input
                  type="text"
                  placeholder="اتركه فارغاً ليتم إنشاؤه تلقائياً أو أدخل Guid"
                  value={linkUserId}
                  onChange={(e) => setLinkUserId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                />
              </div>

              {linkFeedback && (
                <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                  linkFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {linkFeedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  <span>{linkFeedback.text}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLinkingStaff(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black text-white bg-[#5C2C90] hover:bg-purple-800 shadow-md cursor-pointer transition-all"
                >
                  حفظ وتأكيد الربط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
