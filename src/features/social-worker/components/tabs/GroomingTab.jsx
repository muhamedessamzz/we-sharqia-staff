import React from 'react';
import { Scissors, PlusCircle, Share2 } from 'lucide-react';

export default function GroomingTab({
  groomingLogs,
  isSocialWorker = true,
  onOpenAddGrooming,
  onOpenNotify,
  onResolveGrooming,
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Scissors className="text-[#5C2C90]" size={20} />
            <h3 className="text-base sm:text-lg font-black text-slate-900">سجل المظهر العام والزي المدرسي</h3>
          </div>
          <p className="text-xs text-slate-500">
            متابعة الالتزام بقواعد المظهر العام، والزي المدرسي لـ WE، والنظافة الشخصية.
          </p>
        </div>
        {isSocialWorker && (
          <button
            onClick={onOpenAddGrooming}
            className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle size={15} />
            <span>+ تسجيل مخالفة مظهر أو زي</span>
          </button>
        )}
      </div>

      {groomingLogs.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-xs text-center text-slate-400 text-xs">
          لا توجد مخالفات مظهر عام أو زي مدرسي مسجلة حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groomingLogs.map((log) => (
            <div key={log.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{log.studentName}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-mono">
                      <span className="font-bold text-[#5C2C90]">فصل {log.classroom}</span>
                      <span>•</span>
                      <span>{log.date}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      log.violationType === 'haircut'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : log.violationType === 'uniform'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {log.violationType === 'haircut' ? '✂️ قصة شعر طويلة' : log.violationType === 'uniform' ? '👔 الزي المدرسي' : '🧼 نظافة عامة'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">{log.violationTitle}</span>
                  <span className="text-slate-500 text-[11px] block">{log.actionTaken}</span>
                </div>

                <div className="text-[11px] text-slate-600 bg-purple-50/50 p-2 rounded-xl flex items-center justify-between">
                  <span>ولي الأمر: <b>{log.parentName}</b></span>
                  <span className="font-mono text-slate-500">{log.parentPhone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onOpenNotify(log, log.violationType)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={13} />
                  <span>إخطار ولي الأمر فوراً 📲</span>
                </button>

                {log.status !== 'resolved' ? (
                  <button
                    onClick={() => {
                      onResolveGrooming(log.id);
                      alert('تم توثيق التزام الطالب وتهذيب الشعر بنجاح ✓');
                    }}
                    className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 py-2 px-2.5 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer"
                    title="تم قص الشعر والالتزام"
                  >
                    ✓ تم الالتزام
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                    مكتمل ومعدل ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
