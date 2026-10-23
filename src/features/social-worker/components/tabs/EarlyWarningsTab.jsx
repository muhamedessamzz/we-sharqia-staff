import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function EarlyWarningsTab({ earlyWarnings, isSocialWorker = true, onIntakeCase, onViewStudentProfile }) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl flex items-start gap-3">
        <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold block mb-0.5">نظام المتابعة المبكرة للطلاب:</span>
          <span>
            يرصد النظام الطلاب الذين طلبوا مساعدة في التكليفات أو تأخروا في التسليم، لمساعدة الأخصائي الاجتماعي على تقديم الدعم المناسب في الوقت المناسب.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {(earlyWarnings || []).map((w) => (
          <div
            key={w.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div 
                onClick={() => onViewStudentProfile && onViewStudentProfile(w)}
                className="cursor-pointer group/w"
                title="فتح البروفايل الشامل للطالب"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-slate-900 group-hover/w:text-[#5C2C90] transition-colors">
                    {w.studentName}
                  </h4>
                  <span className="text-[10px] font-bold text-[#5C2C90] bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200/60 opacity-0 group-hover/w:opacity-100 transition-opacity">
                    بروفايل 👤
                  </span>
                </div>
                <span className="text-xs text-[#5C2C90] font-mono block mb-2">فصل {w.classroom}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl text-xs border border-slate-100">
                <span className="font-bold block text-slate-700">{w.assignmentTitle}</span>
                <span className="text-pink-700 text-[11px] block mt-0.5">{w.helpType || 'طلب توجيه أكاديمي'}</span>
              </div>
            </div>
            
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => onViewStudentProfile && onViewStudentProfile(w)}
                className="w-full bg-purple-50 hover:bg-purple-100 text-[#5C2C90] py-1.5 rounded-xl text-xs font-bold border border-purple-200 cursor-pointer transition-colors"
              >
                عرض البروفايل الشامل 👤
              </button>

              {isSocialWorker ? (
                <button
                  onClick={() => onIntakeCase(w)}
                  className="w-full bg-[#5C2C90] hover:bg-[#4a2175] text-white py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  فتح ملف حالة
                </button>
              ) : (
                <div className="w-full text-center py-1.5 px-2 rounded-xl bg-slate-50 text-slate-600 text-[11px] font-bold border border-slate-200">
                  متاح لمتابعة الأخصائي
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
