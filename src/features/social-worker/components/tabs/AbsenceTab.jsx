import React from 'react';
import { Calendar, PlusCircle, Share2, Printer } from 'lucide-react';

export default function AbsenceTab({
  absenceLogs,
  isSocialWorker = true,
  onOpenAddAbsence,
  onOpenNotify,
  onPrintWarning,
  onViewStudentProfile,
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Calendar className="text-[#5C2C90]" size={20} />
            <h3 className="text-base sm:text-lg font-black text-slate-900">سجل الغياب والإنذارات</h3>
          </div>
          <p className="text-xs text-slate-500">
            متابعة حالات الغياب المتصل والمنفصل، وإصدار إنذارات الغياب وفقًا للائحة الانضباط المدرسي.
          </p>
        </div>
        {isSocialWorker && (
          <button
            onClick={onOpenAddAbsence}
            className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle size={15} />
            <span>+ تسجيل حالة غياب</span>
          </button>
        )}
      </div>

      {absenceLogs.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-xs text-center text-slate-400 text-xs">
          لا توجد حالات غياب أو إنذارات مسجلة حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {absenceLogs.map((log) => (
            <div key={log.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div 
                    onClick={() => onViewStudentProfile && onViewStudentProfile(log)}
                    className="cursor-pointer group/abs"
                    title="فتح البروفايل الشامل للطالب"
                  >
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-base text-slate-900 group-hover/abs:text-[#5C2C90] transition-colors">
                        {log.studentName}
                      </h4>
                      <span className="text-[10px] font-bold text-[#5C2C90] bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200/60 opacity-0 group-hover/abs:opacity-100 transition-opacity">
                        بروفايل 👤
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">فصل {log.classroom}</span>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      log.warningLevel === 'final'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : log.warningLevel === 'second'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                    }`}
                  >
                    {log.warningLevel === 'final'
                      ? '🔴 إنذار نهائي / فصل'
                      : log.warningLevel === 'second'
                      ? '🟠 إنذار غياب ثانٍ'
                      : '🟡 إنذار غياب أول'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <div>
                    <span className="text-2xl font-black text-rose-600 block">{log.absenceDaysCount}</span>
                    <span className="text-[10px] text-slate-500 font-bold">إجمالي أيام الغياب</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-amber-600 block">{log.consecutiveDays}</span>
                    <span className="text-[10px] text-slate-500 font-bold">أيام متصلة</span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-bold block mb-0.5">الإجراء المتخذ:</span>
                  <span className="text-slate-600 leading-relaxed text-[11px]">{log.actionTaken}</span>
                </div>

                <div className="text-[11px] text-slate-600 flex items-center justify-between">
                  <span>ولي الأمر: <b>{log.parentName}</b></span>
                  <span className="font-mono text-slate-500">{log.parentPhone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onViewStudentProfile && onViewStudentProfile(log)}
                  className="bg-purple-50 hover:bg-purple-100 text-[#5C2C90] py-2 px-3 rounded-xl text-xs font-bold border border-purple-200/80 cursor-pointer transition-colors"
                  title="البروفايل الشامل للطالب"
                >
                  البروفايل 👤
                </button>
                <button
                  onClick={() => onOpenNotify(log, 'absence')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={13} />
                  <span>إخطار بالغياب 📲</span>
                </button>
                <button
                  onClick={() => onPrintWarning(log)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl border border-slate-200 cursor-pointer"
                  title="طباعة إنذار رسمي"
                >
                  <Printer size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
