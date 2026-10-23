import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Users, Calendar, Printer, Download, Plus, 
  GraduationCap, Clock, CheckCircle2, Search, Eye, EyeOff,
  Copy, Check, Phone, UserCheck, BookOpen, AlertCircle
} from 'lucide-react';
import { api } from '../../../api/client';
import StudentTable from './StudentTable';
import { formatPeriodLabel, formatRoomLabel } from '../../../components/schedule/MasterScheduleViewer';

const CLASSROOM_TRACKS = {
  A1: { track: 'تطوير البرمجيات وتطبيقات الويب', grade: 1, gradeName: 'الصف الأول الثانوي (المرحلة A)' },
  A2: { track: 'تكنولوجيا الشبكات وإدارة الأنظمة', grade: 1, gradeName: 'الصف الأول الثانوي (المرحلة A)' },
  A3: { track: 'تكنولوجيا الاتصالات والبنية التحتية', grade: 1, gradeName: 'الصف الأول الثانوي (المرحلة A)' },
  A4: { track: 'الذكاء الاصطناعي وتحليل البيانات', grade: 1, gradeName: 'الصف الأول الثانوي (المرحلة A)' },
  B1: { track: 'مسار الشبكات والبرمجيات المتقدمة', grade: 2, gradeName: 'الصف الثاني الثانوي (المرحلة B)' },
  B2: { track: 'مسار الاتصالات والأنظمة المدمجة', grade: 2, gradeName: 'الصف الثاني الثانوي (المرحلة B)' },
  B3: { track: 'مسار التطبيقات الرقمية والسحابية', grade: 2, gradeName: 'الصف الثاني الثانوي (المرحلة B)' },
  C1: { track: 'مشاريع التخرج والتدريب العملي الميداني', grade: 3, gradeName: 'الصف الثالث الثانوي (المرحلة C)' },
  C2: { track: 'التخصصات المتقدمة والتطبيقات المهنية', grade: 3, gradeName: 'الصف الثالث الثانوي (المرحلة C)' },
};

export default function ClassroomDetailPage({
  classroomName,
  students,
  loading,
  onBack,
  onOpenAddStudent,
  onOpenEditStudent,
  onOpenDeleteStudent,
  onViewStudentProfile,
}) {
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'schedule'
  const [schedule, setSchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const classInfo = CLASSROOM_TRACKS[classroomName?.toUpperCase()] || {
    track: 'المسار التكنولوجي العام',
    gradeName: 'المرحلة الدراسية',
  };

  // Filter students belonging strictly to this classroom
  const classStudents = students.filter(
    (s) => s.classroom?.toUpperCase() === classroomName?.toUpperCase()
  );

  const filteredClassStudents = classStudents.filter((s) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      s.fullName?.toLowerCase().includes(q) ||
      s.studentCode?.toLowerCase().includes(q) ||
      s.username?.toLowerCase().includes(q) ||
      s.phoneNumber?.includes(q)
    );
  });

  useEffect(() => {
    if (activeTab === 'schedule' && classroomName) {
      const loadSchedule = async () => {
        setLoadingSchedule(true);
        try {
          const res = await api.getClassSchedule(classroomName);
          setSchedule(res || []);
        } catch (err) {
          console.warn('Failed loading class schedule:', err);
        } finally {
          setLoadingSchedule(false);
        }
      };
      loadSchedule();
    }
  }, [activeTab, classroomName]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    if (!classStudents.length) return;
    const headers = ['#', 'كود الطالب', 'الاسم بالكامل', 'الرقم القومي', 'هاتف الطالب', 'هاتف ولي الأمر', 'الفصل', 'الحالة'];
    const rows = classStudents.map((s, idx) => [
      idx + 1,
      s.studentCode || s.username,
      `"${s.fullName}"`,
      s.nationalId || s.nationalIdMasked,
      s.phoneNumber || '',
      s.parentPhone || '',
      s.classroom,
      s.status === 'approved' ? 'نشط' : 'معلّق'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `كشف_طلاب_فصل_${classroomName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      {/* 1. Breadcrumbs & Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-purple-50 hover:bg-[#5C2C90] text-[#5C2C90] hover:text-white px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border border-purple-200 shadow-2xs"
          >
            <ArrowRight size={15} />
            <span>العودة لجميع الفصول</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>/</span>
            <span className="text-slate-600">{classInfo.gradeName}</span>
            <span>/</span>
            <span className="text-[#5C2C90] font-black">فصل {classroomName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAddStudent(classroomName)}
            className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white px-4 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>+ إضافة طالب لهذا الفصل</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
            title="تصدير كشف الفصل CSV"
          >
            <Download size={14} />
          </button>

          <button
            onClick={handlePrint}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
            title="طباعة كشف طلاب الفصل"
          >
            <Printer size={14} />
          </button>
        </div>
      </div>

      {/* 2. Classroom Header Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5C2C90] via-[#481f73] to-[#26163A] text-white p-6 sm:p-7 shadow-lg shadow-purple-950/15 border border-purple-800/40">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xl sm:text-2xl font-black bg-white/20 px-4 py-1 rounded-2xl border border-white/25">
                فصل {classroomName}
              </span>
              <span className="text-xs font-black bg-[#E4007C] text-white px-3 py-1 rounded-full shadow-xs">
                {classStudents.length} طالب مسجل
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              {classInfo.track}
            </h2>

            <p className="text-xs sm:text-sm text-purple-200">
              {classInfo.gradeName} · مدارس WE للتكنولوجيا التطبيقية (فرع الشرقية)
            </p>
          </div>

          {/* Quick Classroom Stats */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[120px]">
              <div className="text-2xl font-black text-white font-mono">
                {classStudents.length}
              </div>
              <div className="text-[11px] text-purple-200 font-bold mt-0.5">إجمالي الطلاب</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[120px]">
              <div className="text-2xl font-black text-emerald-300 font-mono">
                {classStudents.filter(s => s.status === 'approved').length}
              </div>
              <div className="text-[11px] text-purple-200 font-bold mt-0.5">حسابات نشطة</div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs within the Classroom */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/15">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'students'
                ? 'bg-white text-[#5C2C90] shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Users size={14} />
            <span>قائمة طلاب الفصل ({classStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'bg-white text-[#5C2C90] shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Calendar size={14} />
            <span>جدول حصص الفصل</span>
          </button>
        </div>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'students' ? (
        <div className="space-y-4">
          {/* Quick Classroom Search */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={`ابحث في طلاب فصل ${classroomName} بالاسم أو الكود...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              />
              <Search size={16} className="absolute right-3.5 top-2.5 text-slate-400" />
            </div>
          </div>

          {/* Students Table for this class */}
          <StudentTable
            students={filteredClassStudents}
            loading={loading}
            gradeFilter="all"
            classFilter={classroomName}
            onEditStudent={onOpenEditStudent}
            onDeleteStudent={onOpenDeleteStudent}
            onViewStudentProfile={onViewStudentProfile}
          />
        </div>
      ) : (
        /* Classroom Schedule Tab */
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Clock size={18} className="text-[#5C2C90]" />
              <span>الجدول الدراسي الأسبوعي لفصل {classroomName}</span>
            </h3>
          </div>

          {loadingSchedule ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <div className="w-8 h-8 mx-auto border-2 border-purple-200 border-t-[#5C2C90] rounded-full animate-spin mb-3" />
              جارٍ تحميل جدول الفصل...
            </div>
          ) : schedule.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-2">
              <Calendar size={32} className="mx-auto text-slate-300 mb-1" />
              <p>جدول الحصص الأسبوعي متاح لدى إدارة المدرسة ومعلمي الفصل.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">اليوم</th>
                    <th className="py-3 px-4">الحصة</th>
                    <th className="py-3 px-4">المادة</th>
                    <th className="py-3 px-4">المعلم</th>
                    <th className="py-3 px-4">القاعة / المعمل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedule.map((slot, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/40">
                      <td className="py-3 px-4 font-bold text-slate-900">{slot.dayOfWeek}</td>
                      <td className="py-3 px-4 font-bold text-[#5C2C90]">{formatPeriodLabel(slot.periodNumber, slot.periodName)}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{slot.subject}</td>
                      <td className="py-3 px-4 text-slate-600">{slot.teacherName}</td>
                      <td className="py-3 px-4 text-slate-600 font-bold">{formatRoomLabel(slot.roomName || 'معمل الحاسب')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
