import React from 'react';
import { Layers, CheckCircle2, Award, Laptop, Network, Cpu, ArrowUpRight } from 'lucide-react';

export default function GradeDistributionCard({ user, students = [], onNavigateTab }) {
  const r = (user?.role || '').toLowerCase();
  const isTechnicalEngineer = r === 'technicalengineer';
  const isStudentAffairs = r === 'studentaffairs';

  const targetTab = isStudentAffairs ? 'affairs' : 'teacher';
  const buttonLabel = isTechnicalEngineer ? 'معامل التخصص والتدريب' : isStudentAffairs ? 'كشوف الفصول والطلاب' : 'جدول الحصص والفصول';

  const g1Students = students.filter(s => Number(s.grade) === 1 || (s.classroom && s.classroom.toUpperCase().startsWith('A')));
  const g2Students = students.filter(s => Number(s.grade) === 2 || (s.classroom && s.classroom.toUpperCase().startsWith('B')));
  const g3Students = students.filter(s => Number(s.grade) === 3 || (s.classroom && s.classroom.toUpperCase().startsWith('C')));

  const countClass = (stds, cls) => stds.filter(s => (s.classroom || '').toUpperCase() === cls.toUpperCase()).length;

  const tracks = [
    {
      grade: 'الصف الأول الثانوي',
      code: 'الصف الأول (A)',
      studentsCount: g1Students.length,
      capacity: 100,
      attendanceRate: g1Students.length > 0 ? 100 : 0,
      classes: [
        { name: 'فصل A1 · تطوير البرمجيات', icon: Laptop, count: countClass(g1Students, 'A1') },
        { name: 'فصل A2 · تكنولوجيا الشبكات', icon: Network, count: countClass(g1Students, 'A2') },
        { name: 'فصل A3 · تكنولوجيا الاتصالات', icon: Network, count: countClass(g1Students, 'A3') },
        { name: 'فصل A4 · الذكاء الاصطناعي', icon: Cpu, count: countClass(g1Students, 'A4') },
      ],
      color: 'from-purple-600 to-indigo-600',
      tagColor: 'bg-purple-100 text-purple-800',
    },
    {
      grade: 'الصف الثاني الثانوي',
      code: 'الصف الثاني (B)',
      studentsCount: g2Students.length,
      capacity: 75,
      attendanceRate: g2Students.length > 0 ? 100 : 0,
      classes: [
        { name: 'فصل B1 · مسار الشبكات والبرمجيات', icon: Laptop, count: countClass(g2Students, 'B1') },
        { name: 'فصل B2 · مسار الاتصالات والذكاء الاصطناعي', icon: Cpu, count: countClass(g2Students, 'B2') },
        { name: 'فصل B3 · مسار التطبيقات الرقمية', icon: Network, count: countClass(g2Students, 'B3') },
      ],
      color: 'from-blue-600 to-cyan-600',
      tagColor: 'bg-blue-100 text-blue-800',
    },
    {
      grade: 'الصف الثالث الثانوي',
      code: 'الصف الثالث (C)',
      studentsCount: g3Students.length,
      capacity: 50,
      attendanceRate: g3Students.length > 0 ? 100 : 0,
      classes: [
        { name: 'فصل C1 · مشاريع التخرج والتدريب العملي', icon: Cpu, count: countClass(g3Students, 'C1') },
        { name: 'فصل C2 · التخصصات المتقدمة والتطبيقات', icon: Award, count: countClass(g3Students, 'C2') },
      ],
      color: 'from-[#E4007C] to-pink-600',
      tagColor: 'bg-pink-100 text-[#E4007C]',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Layers size={18} className="text-[#5C2C90]" />
            <span>توزيع الفصول والتخصصات</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            متابعة كثافة الفصول ونسب الحضور في الصفوف الدراسية
          </p>
        </div>

        <button
          onClick={() => onNavigateTab && onNavigateTab(targetTab)}
          className="text-xs font-black text-[#5C2C90] hover:text-[#421d69] flex items-center gap-1 self-start sm:self-auto bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <span>{buttonLabel}</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {tracks.map((t, idx) => {
          const occupancy = Math.round((t.studentsCount / t.capacity) * 100);
          return (
            <div
              key={idx}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-300 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${t.tagColor}`}>
                    {t.code}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {t.studentsCount} / {t.capacity} طالب
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 mb-2">
                  {t.grade}
                </h3>

                {/* Occupancy bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>نسبة الإشغال</span>
                    <span className="font-mono text-slate-700">{occupancy}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${t.color} rounded-full transition-all duration-500`}
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                </div>

                {/* Sub-classes */}
                <div className="space-y-2">
                  {t.classes.map((cls, cIdx) => {
                    const ClsIcon = cls.icon;
                    return (
                      <div
                        key={cIdx}
                        className="bg-white border border-slate-200/70 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                            <ClsIcon size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-700 truncate">
                            {cls.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 shrink-0 font-mono">
                          {cls.count} طالب
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">نسبة الحضور:</span>
                <span className="font-black text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>{t.attendanceRate > 0 ? `${t.attendanceRate}%` : '—'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
