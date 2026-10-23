import React from 'react';
import { Search } from 'lucide-react';

export default function ClassroomFilterBar({
  searchTerm,
  onSearchChange,
  gradeFilter,
  classFilter,
  onSelectFilter,
  counts,
}) {
  return (
    <div className="space-y-3">
      {/* Quick Stage Tabs Pill Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-2.5 rounded-2xl border border-slate-200/80">
        <span className="text-xs font-extrabold text-slate-500 px-2">تصفية سريعة:</span>
        <button
          onClick={() => onSelectFilter('all', 'all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            gradeFilter === 'all' && classFilter === 'all'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          عرض الكل ({counts.total})
        </button>

        <span className="text-slate-300">|</span>

        {/* Grade 1 options */}
        <button
          onClick={() => onSelectFilter('1', 'all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            gradeFilter === '1' && classFilter === 'all'
              ? 'bg-sky-700 text-white shadow-xs'
              : 'text-sky-800 bg-sky-50/70 hover:bg-sky-100'
          }`}
        >
          الصف الأول ({counts.grade1})
        </button>
        {['A1', 'A2', 'A3', 'A4'].map((cls) => (
          <button
            key={cls}
            onClick={() => onSelectFilter('1', cls)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              gradeFilter === '1' && classFilter === cls
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            {cls} ({counts[cls.toLowerCase()] || 0})
          </button>
        ))}

        <span className="text-slate-300">|</span>

        {/* Grade 2 options */}
        <button
          onClick={() => onSelectFilter('2', 'all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            gradeFilter === '2' && classFilter === 'all'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100'
          }`}
        >
          الصف الثاني ({counts.grade2})
        </button>
        {['B1', 'B2', 'B3'].map((cls) => (
          <button
            key={cls}
            onClick={() => onSelectFilter('2', cls)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              gradeFilter === '2' && classFilter === cls
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            {cls} ({counts[cls.toLowerCase()] || 0})
          </button>
        ))}

        <span className="text-slate-300">|</span>

        {/* Grade 3 options */}
        <button
          onClick={() => onSelectFilter('3', 'all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            gradeFilter === '3' && classFilter === 'all'
              ? 'bg-[#E4007C] text-white shadow-xs'
              : 'text-pink-800 bg-pink-50/70 hover:bg-pink-100'
          }`}
        >
          الصف الثالث ({counts.grade3})
        </button>
        {['C1', 'C2'].map((cls) => (
          <button
            key={cls}
            onClick={() => onSelectFilter('3', cls)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              gradeFilter === '3' && classFilter === cls
                ? 'bg-[#E4007C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            {cls} ({counts[cls.toLowerCase()] || 0})
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="ابحث بالاسم أو اسم المستخدم..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
          />
          <Search size={16} className="absolute right-3.5 top-3 text-slate-400" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600">الصف:</span>
            <select
              value={gradeFilter}
              onChange={(e) => onSelectFilter(e.target.value, 'all')}
              className="bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl px-3 py-2 focus:outline-none text-xs"
            >
              <option value="all">جميع الصفوف</option>
              <option value="1">الصف الأول (المرحلة A)</option>
              <option value="2">الصف الثاني (المرحلة B)</option>
              <option value="3">الصف الثالث (المرحلة C)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600">الفصل:</span>
            <select
              value={classFilter}
              onChange={(e) => onSelectFilter(gradeFilter, e.target.value)}
              className="bg-slate-50 border border-slate-200 text-[#5C2C90] font-bold rounded-xl px-3 py-2 focus:outline-none text-xs font-mono"
            >
              <option value="all">جميع الفصول</option>
              <optgroup label="الصف الأول (المرحلة A)">
                <option value="A1">فصل A1</option>
                <option value="A2">فصل A2</option>
                <option value="A3">فصل A3</option>
                <option value="A4">فصل A4</option>
              </optgroup>
              <optgroup label="الصف الثاني (المرحلة B)">
                <option value="B1">فصل B1</option>
                <option value="B2">فصل B2</option>
                <option value="B3">فصل B3</option>
              </optgroup>
              <optgroup label="الصف الثالث (المرحلة C)">
                <option value="C1">فصل C1</option>
                <option value="C2">فصل C2</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
