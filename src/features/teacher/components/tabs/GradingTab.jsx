import React from 'react';
import { Search, CheckCircle, Clock, PenTool } from 'lucide-react';

export default function GradingTab({
  assignments,
  filters,
  onOpenGradingModal
}) {
  const {
    searchQuery,
    setSearchQuery,
    gradingAssignmentFilter,
    setGradingAssignmentFilter,
    gradingStatusFilter,
    setGradingStatusFilter,
    filteredSubmissions
  } = filters;

  return (
    <div className="space-y-5 fade-in">
      {/* Submissions Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
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
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600">التكليف:</span>
            <select
              value={gradingAssignmentFilter}
              onChange={(e) => setGradingAssignmentFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
            >
              <option value="all">جميع التكليفات والاختبارات</option>
              {assignments.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600">الحالة:</span>
            <select
              value={gradingStatusFilter}
              onChange={(e) => setGradingStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
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

      {/* Submissions Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="text-3xl mb-2">📋</div>
            <h4 className="font-bold text-slate-700 text-sm">لا توجد تسليمات تطابق خيارات التصفية الحالية</h4>
            <p className="text-xs text-slate-400 mt-1">تظهر هنا إجابات الطلاب فور تسليم التكليفات والاختبارات لتصحيحها ورصد الدرجات.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-black">
                <tr>
                  <th className="py-3 px-4">الطالب</th>
                  <th className="py-3 px-3">الفصل</th>
                  <th className="py-3 px-4">التكليف / الاختبار</th>
                  <th className="py-3 px-3">وقت التسليم</th>
                  <th className="py-3 px-3 text-center">الدرجة التلقائية</th>
                  <th className="py-3 px-3 text-center">الدرجة المعتمدة</th>
                  <th className="py-3 px-3 text-center">حالة التقييم</th>
                  <th className="py-3 px-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((sub) => {
                  const isGraded = sub.isGraded;
                  return (
                    <tr key={sub.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {sub.studentName}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-extrabold text-[#5C2C90] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md">
                          {sub.classroom || '—'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 max-w-[200px] truncate" title={sub.assignmentTitle}>
                        {sub.assignmentTitle}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                        {sub.finishedAtUtc ? new Date(sub.finishedAtUtc).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        {sub.isLate && <span className="text-rose-600 font-bold block text-[10px]">متأخر ⚠️</span>}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700">
                        {sub.autoScore ?? '—'}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-black text-purple-700 text-sm">
                        {sub.manualGrade ?? (isGraded ? sub.autoScore : '—')}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {isGraded ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle size={11} /> معتمد ورُصد
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <Clock size={11} /> بانتظار التصحيح
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onOpenGradingModal(sub)}
                          className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 mx-auto cursor-pointer shadow-2xs"
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
