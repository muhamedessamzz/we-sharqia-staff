import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Laptop,
  BookOpen,
  Filter,
  Printer,
  Sparkles,
  Layers,
  Shield,
  Coffee,
  UserCheck,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { api } from '../../../../api/client';
import fallbackSchedule from '../../../../data/school_schedule.json';
import { formatPeriodLabel, formatRoomLabel } from '../../../../components/schedule/MasterScheduleViewer';

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const ALL_CLASSROOMS = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'C1', 'C2'];

export default function TeacherScheduleTab({ user, permissions }) {
  const [viewMode, setViewMode] = useState('teacher'); // 'teacher' | 'class'
  const [selectedClass, setSelectedClass] = useState(
    permissions?.assignedClasses?.[0] || 'A1'
  );
  const [selectedStaffName, setSelectedStaffName] = useState(user?.fullName || '');
  const [matchedStaff, setMatchedStaff] = useState(null);
  const [allStaff, setAllStaff] = useState(fallbackSchedule?.staff || []);
  const [schedules, setSchedules] = useState([]);
  const [duties, setDuties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState('all');

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      if (viewMode === 'teacher') {
        const queryName = selectedStaffName || user?.fullName || 'م/ إبراهيم رجب';
        const res = await api.getTeacherSchedule(queryName, user?.id || '');
        if (res && res.classes) {
          setSchedules(res.classes || []);
          setDuties(res.duties || []);
          setMatchedStaff(res.staff || null);
          if (res.allStaff && res.allStaff.length > 0) {
            setAllStaff(res.allStaff);
          }
        } else if (Array.isArray(res)) {
          setSchedules(res);
        } else {
          // Fallback to local json
          applyLocalFallbackTeacher(queryName);
        }
      } else {
        const data = await api.getClassSchedule(selectedClass);
        if (Array.isArray(data) && data.length > 0) {
          setSchedules(data);
        } else {
          // Fallback to local json
          const localClasses = fallbackSchedule.classes.filter(
            (c) => c.classroom.toUpperCase() === selectedClass.toUpperCase()
          );
          setSchedules(localClasses);
        }
      }
    } catch (err) {
      console.warn('API schedule fetch error, applying fallback:', err);
      if (viewMode === 'teacher') {
        applyLocalFallbackTeacher(selectedStaffName || user?.fullName || 'م/ إبراهيم رجب');
      } else {
        const localClasses = fallbackSchedule.classes.filter(
          (c) => c.classroom.toUpperCase() === selectedClass.toUpperCase()
        );
        setSchedules(localClasses);
      }
    } finally {
      setLoading(false);
    }
  };

  const applyLocalFallbackTeacher = (queryName) => {
    const cleanQ = (queryName || '').replace(/^[مأا]\/\s*/, '').trim().toLowerCase();
    const st = fallbackSchedule.staff.find(
      (s) =>
        s.canonicalName.toLowerCase().includes(cleanQ) ||
        s.cleanName.toLowerCase().includes(cleanQ) ||
        cleanQ.includes(s.cleanName.toLowerCase())
    ) || fallbackSchedule.staff[0];

    setMatchedStaff(st);
    setAllStaff(fallbackSchedule.staff);

    const teacherClasses = fallbackSchedule.classes.filter(
      (c) =>
        c.teacherName === st.canonicalName ||
        c.cleanTeacherName === st.cleanName
    );
    setSchedules(teacherClasses);

    const teacherDuties = fallbackSchedule.duties.filter(
      (d) =>
        d.teacherName === st.canonicalName ||
        d.cleanTeacherName === st.cleanName
    );
    setDuties(teacherDuties);
  };

  useEffect(() => {
    fetchSchedule();
  }, [viewMode, selectedClass, selectedStaffName, user?.fullName]);

  // Group items by day
  const itemsByDay = DAYS_AR.reduce((acc, day) => {
    acc[day] = schedules
      .filter((s) => (s.dayOfWeek === day || s.dayName === day))
      .sort((a, b) => a.periodNumber - b.periodNumber);
    return acc;
  }, {});

  const displayedDays = activeDay === 'all' ? DAYS_AR : [activeDay];

  return (
    <div className="space-y-6">
      {/* Teacher Profile & Workload Card */}
      {viewMode === 'teacher' && matchedStaff && (
        <div className="bg-gradient-to-br from-[#5C2C90] via-[#481E73] to-[#2B0E49] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm">
                  <Sparkles size={13} />
                  {matchedStaff.role || 'عضو هيئة تدريس'}
                </span>
                <span className="text-purple-200 text-xs font-bold bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  العام الدراسي 2026 / 2027
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {matchedStaff.canonicalName}
              </h2>

              <p className="text-xs sm:text-sm text-purple-200 font-bold max-w-xl">
                المواد المسندة:{' '}
                <span className="text-white">
                  {matchedStaff.subjects?.join(' • ') || 'تكنولوجيا المعلومات والاتصالات'}
                </span>
                {matchedStaff.classrooms?.length > 0 && (
                  <>
                    {' | '}الفصول:{' '}
                    <span className="text-white">
                      {matchedStaff.classrooms?.join(', ')}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Quick Metrics & Staff Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center min-w-[100px]">
                <div className="text-2xl font-black text-amber-300 font-mono">
                  {matchedStaff.weeklyClassesCount || schedules.length}
                </div>
                <div className="text-[10px] text-purple-200 font-bold">
                  حصة أسبوعياً
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center min-w-[100px]">
                <div className="text-2xl font-black text-emerald-300 font-mono">
                  {matchedStaff.weeklyDutiesCount || duties.length}
                </div>
                <div className="text-[10px] text-purple-200 font-bold">
                  إشراف واحتياطي
                </div>
              </div>

              {/* Staff Switcher for Pre-Registration Testing */}
              <div className="bg-white/15 backdrop-blur-md p-2 rounded-2xl border border-white/20">
                <label className="block text-[10px] text-purple-200 font-black mb-1">
                  استعراض جدول أي زميل (28 معلم ومهندس):
                </label>
                <select
                  value={selectedStaffName || matchedStaff.canonicalName}
                  onChange={(e) => setSelectedStaffName(e.target.value)}
                  className="bg-slate-900/90 text-white text-xs font-bold rounded-xl px-3 py-1.5 border border-purple-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer max-w-[220px]"
                >
                  <optgroup label="المهندسون والمتخصصون">
                    {allStaff
                      .filter((s) => s.role === 'مهندس')
                      .map((s) => (
                        <option key={s.id} value={s.canonicalName}>
                          {s.canonicalName} ({s.weeklyClassesCount} حصة)
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="المعلمون والأخصائيون">
                    {allStaff
                      .filter((s) => s.role !== 'مهندس')
                      .map((s) => (
                        <option key={s.id} value={s.canonicalName}>
                          {s.canonicalName} ({s.weeklyClassesCount} حصة / {s.weeklyDutiesCount} إشراف)
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Filter and Mode Switcher */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode switch */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'teacher'
                  ? 'bg-[#5C2C90] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar size={14} />
              <span>جدولي الشخصي والتكليفات</span>
            </button>

            <button
              onClick={() => setViewMode('class')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'class'
                  ? 'bg-[#5C2C90] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers size={14} />
              <span>جدول الفصول (A1 - C2)</span>
            </button>
          </div>

          {/* Class selector if in class mode */}
          {viewMode === 'class' && (
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {ALL_CLASSROOMS.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedClass === cls
                      ? 'bg-[#5C2C90] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Day Filter & Print */}
        <div className="flex items-center gap-2">
          {/* Day quick pills */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveDay('all')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                activeDay === 'all'
                  ? 'bg-[#5C2C90] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              الأسبوع كاملًا
            </button>
            {DAYS_AR.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                  activeDay === day
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Printer size={15} />
            <span>طباعة الجدول</span>
          </button>
        </div>
      </div>

      {/* Official Duties & Supervision Cards (If in Teacher Mode) */}
      {viewMode === 'teacher' && duties.length > 0 && (
        <div className="bg-amber-50/60 rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <Shield size={18} className="text-amber-700" />
              <h3 className="text-sm font-black">
                نوبات الإشراف اليومي والاحتياطي المعتمدة ({duties.length} تكليفات)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-white px-2.5 py-1 rounded-full border border-amber-200">
              مطبّق بها قاعدة الأولوية للحصة الدراسية
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {duties.map((duty) => (
              <div
                key={duty.id}
                className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded-lg">
                    {duty.dutyType}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    يوم {duty.dayOfWeek || duty.dayName}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Clock size={12} className="text-amber-600" />
                    {duty.startTime} - {duty.endTime}
                  </span>
                  <span className="font-mono text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                    الحصص: {duty.periodsText}
                  </span>
                </div>

                {duty.notes && (
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-start gap-1">
                    <Info size={12} className="text-slate-400 mt-0.5 shrink-0" />
                    <span>{duty.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timetable Days */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-400 font-bold text-xs">
          جارٍ تحميل الجدول الأسبوعي...
        </div>
      ) : schedules.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-500 font-bold text-sm">
          لا توجد حصص مسجلة حاليًا.
        </div>
      ) : (
        <div className="space-y-5">
          {displayedDays.map((day) => {
            const dayItems = itemsByDay[day] || [];
            return (
              <div
                key={day}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden"
              >
                {/* Day Header */}
                <div className="px-5 py-3.5 bg-gradient-to-r from-purple-50 via-slate-50 to-white border-b border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#5C2C90] text-white flex items-center justify-center font-black text-xs">
                      {day[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        يوم {day}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold">
                        {dayItems.length} حصص دراسية (8 حصص رسمية + فسحتين)
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-[#5C2C90] bg-purple-100/60 px-2.5 py-1 rounded-full border border-purple-200">
                    {dayItems.filter((i) => i.isLab || i.isLabSession).length} حصص معمل وتطبيقي
                  </span>
                </div>

                {/* Grid of Periods */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {dayItems.map((item) => {
                    const isLab = item.isLab || item.isLabSession;
                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isLab
                            ? 'bg-purple-50/40 border-purple-200 hover:shadow-xs'
                            : 'bg-slate-50/70 border-slate-200/80 hover:bg-white'
                        }`}
                      >
                        {/* Top Period badge & Time */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-slate-200 text-slate-700">
                            {formatPeriodLabel(item.periodNumber, item.periodName)}
                          </span>

                          <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 font-mono">
                            <Clock size={11} className="text-[#5C2C90]" />
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>

                        {/* Subject Name */}
                        <h5 className="text-xs font-black text-slate-900 leading-snug mb-1.5 flex items-center justify-between">
                          <span>{item.subjectName || item.subject}</span>
                          <span className="text-[#5C2C90] bg-purple-100 px-2 py-0.5 rounded-lg font-mono text-[10px]">
                            فصل {item.classroom}
                          </span>
                        </h5>

                        {/* Lab / Room & Class */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                          <span className="text-slate-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                            <MapPin size={11} className="text-[#5C2C90]" />
                            {formatRoomLabel(item.roomName || item.roomOrLab)}
                          </span>

                          {isLab && (
                            <span className="text-rose-700 bg-rose-50 border border-rose-200 text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              <Laptop size={10} />
                              معمل تخصصي
                            </span>
                          )}
                        </div>

                        {/* Teacher name if in class view */}
                        {viewMode === 'class' && (
                          <div className="mt-2 pt-1.5 border-t border-slate-200/50 text-[10px] text-slate-500 font-bold flex items-center gap-1">
                            <UserCheck size={11} className="text-[#5C2C90]" />
                            <span>المعلم: {item.teacherName}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
