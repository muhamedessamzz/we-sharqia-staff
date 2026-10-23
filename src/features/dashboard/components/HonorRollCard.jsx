import React from 'react';
import { Award, Trophy, Star, Sparkles, Medal } from 'lucide-react';

export default function HonorRollCard({ honorRoll = [], onNavigateTab }) {
  const achievers = Array.isArray(honorRoll) ? honorRoll : [];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            <span>لوحة الشرف والطلاب المتفوقون</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            الطلاب الأوائل والمتميزون في الجوانب الدراسية والعملية
          </p>
        </div>

        <button
          onClick={() => onNavigateTab && onNavigateTab('assessment')}
          className="text-xs font-black text-amber-700 hover:text-amber-900 flex items-center gap-1 self-start sm:self-auto bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <Award size={14} />
          <span>سجل الدرجات</span>
        </button>
      </div>

      {achievers.length === 0 ? (
        <div className="bg-slate-50/60 rounded-2xl p-8 border border-slate-200/70 text-center text-slate-400 text-xs">
          لا توجد درجات مرصودة في لوحة الشرف حالياً. يتم إدراج المتفوقين تلقائياً عند إنجاز التكليفات ورصد النجوم.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {achievers.slice(0, 4).map((student, idx) => {
            const displayName = student.studentName || student.fullName || student.name || 'طالب متميز';
            const displayScore = student.totalStars !== undefined ? `⭐ ${student.totalStars}` : (student.score ? `${student.score}%` : '—');
            const badges = [
              { label: 'المركز الأول 🥇', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
              { label: 'المركز الثاني 🥈', color: 'bg-purple-100 text-purple-800 border-purple-200' },
              { label: 'المركز الثالث 🥉', color: 'bg-blue-100 text-blue-800 border-blue-200' },
              { label: 'درع التميز ⭐', color: 'bg-pink-100 text-pink-800 border-pink-200' }
            ];
            const badge = badges[idx] || badges[3];

            return (
              <div
                key={student.studentId || idx}
                className="bg-gradient-to-b from-amber-50/40 via-white to-slate-50/40 border border-amber-200/70 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-amber-400 to-[#E4007C]" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="font-mono text-sm font-black text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200/60 shadow-2xs">
                      {displayScore}
                    </span>
                  </div>

                  <h3 className="font-black text-sm text-slate-900 mb-1 leading-snug">
                    {displayName}
                  </h3>

                  <div className="text-[11px] font-bold text-[#5C2C90] mb-2">
                    {student.classroom || student.track || 'الصف التخصصي'}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    {student.specialty || (student.completedAssignments ? `أنجز ${student.completedAssignments} تكليفاً دراسياً` : 'تفوق دراسي ومشاريع عملية متميزة')}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                  <Sparkles size={11} className="text-amber-500" />
                  <span>معتمد من إدارة التقييم</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
