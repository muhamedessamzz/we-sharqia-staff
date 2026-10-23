import React from 'react';
import { MessageSquare, Clock, PenTool, FileText } from 'lucide-react';
import { STATUS_CONFIG, DEFAULT_SCHOOL_CLASSROOMS } from '../../constants';

export default function LiveBoardTab({
  permissions,
  filters,
  onSendEncouragement,
  onGrantExtraMinutes,
  onOpenGradingModal
}) {
  const { isRestricted, assignedClasses } = permissions;
  const {
    filterClass,
    setFilterClass,
    filterStatus,
    setFilterStatus,
    classFilteredStudents,
    liveFiltered,
    helpCount,
    workingCount,
    doneCount,
    scopedStudents
  } = filters;

  return (
    <div className="space-y-5 fade-in">
      {/* Quick Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setFilterStatus(filterStatus === 'help' ? 'all' : 'help')}
          className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all ${
            filterStatus === 'help' 
              ? 'bg-rose-50/70 border-[#E4007C] ring-2 ring-[#E4007C]/30 shadow-xs' 
              : 'bg-white border-slate-200/80 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">طلبات التوجيه الأكاديمي</span>
            <span className="text-base">🙋</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#E4007C]">{helpCount}</div>
        </div>

        <div
          onClick={() => setFilterStatus(filterStatus === 'working' ? 'all' : 'working')}
          className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all ${
            filterStatus === 'working' 
              ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs' 
              : 'bg-white border-slate-200/80 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">قيد الحل والتنفيذ</span>
            <span className="text-base">⚡</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">{workingCount}</div>
        </div>

        <div
          onClick={() => setFilterStatus(filterStatus === 'done' ? 'all' : 'done')}
          className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all ${
            filterStatus === 'done' 
              ? 'bg-purple-50/70 border-[#5C2C90] ring-2 ring-[#5C2C90]/30 shadow-xs' 
              : 'bg-white border-slate-200/80 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">تم التسليم بنجاح</span>
            <span className="text-base">✅</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#5C2C90]">{doneCount}</div>
        </div>

        <div
          onClick={() => setFilterStatus('all')}
          className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all ${
            filterStatus === 'all' 
              ? 'bg-slate-50 border-slate-400 ring-2 ring-slate-400/20 shadow-xs' 
              : 'bg-white border-slate-200/80 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">إجمالي طلاب المتابعة</span>
            <span className="text-base">👥</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{scopedStudents.length}</div>
        </div>
      </div>

      {/* Classroom Live Bar & Filter */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">الفصل المستهدف:</span>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-[#5C2C90] text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#5C2C90] shadow-xs cursor-pointer"
          >
            {isRestricted ? (
              <>
                <option value="all">كل فصولك المسندة ({assignedClasses.join(', ')})</option>
                {assignedClasses.map((cls) => (
                  <option key={cls} value={cls}>فصل {cls}</option>
                ))}
              </>
            ) : (
              <>
                <option value="all">كل فصول المدرسة (9 فصول)</option>
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
              </>
            )}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-[#5C2C90] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل ({classFilteredStudents.length})
          </button>
          <button
            onClick={() => setFilterStatus('help')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              filterStatus === 'help'
                ? 'bg-[#E4007C] text-white shadow-xs'
                : 'bg-pink-50 text-[#E4007C] border border-pink-200/80 hover:bg-pink-100'
            }`}
          >
            طلبات التوجيه ({helpCount})
          </button>
          <button
            onClick={() => setFilterStatus('working')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              filterStatus === 'working'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            قيد الحل ({workingCount})
          </button>
          <button
            onClick={() => setFilterStatus('done')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              filterStatus === 'done'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-[#5C2C90] border border-purple-200 hover:bg-purple-100'
            }`}
          >
            تم التسليم ({doneCount})
          </button>
        </div>
      </div>

      {/* Live Student Cards */}
      {liveFiltered.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-xs">
          <div className="text-4xl mb-2">🎓</div>
          <h4 className="font-bold text-slate-800 text-base">لا توجد حالات طلاب في هذا القسم حالياً</h4>
          <p className="text-xs text-slate-400 mt-1">يُحدَّث نشاط الطلاب تلقائياً فور بدء حل التكليفات والاختبارات.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveFiltered.map((s) => {
            const cfg = STATUS_CONFIG[s.status] || STATUS_CONFIG[1];
            const isGradingReady = s.status === 4 || s.isGraded;
            const totalStages = Math.max(1, s.totalStages || 3);
            const currentStage = Math.min(totalStages, (s.currentStageIndex ?? 0) + 1);

            return (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#5C2C90]/40 transition-all duration-200 flex flex-col justify-between gap-4 group relative overflow-hidden text-right"
              >
                <div className="space-y-3">
                  {/* Top Header: Student Info + Live Status Badge */}
                  <div className="flex items-start justify-between gap-2.5">
                    {/* Student Avatar & Name */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50 border border-purple-200/80 text-[#5C2C90] font-black text-sm flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        {s.studentName ? s.studentName[0] : 'ط'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-black text-sm text-slate-900 truncate" title={s.studentName}>
                            {s.studentName}
                          </h4>
                          {s.classroom && (
                            <span className="text-[10px] font-bold text-[#5C2C90] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/70 shrink-0">
                              فصل {s.classroom}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Pill Badge with Live Indicator */}
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-full shrink-0 border whitespace-nowrap shadow-2xs ${cfg.bg} ${cfg.color} ${cfg.border}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          s.status === 1
                            ? 'bg-emerald-500 animate-pulse'
                            : s.status === 2
                            ? 'bg-[#E4007C] animate-ping'
                            : 'bg-[#5C2C90]'
                        }`}
                      />
                      <span>{cfg.label}</span>
                    </span>
                  </div>

                  {/* Assignment Title Dedicated Pill */}
                  <div
                    className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50/90 border border-slate-200/80 px-3 py-1.5 rounded-xl font-medium"
                    title={s.assignmentTitle}
                  >
                    <FileText size={13} className="text-[#5C2C90] shrink-0" />
                    <span className="truncate">{s.assignmentTitle || 'تكليف تدريبي'}</span>
                  </div>

                  {/* Stage Progress & Metric Scores */}
                  <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <span>المرحلة {currentStage} من {totalStages}</span>
                        {/* Segmented Visual Stage Track */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalStages }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1.5 w-3.5 rounded-full transition-all ${
                                idx < currentStage
                                  ? 'bg-gradient-to-r from-[#5C2C90] to-[#E4007C]'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Stars & Grade Badges */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/80 px-2 py-0.5 rounded-lg text-xs font-bold shadow-2xs"
                          title="النجوم المحصلة"
                        >
                          <span>⭐</span>
                          <span>{s.stars || 0}</span>
                        </span>

                        <span
                          className="inline-flex items-center gap-1 bg-purple-50 text-[#5C2C90] border border-purple-200/80 px-2 py-0.5 rounded-lg text-xs font-black shadow-2xs"
                          title="الدرجة الحالية"
                        >
                          <span className="text-[10px] text-purple-600 font-bold">الدرجة:</span>
                          <span>{s.manualGrade ?? s.autoScore ?? 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Help Request Callout */}
                  {s.helpTypeRequested && (
                    <div className="bg-rose-50/80 border border-rose-200/90 text-rose-950 p-3 rounded-2xl text-xs space-y-1 shadow-2xs">
                      <div className="flex items-center gap-1.5 font-black text-[#E4007C]">
                        <span>🙋</span>
                        <span>استفسار وتوجيه أكاديمي مطلوب:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {s.helpTypeRequested}
                      </p>
                    </div>
                  )}
                </div>

                {/* Teacher Action Deck */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  {isGradingReady ? (
                    <>
                      <button
                        onClick={() => onOpenGradingModal(s)}
                        className="flex-1 bg-gradient-to-r from-[#5C2C90] via-[#6f33ad] to-[#E4007C] hover:opacity-95 text-white h-9 px-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer"
                        title="رصد وتصحيح الدرجة"
                      >
                        <PenTool size={13} />
                        <span>{s.isGraded ? 'تعديل الدرجة' : 'رصد الدرجة'}</span>
                      </button>

                      <button
                        onClick={() => onSendEncouragement(s.id, s.studentName)}
                        className="bg-purple-50 hover:bg-purple-100 text-[#5C2C90] border border-purple-200/80 h-9 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        title="إرسال رسالة تشجيع خاصة للطالب"
                      >
                        <MessageSquare size={13} />
                        <span>تشجيع</span>
                      </button>

                      <button
                        onClick={() => onGrantExtraMinutes(s.id, s.studentName)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 h-9 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                        title="منح 5 دقائق إضافية"
                      >
                        <Clock size={13} />
                        <span>+5 د</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onSendEncouragement(s.id, s.studentName)}
                        className="flex-1 bg-purple-50 hover:bg-[#5C2C90] hover:text-white text-[#5C2C90] border border-purple-200/80 h-9 px-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer group/btn"
                        title="إرسال رسالة تشجيع خاصة للطالب"
                      >
                        <MessageSquare size={13} />
                        <span>تشجيع</span>
                      </button>

                      <button
                        onClick={() => onGrantExtraMinutes(s.id, s.studentName)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 h-9 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                        title="منح 5 دقائق إضافية لحل التكليف"
                      >
                        <Clock size={13} />
                        <span>+5 د</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
