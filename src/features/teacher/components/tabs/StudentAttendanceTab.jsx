import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  FileQuestion,
  Save,
  Printer,
  Sparkles,
  Users,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  History
} from 'lucide-react';
import { api } from '../../../../api/client';

export default function StudentAttendanceTab({
  allStudents = [],
  permissions,
  user,
  showToast
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const isToday = selectedDate === todayStr;
  const isPast = selectedDate < todayStr;

  const getArabicDateLabel = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr === todayStr) return 'اليوم';

    const yd = new Date();
    yd.setDate(yd.getDate() - 1);
    const ydStr = yd.toISOString().split('T')[0];
    if (dateStr === ydStr) return 'أمس';

    try {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return new Intl.DateTimeFormat('ar-EG', { weekday: 'short', day: 'numeric', month: 'short' }).format(d);
    } catch {
      return dateStr;
    }
  };

  const handlePrevDay = () => {
    const parts = selectedDate.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    d.setDate(d.getDate() - 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  };

  const handleNextDay = () => {
    const parts = selectedDate.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  };

  const standardClasses = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'C1', 'C2'];
  const allClassesFromData = Array.from(
    new Set(allStudents.map((s) => (s.classroom || '').toUpperCase()).filter(Boolean))
  );
  const availableClasses =
    permissions?.isRestricted && permissions?.assignedClasses?.length > 0
      ? permissions.assignedClasses
      : Array.from(new Set([...standardClasses, ...allClassesFromData]));

  const [selectedClass, setSelectedClass] = useState(availableClasses[0] || 'A1');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [attendanceState, setAttendanceState] = useState({}); // { studentId: { status: 'present'|'absent'|'late'|'excused', notes: '' } }

  // Load existing records when class or date changes
  useEffect(() => {
    let isMounted = true;
    async function loadExisting() {
      setLoading(true);
      try {
        const records = await api.getClassAttendance(selectedClass, selectedDate);
        if (isMounted) {
          const map = {};
          if (Array.isArray(records) && records.length > 0) {
            records.forEach((r) => {
              map[r.studentId] = {
                status: r.status,
                notes: r.notes || '',
              };
            });
          } else {
            // Default: All students present unless marked
            const classStudents = allStudents.filter(
              (s) => (s.classroom || '').toUpperCase() === selectedClass.toUpperCase()
            );
            classStudents.forEach((s) => {
              map[s.id] = { status: 'present', notes: '' };
            });
          }
          setAttendanceState(map);
        }
      } catch (err) {
        console.warn('Failed to load class attendance:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadExisting();
    return () => {
      isMounted = false;
    };
  }, [selectedClass, selectedDate, allStudents]);

  // Students belonging to selected class
  const classStudents = allStudents.filter(
    (s) => (s.classroom || '').toUpperCase() === selectedClass.toUpperCase()
  );

  const filteredStudents = classStudents.filter((s) => {
    if (!searchQuery) return true;
    return (
      s.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const setStudentStatus = (studentId, status) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        status,
      },
    }));
  };

  const setStudentNotes = (studentId, notes) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        notes,
      },
    }));
  };

  const handleMarkAll = (status) => {
    const updated = { ...attendanceState };
    classStudents.forEach((s) => {
      updated[s.id] = {
        ...(updated[s.id] || {}),
        status,
      };
    });
    setAttendanceState(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = classStudents.map((s) => {
        const state = attendanceState[s.id] || { status: 'present', notes: '' };
        return {
          studentId: s.id,
          studentName: s.fullName,
          status: state.status,
          notes: state.notes || '',
        };
      });

      await api.recordStudentAttendance({
        classroom: selectedClass,
        date: selectedDate,
        recordedByStaffName: user?.fullName || 'المعلم',
        records,
      });

      if (showToast) {
        showToast(`تم حفظ كشف حضور فصل ${selectedClass} بنجاح`);
      } else {
        alert('تم حفظ الحضور بنجاح');
      }
    } catch (err) {
      console.error(err);
      if (showToast) {
        showToast(err.message || 'فشل حفظ الحضور', 'error');
      } else {
        alert(err.message || 'فشل الحفظ');
      }
    } finally {
      setSaving(false);
    }
  };

  // Calculations for summary pills
  const totalCount = classStudents.length;
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;

  classStudents.forEach((s) => {
    const st = attendanceState[s.id]?.status || 'present';
    if (st === 'present') presentCount++;
    else if (st === 'absent') absentCount++;
    else if (st === 'late') lateCount++;
    else if (st === 'excused') excusedCount++;
  });

  const attendanceRate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Toolbar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        {/* Row 1: Classroom and Date Selection */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Class Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 min-w-max">
              <Users size={16} className="text-[#5C2C90]" />
              <span>الفصل الدراسي:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
              {availableClasses.map((cls) => {
                const isActive = selectedClass === cls;
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setSelectedClass(cls)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    فصل {cls}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker & Stepper */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 min-w-max">
              <Calendar size={16} className="text-[#5C2C90]" />
              <span>التاريخ:</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/90 rounded-2xl p-1 shadow-2xs">
              {/* Prev Day button (سابق / أمس) */}
              <button
                type="button"
                onClick={handlePrevDay}
                className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="الرجوع ليوم سابق"
              >
                <ChevronRight size={14} />
                <span>سابق</span>
              </button>

              <input
                type="date"
                value={selectedDate}
                max={todayStr}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-black text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5C2C90] cursor-pointer"
              />

              {/* Next Day button */}
              <button
                type="button"
                onClick={handleNextDay}
                disabled={isToday}
                className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
                title="اليوم التالي"
              >
                <span>تالي</span>
                <ChevronLeft size={14} />
              </button>

              {/* Return to today button */}
              {!isToday && (
                <button
                  type="button"
                  onClick={() => setSelectedDate(todayStr)}
                  className="text-[10px] font-black text-[#5C2C90] bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  title="العودة لتاريخ اليوم الحالي"
                >
                  <RotateCcw size={11} />
                  <span>اليوم</span>
                </button>
              )}
            </div>

            {/* Past date badge indicator */}
            {isPast && (
              <span className="text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                <History size={12} className="text-amber-600" />
                <span>أرشيف سابق ({getArabicDateLabel(selectedDate)})</span>
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Status & Quick Bulk Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
          {/* Live Context Chip */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>
              رصد كشف حضور <strong className="text-slate-900 font-black">فصل {selectedClass}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg text-[11px] font-black">
              {classStudents.length} طالب مقيد
            </span>
            {attendanceRate > 0 && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-lg text-[11px] font-black">
                  نسبة الحضور {attendanceRate}%
                </span>
              </>
            )}
          </div>

          {/* Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => handleMarkAll('present')}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98]"
              title="تحديد كافة طلاب هذا الفصل حاضرين"
            >
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>تحديد الكل حاضر</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
              title="طباعة كشف الحضور"
            >
              <Printer size={15} className="text-slate-500" />
              <span>طباعة الكشف</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading || classStudents.length === 0}
              className="flex items-center gap-2 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 px-5 py-2 rounded-xl shadow-md shadow-purple-950/15 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              <Save size={16} />
              <span>{saving ? 'جارٍ الحفظ...' : 'حفظ الحضور'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">إجمالي طلاب الفصل</span>
            <Users size={16} className="text-[#5C2C90]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalCount} طالب</div>
        </div>

        <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-bold">الحاضرون</span>
            <CheckCircle2 size={16} />
          </div>
          <div className="text-2xl font-black text-emerald-800">{presentCount}</div>
        </div>

        <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-bold">الغائبون</span>
            <XCircle size={16} />
          </div>
          <div className="text-2xl font-black text-rose-800">{absentCount}</div>
        </div>

        <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-bold">المتأخرون</span>
            <Clock size={16} />
          </div>
          <div className="text-2xl font-black text-amber-800">{lateCount}</div>
        </div>

        <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-200/80 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#5C2C90] mb-1">
            <span className="text-xs font-bold">نسبة الحضور</span>
            <Sparkles size={16} />
          </div>
          <div className="text-2xl font-black text-[#5C2C90]">{attendanceRate}%</div>
        </div>
      </div>

      {/* Student List & Attendance Toggles */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Header, Date Stepper & Save Actions */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold shrink-0">
                <CalendarCheck size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900">
                    كشف الحضور — فصل {selectedClass}
                  </h3>
                  {isPast ? (
                    <span className="text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <History size={11} />
                      <span>تاريخ سابق: {getArabicDateLabel(selectedDate)}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg">
                      اليوم الحالي
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                  تاريخ: <span className="font-mono text-slate-700 font-bold">{selectedDate}</span> · المعلم: {user?.fullName}
                </p>
              </div>
            </div>

            {/* Quick Date Stepper inside the Table Header itself */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 mr-0 sm:mr-2">
              <button
                type="button"
                onClick={handlePrevDay}
                className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="الرجوع ليوم سابق"
              >
                <ChevronRight size={13} />
                <span className="text-[11px]">يوم سابق</span>
              </button>

              {!isToday && (
                <button
                  type="button"
                  onClick={() => setSelectedDate(todayStr)}
                  className="px-2 py-1 text-[11px] font-black text-[#5C2C90] bg-white rounded-lg shadow-2xs hover:bg-purple-50 transition-all cursor-pointer flex items-center gap-1"
                  title="العودة لتاريخ اليوم"
                >
                  <RotateCcw size={11} />
                  <span>العودة لليوم</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNextDay}
                disabled={isToday}
                className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
                title="اليوم التالي"
              >
                <span className="text-[11px]">اليوم التالي</span>
                <ChevronLeft size={13} />
              </button>
            </div>
          </div>

          {/* Search + Primary Save Button right in table header! */}
          <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto justify-end">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="ابحث باسم الطالب أو الكود..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/30"
              />
              <Search size={14} className="absolute right-3 top-3 text-slate-400" />
            </div>

            {/* Prominent Save Button directly in Table Header! */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading || classStudents.length === 0}
              className="flex items-center gap-2 text-xs font-black text-white bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 px-5 py-2 rounded-xl shadow-md shadow-purple-950/15 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98] shrink-0"
              title="حفظ التغييرات في كشف الحضور"
            >
              <Save size={15} />
              <span>{saving ? 'جارٍ الحفظ...' : 'حفظ كشف الحضور'}</span>
            </button>
          </div>
        </div>

        {/* Banner if viewing past date */}
        {isPast && (
          <div className="bg-amber-50/80 border-b border-amber-200/70 px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900 font-bold">
            <div className="flex items-center gap-2">
              <History size={16} className="text-amber-600 shrink-0" />
              <span>
                أنت تستعرض سجل حضور يوم سابق (<strong className="font-mono">{selectedDate}</strong> - {getArabicDateLabel(selectedDate)}). يمكنك تعديل حضور أي طالب ثم الضغط على "حفظ كشف الحضور".
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDate(todayStr)}
              className="text-[#5C2C90] bg-white border border-amber-200 hover:bg-amber-100/60 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer shrink-0 self-start sm:self-auto"
            >
              الانتقال لليوم الحالي ◀
            </button>
          </div>
        )}

        {/* Attendance Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-bold text-xs">
            جارٍ تحميل كشف الحضور...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-bold text-xs">
            لا يوجد طلاب في فصل {selectedClass}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">اسم الطالب</th>
                  <th className="py-3 px-4">كود الطالب</th>
                  <th className="py-3 px-4 text-center">حالة الحضور</th>
                  <th className="py-3 px-4">ملاحظات / العذر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStudents.map((s, idx) => {
                  const state = attendanceState[s.id] || { status: 'present', notes: '' };
                  const currentStatus = state.status || 'present';

                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        currentStatus === 'absent'
                          ? 'bg-rose-50/30'
                          : currentStatus === 'late'
                          ? 'bg-amber-50/20'
                          : currentStatus === 'excused'
                          ? 'bg-sky-50/20'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-slate-400 font-bold font-mono">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-[#5C2C90] flex items-center justify-center font-black text-xs shrink-0">
                            {s.fullName?.[0] || 'ط'}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900">
                              {s.fullName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {s.email || `@${s.username}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-600">
                        {s.studentCode || s.username}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Present */}
                          <button
                            type="button"
                            onClick={() => setStudentStatus(s.id, 'present')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            <CheckCircle2 size={13} />
                            <span>حاضر</span>
                          </button>

                          {/* Absent */}
                          <button
                            type="button"
                            onClick={() => setStudentStatus(s.id, 'absent')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            <XCircle size={13} />
                            <span>غائب</span>
                          </button>

                          {/* Late */}
                          <button
                            type="button"
                            onClick={() => setStudentStatus(s.id, 'late')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                              currentStatus === 'late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                            }`}
                          >
                            <Clock size={13} />
                            <span>متأخر</span>
                          </button>

                          {/* Excused */}
                          <button
                            type="button"
                            onClick={() => setStudentStatus(s.id, 'excused')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                              currentStatus === 'excused'
                                ? 'bg-sky-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                            }`}
                          >
                            <FileQuestion size={13} />
                            <span>بعذر</span>
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="ملاحظات أو سبب الغياب..."
                          value={state.notes || ''}
                          onChange={(e) => setStudentNotes(s.id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5C2C90]"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info & bottom Save Button */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-bold">
            💡 يتم حفظ بيانات الحضور وتحديثها مباشرة لدى شؤون الطلاب وأولياء الأمور.
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading || classStudents.length === 0}
            className="flex items-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 px-6 py-2 rounded-xl shadow-md shadow-purple-950/15 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'جارٍ الحفظ...' : 'حفظ الحضور'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
