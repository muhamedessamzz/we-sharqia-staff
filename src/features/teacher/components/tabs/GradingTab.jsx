import React from 'react';
import { Search, CheckCircle, Clock, PenTool, Zap, BookOpen, Calendar, Timer, Filter } from 'lucide-react';
import { formatDateTimeArabic, calculateDurationArabic } from '../../../../utils/dateUtils';

export default function GradingTab({
  assignments,
  filters,
  permissions = {},
  onOpenGradingModal
}) {
  const {
    filterClass,
    setFilterClass,
    searchQuery,
    setSearchQuery,
    gradingAssignmentFilter,
    setGradingAssignmentFilter,
    gradingStatusFilter,
    setGradingStatusFilter,
    filteredSubmissions,
    submissionsList = []
  } = filters;
  const { isRestricted, assignedClasses = [] } = permissions;

  return (
    <div className="space-y-5 fade-in">
      {/* Submissions Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="بحث باسم الطالب أو التكليف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3 py-2 text-xs focus:outline-none focus:border-[#5C2C90]"
            />
            <Search size={15} className="absolute right-3.5 top-2.5 text-slate-400" />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto justify-end">
            {/* Classroom Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-600">الفصل:</span>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-[#5C2C90] font-bold rounded-xl px-2.5 py-1.5 text-xs focus:outline-none cursor-pointer"
              >
                {isRestricted ? (
                  <>
                    <option value="all">كل فصولك ({assignedClasses.join(', ')})</option>
                    {assignedClasses.map((cls) => (
                      <option key={cls} value={cls}>فصل {cls}</option>
                    ))}
                  </>
                ) : (
                  <>
                    <option value="all">كل الفصول</option>
                    {['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'C1', 'C2'].map((cls) => (
                      <option key={cls} value={cls}>فصل {cls}</option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-600">المهمة:</span>
              <select
                value={gradingAssignmentFilter}
                onChange={(e) => setGradingAssignmentFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl px-2.5 py-1.5 text-xs focus:outline-none cursor-pointer max-w-[180px] truncate"
              >
                <option value="all">جميع التكليفات والاختبارات</option>
                {assignments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.assignmentType === 'quiz' ? '⚡ ' : '📝 '}
                    {a.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-600">الحالة:</span>
              <select
                value={gradingStatusFilter}
                onChange={(e) => setGradingStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl px-2.5 py-1.5 text-xs focus:outline-none cursor-pointer"
              >
                <option value="all">كل الحالات</option>
                <option value="pending">🟡 في انتظار التصحيح</option>
                <option value="graded">🟢 تم الرصد والاعتماد</option>
              </select>
            </div>

            <div className="font-mono font-bold bg-purple-50 text-[#5C2C90] border border-purple-100 px-2.5 py-1 rounded-xl text-xs">
              {filteredSubmissions.length} تسليمات
            </div>
          </div>
        </div>

        {/* Quick Classroom Pills in Grading Tab */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 ml-1">
            <Filter size={12} className="text-[#5C2C90]" />
            <span>تصفية الفصل للتصحيح:</span>
          </span>

          <button
            onClick={() => setFilterClass('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterClass === 'all'
                ? 'bg-[#5C2C90] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isRestricted ? `كل فصولك (${submissionsList.length})` : `كافة الفصول (${submissionsList.length})`}
          </button>

          {(isRestricted ? assignedClasses : ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'C1', 'C2']).map((cls) => {
            const count = submissionsList.filter(s => s.classroom?.toUpperCase() === cls.toUpperCase()).length;
            const pendingCount = submissionsList.filter(s => s.classroom?.toUpperCase() === cls.toUpperCase() && !s.isGraded).length;
            return (
              <button
                key={cls}
                onClick={() => setFilterClass(cls)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterClass === cls
                    ? 'bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white shadow-xs'
                    : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
                }`}
              >
                <span>فصل {cls}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterClass === cls ? 'bg-white/25 text-white' : 'bg-purple-200/60 text-[#5C2C90]'
                }`}>
                  {count} {pendingCount > 0 ? `(${pendingCount} معلق)` : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submissions Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="text-3xl mb-2">📋</div>
            <h4 className="font-bold text-slate-700 text-sm">لا توجد تسليمات تطابق خيارات التصفية الحالية</h4>
            <p className="text-xs text-slate-400 mt-1">تظهر هنا إجابات وتسليمات الطلاب فور الانتهاء موثقة بالتاريخ والوقت ومستغرق الحل.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-black">
                <tr>
                  <th className="py-3.5 px-4">الطالب</th>
                  <th className="py-3.5 px-3">الفصل</th>
                  <th className="py-3.5 px-4">التكليف / الاختبار</th>
                  <th className="py-3.5 px-3">توقيت البدء 🕒</th>
                  <th className="py-3.5 px-3">توقيت التسليم 🏁</th>
                  <th className="py-3.5 px-3 text-center">الوقت المستغرق ⏱️</th>
                  <th className="py-3.5 px-3 text-center">الدرجة</th>
                  <th className="py-3.5 px-3 text-center">حالة التقييم</th>
                  <th className="py-3.5 px-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((sub) => {
                  const isGraded = sub.isGraded;
                  const isQuiz = sub.assignmentType === 'quiz';
                  const duration = calculateDurationArabic(sub.startedAtUtc, sub.finishedAtUtc);

                  return (
                    <tr key={sub.id} className="hover:bg-purple-50/30 transition-colors">
                      {/* Student */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {sub.studentName}
                      </td>

                      {/* Classroom */}
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-extrabold text-[#5C2C90] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md">
                          {sub.classroom || '—'}
                        </span>
                      </td>

                      {/* Assignment / Quiz Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 max-w-[220px]">
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded shrink-0 border ${
                            isQuiz
                              ? 'bg-pink-50 text-[#E4007C] border-pink-200'
                              : 'bg-purple-50 text-[#5C2C90] border-purple-200'
                          }`}>
                            {isQuiz ? '⚡ كويز' : '📝 تكليف'}
                          </span>
                          <span className="font-semibold text-slate-800 truncate" title={sub.assignmentTitle}>
                            {sub.assignmentTitle}
                          </span>
                        </div>
                      </td>

                      {/* Started At (Date & Time) */}
                      <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                        {formatDateTimeArabic(sub.startedAtUtc)}
                      </td>

                      {/* Finished At (Date & Time + Late Badge) */}
                      <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                        <div>
                          <span>{formatDateTimeArabic(sub.finishedAtUtc)}</span>
                          {sub.isLate ? (
                            <span className="text-rose-600 font-black block text-[10px]">
                              متأخر عن الديدلاين ⚠️
                            </span>
                          ) : sub.finishedAtUtc ? (
                            <span className="text-emerald-600 font-bold block text-[10px]">
                              في الموعد المحدد ✅
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Duration Taken */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-[11px] inline-flex items-center gap-1">
                          <Timer size={12} className="text-[#5C2C90]" />
                          <span>{duration}</span>
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="py-3.5 px-3 text-center font-mono font-black text-purple-800 text-sm">
                        {sub.manualGrade ?? (isGraded ? sub.autoScore : (sub.autoScore ? `${sub.autoScore} تلقائي` : '—'))}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center">
                        {isGraded ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                            <CheckCircle size={11} /> معتمد ورُصد
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                            <Clock size={11} /> بانتظار التصحيح
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onOpenGradingModal(sub)}
                          className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 mx-auto cursor-pointer shadow-2xs whitespace-nowrap"
                        >
                          <PenTool size={12} />
                          <span>{isGraded ? 'تعديل الدرجة' : 'تصحيح ورصد'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
