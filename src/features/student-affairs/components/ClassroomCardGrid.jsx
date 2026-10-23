import React from 'react';
import { Users, ArrowLeft, GraduationCap, Sparkles, Building2, UserCheck } from 'lucide-react';

const CLASSROOM_TRACKS = {
  A1: { track: 'تطوير البرمجيات وتطبيقات الويب', grade: 1, gradeName: 'الصف الأول (المرحلة A)', color: 'border-sky-200 bg-sky-50/40 hover:bg-sky-50/80', tagColor: 'bg-sky-100 text-sky-800' },
  A2: { track: 'تكنولوجيا الشبكات وإدارة الأنظمة', grade: 1, gradeName: 'الصف الأول (المرحلة A)', color: 'border-sky-200 bg-sky-50/40 hover:bg-sky-50/80', tagColor: 'bg-sky-100 text-sky-800' },
  A3: { track: 'تكنولوجيا الاتصالات والبنية التحتية', grade: 1, gradeName: 'الصف الأول (المرحلة A)', color: 'border-sky-200 bg-sky-50/40 hover:bg-sky-50/80', tagColor: 'bg-sky-100 text-sky-800' },
  A4: { track: 'الذكاء الاصطناعي وتحليل البيانات', grade: 1, gradeName: 'الصف الأول (المرحلة A)', color: 'border-sky-200 bg-sky-50/40 hover:bg-sky-50/80', tagColor: 'bg-sky-100 text-sky-800' },
  
  B1: { track: 'مسار الشبكات والبرمجيات المتقدمة', grade: 2, gradeName: 'الصف الثاني (المرحلة B)', color: 'border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/80', tagColor: 'bg-indigo-100 text-indigo-800' },
  B2: { track: 'مسار الاتصالات والأنظمة المدمجة', grade: 2, gradeName: 'الصف الثاني (المرحلة B)', color: 'border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/80', tagColor: 'bg-indigo-100 text-indigo-800' },
  B3: { track: 'مسار التطبيقات الرقمية والسحابية', grade: 2, gradeName: 'الصف الثاني (المرحلة B)', color: 'border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/80', tagColor: 'bg-indigo-100 text-indigo-800' },
  
  C1: { track: 'مشاريع التخرج والتدريب العملي الميداني', grade: 3, gradeName: 'الصف الثالث (المرحلة C)', color: 'border-pink-200 bg-pink-50/40 hover:bg-pink-50/80', tagColor: 'bg-pink-100 text-pink-800' },
  C2: { track: 'التخصصات المتقدمة والتطبيقات المهنية', grade: 3, gradeName: 'الصف الثالث (المرحلة C)', color: 'border-pink-200 bg-pink-50/40 hover:bg-pink-50/80', tagColor: 'bg-pink-100 text-pink-800' },
};

export default function ClassroomCardGrid({
  students,
  counts,
  onOpenClassroom,
  onViewAllStudents,
}) {
  const grades = [
    {
      id: 1,
      title: 'الصف الأول الثانوي (المرحلة A)',
      totalCount: counts.grade1 || 99,
      classrooms: ['A1', 'A2', 'A3', 'A4'],
      headerBg: 'from-sky-700 to-indigo-800',
    },
    {
      id: 2,
      title: 'الصف الثاني الثانوي (المرحلة B)',
      totalCount: counts.grade2 || 64,
      classrooms: ['B1', 'B2', 'B3'],
      headerBg: 'from-indigo-700 to-purple-800',
    },
    {
      id: 3,
      title: 'الصف الثالث الثانوي (المرحلة C)',
      totalCount: counts.grade3 || 25,
      classrooms: ['C1', 'C2'],
      headerBg: 'from-[#5C2C90] to-[#E4007C]',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Summary Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold shadow-xs">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg text-slate-900">
              الفصول والمراحل الدراسية (9 فصول)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              اضغط على أي فصل لفتح صفحته المخصصة واستعراض طلابه وجدوله وتفاصيله الكاملة
            </p>
          </div>
        </div>

        <button
          onClick={onViewAllStudents}
          className="bg-slate-100 hover:bg-[#5C2C90] text-slate-700 hover:text-white px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border border-slate-200 shadow-2xs"
        >
          <Users size={15} />
          <span>عرض كشف جميع الطلاب ({counts.total || students.length} طالب)</span>
        </button>
      </div>

      {/* Grade Sections */}
      {grades.map((g) => {
        return (
          <div key={g.id} className="space-y-3.5">
            {/* Grade Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#5C2C90]" />
                <h4 className="font-black text-base text-slate-900">
                  {g.title}
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-[#5C2C90]">
                  {g.totalCount} طالب
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {g.classrooms.length} فصول دراسية
              </span>
            </div>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {g.classrooms.map((clsName) => {
                const info = CLASSROOM_TRACKS[clsName] || {};
                const classStudents = students.filter(
                  (s) => s.classroom?.toUpperCase() === clsName.toUpperCase()
                );
                const classCount = classStudents.length || counts[clsName.toLowerCase()] || 0;
                const activeCount = classStudents.filter((s) => s.status === 'approved').length;

                return (
                  <div
                    key={clsName}
                    onClick={() => onOpenClassroom(clsName)}
                    className={`group bg-white rounded-3xl p-5 border ${info.color} shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono font-black text-base px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-2xs group-hover:bg-[#5C2C90] group-hover:text-white transition-colors">
                          فصل {clsName}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${info.tagColor}`}>
                          {classCount} طالب
                        </span>
                      </div>

                      {/* Track Title */}
                      <h5 className="font-extrabold text-sm text-slate-900 mb-1.5 leading-snug line-clamp-2">
                        {info.track}
                      </h5>

                      <p className="text-xs text-slate-500 font-medium">
                        {info.gradeName}
                      </p>
                    </div>

                    {/* Footer Info & Action */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                        <UserCheck size={13} className="text-emerald-600" />
                        <span>{activeCount || classCount} نشط</span>
                      </div>

                      <div className="flex items-center gap-1 font-black text-[#5C2C90] group-hover:-translate-x-1 transition-transform">
                        <span>فتح الفصل</span>
                        <ArrowLeft size={13} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
