import React from 'react';
import { PlusCircle, Eye, PenTool, Trash2 } from 'lucide-react';

export default function AssignmentsTab({
  assignments,
  liveStudents,
  permissions,
  assignmentTypeFilter,
  setAssignmentTypeFilter,
  onOpenCreateModal,
  onSelectAssignmentForGrading,
  onDeleteAssignment
}) {
  const { isTeachingStaff } = permissions;

  const filteredAssignments = assignments.filter(a => {
    if (assignmentTypeFilter === 'quiz') return a.assignmentType === 'quiz';
    if (assignmentTypeFilter === 'assignment') return a.assignmentType !== 'quiz';
    return true;
  });

  return (
    <div className="space-y-5 fade-in">
      {/* Controls Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600">تصفية النوع:</span>
          <button
            onClick={() => setAssignmentTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              assignmentTypeFilter === 'all'
                ? 'bg-[#5C2C90] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل ({assignments.length})
          </button>
          <button
            onClick={() => setAssignmentTypeFilter('quiz')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              assignmentTypeFilter === 'quiz'
                ? 'bg-[#E4007C] text-white shadow-xs'
                : 'bg-pink-50 text-[#E4007C] border border-pink-200 hover:bg-pink-100'
            }`}
          >
            ⚡ اختبارات قصيرة ({assignments.filter(a => a.assignmentType === 'quiz').length})
          </button>
          <button
            onClick={() => setAssignmentTypeFilter('assignment')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              assignmentTypeFilter === 'assignment'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            📝 واجبات ومهام عملية ({assignments.filter(a => a.assignmentType !== 'quiz').length})
          </button>
        </div>

        {isTeachingStaff ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCreateModal('quiz')}
              className="bg-[#5C2C90] hover:bg-[#4a2175] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PlusCircle size={15} />
              <span>إنشاء اختبار أو تكليف جديد</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl font-bold border border-slate-200">
            <Eye size={14} className="text-[#5C2C90]" />
            <span>سجل تكليفات هيئة التدريس المعتمدة</span>
          </div>
        )}
      </div>

      {/* Assignments Cards List */}
      {assignments.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-xs">
          <div className="text-4xl mb-2">📚</div>
          <h4 className="font-bold text-slate-800 text-base">لا توجد تكليفات أو اختبارات منشورة حالياً</h4>
          <p className="text-xs text-slate-400 mt-1">ابدأ بإنشاء أول اختبار أو تكليف دراسي موجه لطلابك.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssignments.map((asg) => {
            const isQuiz = asg.assignmentType === 'quiz';
            const totalQuestions = (asg.stages || []).reduce((acc, s) => acc + (s.questions?.length || 0), 0);
            const relatedSubmissions = liveStudents.filter(s => s.assignmentId === asg.id);
            const submittedCount = relatedSubmissions.filter(s => s.status === 4 || s.isGraded).length;

            return (
              <div
                key={asg.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4 hover:border-[#5C2C90]/40 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                      isQuiz 
                        ? 'bg-pink-50 text-[#E4007C] border-pink-200' 
                        : 'bg-purple-50 text-[#5C2C90] border-purple-200'
                    }`}>
                      <span>{isQuiz ? '⚡ اختبار قصير' : '📝 تكليف دراسي وتطبيقي'}</span>
                    </span>

                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-mono border border-slate-200">
                      {asg.targetClassroom ? `فصل ${asg.targetClassroom}` : 'كافة الفصول 🌐'}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 leading-snug mb-1">
                    {asg.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {asg.instructions}
                  </p>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">المدة المقترحة</span>
                      <span className="font-extrabold text-slate-800 font-mono">{asg.suggestedMinutes} دقيقة</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">الأسئلة / المراحل</span>
                      <span className="font-extrabold text-slate-800 font-mono">{totalQuestions} أسئلة</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">التسليمات</span>
                      <span className="font-extrabold text-[#5C2C90] font-mono">{submittedCount} طلاب</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectAssignmentForGrading(asg.id)}
                    className="bg-purple-50 hover:bg-purple-100 text-[#5C2C90] border border-purple-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PenTool size={14} />
                    <span>مراجعة التسليمات والدرجات ({submittedCount})</span>
                  </button>

                  <button
                    onClick={() => onDeleteAssignment(asg.id, asg.title)}
                    className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="حذف التكليف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
