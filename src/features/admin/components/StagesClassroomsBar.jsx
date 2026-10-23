import React from 'react';
import { Search, Plus, Layers } from 'lucide-react';
import { STAGES_CONFIG } from '../constants';

export default function StagesClassroomsBar({
  selectedStage,
  onSelectStage,
  selectedClassroom,
  onSelectClassroom,
  classroomsMap,
  newClassInput,
  onNewClassInputChange,
  isAddingClassInline,
  onToggleAddingClassInline,
  onAddClassroom,
  searchQuery,
  onSearchChange,
}) {
  const currentClassrooms = classroomsMap[selectedStage] || [];

  return (
    <div className="space-y-3">
      {/* Stages Tabs */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#5C2C90]" size={18} />
            <h3 className="font-black text-sm sm:text-base text-slate-900">
              الفصول الدراسية
            </h3>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
            {STAGES_CONFIG.map((stg) => (
              <button
                key={stg.grade}
                onClick={() => {
                  onSelectStage(stg.grade);
                  onSelectClassroom('all');
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  selectedStage === stg.grade
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {stg.name} ({stg.letter})
              </button>
            ))}
          </div>
        </div>

        {/* Classrooms for selected stage */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500">الفصول:</span>
          <button
            onClick={() => onSelectClassroom('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedClassroom === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            جميع الفصول
          </button>

          {currentClassrooms.map((cls) => (
            <button
              key={cls}
              onClick={() => onSelectClassroom(cls)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all font-mono cursor-pointer ${
                selectedClassroom === cls
                  ? 'bg-[#5C2C90] text-white shadow-xs'
                  : 'bg-purple-50 text-[#5C2C90] hover:bg-purple-100 border border-purple-200/60'
              }`}
            >
              فصل {cls}
            </button>
          ))}

          {/* Add class inline */}
          {isAddingClassInline ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="اسم الفصل"
                value={newClassInput}
                onChange={(e) => onNewClassInputChange(e.target.value)}
                className="w-24 px-2.5 py-1 bg-white border border-purple-300 rounded-xl text-xs font-bold text-center uppercase"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onAddClassroom(selectedStage, newClassInput);
                  if (e.key === 'Escape') onToggleAddingClassInline(false);
                }}
              />
              <button
                onClick={() => onAddClassroom(selectedStage, newClassInput)}
                className="bg-[#5C2C90] text-white px-2.5 py-1 rounded-xl text-xs font-bold cursor-pointer"
              >
                إضافة
              </button>
              <button
                onClick={() => onToggleAddingClassInline(false)}
                className="bg-slate-200 text-slate-600 px-2 py-1 rounded-xl text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => onToggleAddingClassInline(true)}
              className="text-xs font-bold text-[#5C2C90] hover:bg-purple-50 border border-dashed border-purple-300 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus size={13} />
              <span>إضافة فصل</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="ابحث بالاسم، أو اسم المستخدم، أو الفصل..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
          />
          <Search size={16} className="absolute right-3.5 top-3 text-slate-400" />
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          بحث مباشر في قائمة المستخدمين
        </span>
      </div>
    </div>
  );
}
