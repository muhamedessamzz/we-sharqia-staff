import React from 'react';
import { Users, Zap, BookOpen, ShieldCheck } from 'lucide-react';

export default function TeacherHeader({ permissions, onOpenCreateModal }) {
  const {
    isSuperAdmin,
    isSchoolManager,
    isTechnicalEngineer,
    isTeachingStaff,
    assignedClasses,
    isRestricted
  } = permissions;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5C2C90] to-[#E4007C] text-white flex items-center justify-center shadow-md shadow-purple-900/15 shrink-0">
          <Users size={24} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {isSuperAdmin
                ? 'المتابعة التعليمية للفصول'
                : isSchoolManager
                ? 'متابعة الفصول والمعلمين'
                : isTechnicalEngineer
                ? 'التدريب العملي والمعامل'
                : 'لوحة المعلم'}
            </h2>
            {isRestricted && (
              <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full font-mono flex items-center gap-1 shadow-2xs">
                <span>فصولك: {assignedClasses.join(' · ')}</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isSuperAdmin || isSchoolManager
              ? 'متابعة الحصص الدراسية والتكليفات والاختبارات ورصد الدرجات.'
              : 'إدارة التكليفات والاختبارات القصيرة، ورصد الدرجات، ومتابعة حضور وتفاعل الطلاب.'}
          </p>
        </div>
      </div>

      {/* Quick Top Actions: Only show creation buttons for actual teaching staff */}
      {isTeachingStaff ? (
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenCreateModal('quiz')}
            className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-purple-900/15 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap size={16} />
            <span>+ اختبار قصير</span>
          </button>

          <button
            onClick={() => onOpenCreateModal('assignment')}
            className="bg-purple-50 hover:bg-purple-100 text-[#5C2C90] border border-purple-200 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen size={16} />
            <span>+ إضافة واجب</span>
          </button>
        </div>
      ) : (
        <div className="bg-purple-50/70 border border-purple-200/90 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-[#5C2C90] shadow-2xs self-start md:self-auto">
          <ShieldCheck size={16} />
          <span>وضع المتابعة والاطلاع</span>
        </div>
      )}
    </div>
  );
}
