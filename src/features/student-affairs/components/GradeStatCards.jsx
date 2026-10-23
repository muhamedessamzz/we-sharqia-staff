import React from 'react';
import { Users } from 'lucide-react';

export default function GradeStatCards({ counts, gradeFilter, classFilter, onSelectFilter }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {/* All Students */}
      <div
        onClick={() => onSelectFilter('all', 'all')}
        className={`bg-white rounded-3xl p-4 sm:p-5 border cursor-pointer transition-all ${
          gradeFilter === 'all'
            ? 'border-[#5C2C90] ring-2 ring-purple-100 shadow-md'
            : 'border-slate-200/80 shadow-xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-[#5C2C90]">{counts.total}</span>
          <Users size={18} className="text-[#5C2C90]" />
        </div>
        <div className="text-xs font-bold text-slate-700 mt-1">إجمالي طلاب المدرسة</div>
        <div className="text-[10px] text-slate-400 mt-0.5">3 مراحل · 9 فصول دراسية</div>
      </div>

      {/* Grade 1 */}
      <div
        onClick={() => onSelectFilter('1', 'all')}
        className={`bg-white rounded-3xl p-4 sm:p-5 border cursor-pointer transition-all ${
          gradeFilter === '1' && classFilter === 'all'
            ? 'border-sky-600 ring-2 ring-sky-100 shadow-md'
            : 'border-slate-200/80 shadow-xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-sky-700">{counts.grade1}</span>
          <span className="text-[11px] font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
            المرحلة A
          </span>
        </div>
        <div className="text-xs font-bold text-slate-700 mt-1">الصف الأول (A1 - A4)</div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          A1 ({counts.a1}) · A2 ({counts.a2}) · A3 ({counts.a3}) · A4 ({counts.a4})
        </div>
      </div>

      {/* Grade 2 */}
      <div
        onClick={() => onSelectFilter('2', 'all')}
        className={`bg-white rounded-3xl p-4 sm:p-5 border cursor-pointer transition-all ${
          gradeFilter === '2' && classFilter === 'all'
            ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-md'
            : 'border-slate-200/80 shadow-xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-indigo-700">{counts.grade2}</span>
          <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
            المرحلة B
          </span>
        </div>
        <div className="text-xs font-bold text-slate-700 mt-1">الصف الثاني (B1 - B3)</div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          B1 ({counts.b1}) · B2 ({counts.b2}) · B3 ({counts.b3})
        </div>
      </div>

      {/* Grade 3 */}
      <div
        onClick={() => onSelectFilter('3', 'all')}
        className={`bg-white rounded-3xl p-4 sm:p-5 border cursor-pointer transition-all ${
          gradeFilter === '3' && classFilter === 'all'
            ? 'border-[#E4007C] ring-2 ring-pink-100 shadow-md'
            : 'border-slate-200/80 shadow-xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-[#E4007C]">{counts.grade3}</span>
          <span className="text-[11px] font-extrabold text-[#E4007C] bg-pink-50 px-2 py-0.5 rounded-full">
            المرحلة C
          </span>
        </div>
        <div className="text-xs font-bold text-slate-700 mt-1">الصف الثالث (C1 - C2)</div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          C1 ({counts.c1}) · C2 ({counts.c2})
        </div>
      </div>
    </div>
  );
}
