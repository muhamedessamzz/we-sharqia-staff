import React from 'react';
import { createPortal } from 'react-dom';
import { Printer } from 'lucide-react';

export default function PrintableWarningModal({ printableWarning, onClose }) {
  if (!printableWarning) return null;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 w-full max-w-xl border border-slate-300 shadow-2xl space-y-6 text-right my-auto max-h-[90vh] overflow-y-auto print:m-0 print:p-4 print:shadow-none print:w-full"
      >
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
          <div className="text-right space-y-0.5">
            <div className="font-extrabold text-sm text-slate-900">وزارة التربية والتعليم والتعليم الفني</div>
            <div className="font-bold text-xs text-[#5C2C90]">مدرسة WE للتكنولوجيا التطبيقية بالشرقية</div>
            <div className="text-[11px] text-slate-500">إدارة شؤون الطلاب ووحدة الإرشاد الطلابي</div>
          </div>
          <img src="/Purple Code and Signal Crest.png" alt="شعار مدارس WE" className="w-12 h-12 object-contain" />
        </div>

        <div className="text-center py-2">
          <h3 className="text-lg font-black text-slate-900 underline underline-offset-4">
            {printableWarning.warningLevel === 'final'
              ? 'إنذار غياب نهائي واستدعاء ولي أمر'
              : printableWarning.warningLevel === 'second'
              ? 'إنذار غياب ثانٍ'
              : 'إنذار غياب أول'}
          </h3>
        </div>

        <div className="text-xs space-y-3 leading-relaxed text-slate-800">
          <p>
            السيد ولي أمر الطالب:{' '}
            <span className="font-black text-slate-900">{printableWarning.studentName}</span> (فصل{' '}
            {printableWarning.classroom})
          </p>
          <p>تحية طيبة وبعد،،،</p>
          <p>
            نحيطكم علمًا بأن الطالب تجاوز أيام الغياب المقررة دون عذر رسمي، وبلغ إجمالي أيام الغياب{' '}
            <span className="font-bold font-mono text-rose-600 text-sm">
              ({printableWarning.absenceDaysCount}) أيام
            </span>{' '}
            حتى تاريخ {printableWarning.lastAbsenceDate}.
          </p>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-semibold text-slate-900">
            وفقًا للائحة الانضباط المدرسي، يعد هذا الإخطار إنذارًا رسميًا. يرجى مراجعة إدارة المدرسة لتوضيح أسباب الغياب وتجنب اتخاذ الإجراءات اللائحية.
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex justify-between items-center text-xs text-center">
          <div>
            <span className="font-bold text-slate-700 block mb-6">الأخصائي الاجتماعي</span>
            <span className="text-slate-400">أ. مروة الشافعي</span>
          </div>
          <div>
            <span className="font-bold text-slate-700 block mb-6">وكيل شؤون الطلاب</span>
            <span className="text-slate-400">يعتمد / شؤون الطلاب</span>
          </div>
          <div>
            <span className="font-bold text-slate-700 block mb-6">مدير المدرسة</span>
            <span className="text-slate-400">يعتمد / مدير المدرسة</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer size={15} />
            <span>طباعة الإنذار الرسمي</span>
          </button>
          <button
            onClick={onClose}
            className="bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
