import React from 'react';
import { AlertOctagon, PlusCircle, Share2 } from 'lucide-react';

export default function DisruptionTab({
  disruptionLogs,
  isSocialWorker = true,
  onOpenAddDisruption,
  onOpenNotify,
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <AlertOctagon className="text-rose-600" size={20} />
            <h3 className="text-base sm:text-lg font-black text-slate-900">سجل الانضباط السلوكي والمخالفات</h3>
          </div>
          <p className="text-xs text-slate-500">
            توثيق المخالفات السلوكية في الفصول والمعامل وإجراءات لجنة الحماية المدرسية.
          </p>
        </div>
        {isSocialWorker && (
          <button
            onClick={onOpenAddDisruption}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle size={15} />
            <span>+ تسجيل مخالفة سلوكية</span>
          </button>
        )}
      </div>

      {disruptionLogs.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-xs text-center text-slate-400 text-xs">
          لا توجد مخالفات سلوكية مسجلة حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {disruptionLogs.map((log) => (
            <div key={log.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-base text-slate-900">{log.studentName}</h4>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      <span className="font-bold text-[#5C2C90]">فصل {log.classroom}</span> • <span>المكان: {log.location}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      log.severity === 'high'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {log.severity === 'high' ? '⚠️ مخالفة جسيمة (لجنة الحماية)' : 'مخالفة متوسطة'}
                  </span>
                </div>

                <div className="bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100 text-xs space-y-1.5">
                  <span className="font-bold text-rose-950 block">تفاصيل واقعة الشغب:</span>
                  <p className="text-slate-800 leading-relaxed font-medium">{log.incidentSummary}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-700 block mb-0.5">الإجراء التربوي واللائحي:</span>
                  <span className="text-slate-600 text-[11px] leading-relaxed">{log.disciplinaryAction}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">{log.date}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenNotify(log, 'disruption')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Share2 size={13} />
                    <span>إخطار واستدعاء ولي الأمر 📲</span>
                  </button>
                  {log.severity === 'high' && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                      مرفوع للجنة الحماية 🛡️
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
