import React from 'react';
import { PhoneCall, PlusCircle, Printer } from 'lucide-react';

export default function SummonsTab({
  summons,
  isSocialWorker = true,
  onAddSummon,
  onDocumentOutcome,
  onPrintSummon,
}) {
  const handleAddNew = () => {
    const std = prompt('اسم الطالب:');
    const par = prompt('اسم ولي الأمر:');
    const phone = prompt('رقم هاتف ولي الأمر:', '01012345678');
    const reason = prompt('سبب الاستدعاء:', 'مناقشة الانضباط السلوكي والمظهر العام');
    if (std && par) {
      onAddSummon({
        studentName: std,
        parentName: par,
        phoneNumber: phone || '010xxxxxxxx',
        classroom: 'A1',
        reason: reason || 'متابعة شؤون الطالب',
        date: new Date().toISOString().split('T')[0],
      });
      alert('تم تسجيل موعد الاستدعاء بنجاح.');
    }
  };

  const handleOutcome = (sumId) => {
    const note = prompt('اكتب ما تم في المقابلة وتعهد ولي الأمر:');
    if (note && note.trim()) {
      onDocumentOutcome(sumId, note.trim());
      alert('تم توثيق محضر المقابلة وتعهد ولي الأمر بنجاح.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <PhoneCall className="text-[#5C2C90]" size={20} />
            <h3 className="text-base sm:text-lg font-black text-slate-900">استدعاءات ومقابلات أولياء الأمور</h3>
          </div>
          <p className="text-xs text-slate-500">
            تنظيم مواعيد مقابلة أولياء الأمور وتوثيق نتائج المقابلات وتعهدات المتابعة.
          </p>
        </div>
        {isSocialWorker && (
          <button
            onClick={handleAddNew}
            className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle size={15} />
            <span>+ تسجيل استدعاء ولي أمر</span>
          </button>
        )}
      </div>

      {summons.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-xs text-center text-slate-400 text-xs">
          لا توجد استدعاءات أولياء أمور مسجلة حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summons.map((sum) => (
            <div key={sum.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{sum.studentName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ولي الأمر: <span className="font-bold text-slate-700">{sum.parentName}</span> ({sum.phoneNumber})
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      sum.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {sum.status === 'completed' ? 'تمت المقابلة وتوثيق التعهد ✓' : 'في انتظار حضور ولي الأمر ⏳'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">موضوع وسبب الاستدعاء:</span>
                  <p className="font-medium text-slate-800 leading-relaxed">{sum.reason}</p>
                  {sum.outcomeNote && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-purple-900 font-semibold">
                      نتيجة الجلسة: {sum.outcomeNote}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">تاريخ الموعد: {sum.date}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPrintSummon(sum)}
                    className="text-[#5C2C90] hover:bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>طباعة الخطاب</span>
                  </button>
                  {sum.status !== 'completed' && (
                    <button
                      onClick={() => handleOutcome(sum.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold cursor-pointer"
                    >
                      توثيق الحضور
                    </button>
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
