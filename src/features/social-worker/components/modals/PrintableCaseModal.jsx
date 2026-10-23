import React from 'react';
import { createPortal } from 'react-dom';
import { Printer } from 'lucide-react';
import { GRADE_NAMES, STATUS_CONFIG } from '../../constants';

export default function PrintableCaseModal({ printableCase, onClose, counselorName }) {
  if (!printableCase) return null;

  const handlePrint = () => {
    window.print();
  };

  let notes = [];
  try {
    notes = JSON.parse(printableCase.notesJson || '[]');
  } catch (e) {}

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 w-full max-w-2xl border border-slate-300 shadow-2xl space-y-6 text-right my-auto max-h-[90vh] overflow-y-auto print:m-0 print:p-4 print:shadow-none print:w-full"
      >
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
          <div className="text-right space-y-0.5">
            <div className="font-extrabold text-sm text-slate-900">وزارة التربية والتعليم والتعليم الفني</div>
            <div className="font-bold text-xs text-slate-700">قطاع التعليم الفني والتطبيقي</div>
            <div className="font-bold text-xs text-[#5C2C90]">مدرسة WE للتكنولوجيا التطبيقية - فرع الشرقية</div>
          </div>
          <div className="text-center">
            <img src="/Purple Code and Signal Crest.png" alt="شعار مدارس WE" className="w-12 h-12 mx-auto object-contain" />
            <span className="text-[10px] font-black text-slate-500 block mt-1">وحدة الإرشاد الطلابي</span>
          </div>
          <div className="text-left space-y-0.5 text-xs text-slate-600 font-mono">
            <div>التاريخ: {new Date().toLocaleDateString('ar-EG')}</div>
            <div>رقم الملف: #{printableCase.id.substring(0, 8)}</div>
            <div>الحالة: {STATUS_CONFIG[printableCase.status]?.label || 'مفتوح'}</div>
          </div>
        </div>

        <div className="text-center py-1">
          <h3 className="text-lg font-black text-slate-900 underline underline-offset-4">
            استمارة دراسة حالة
          </h3>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-bold text-slate-500">اسم الطالب:</span>{' '}
              <span className="font-black text-slate-900">{printableCase.studentName}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500">الصف والفصل:</span>{' '}
              <span className="font-bold text-[#5C2C90]">
                {GRADE_NAMES[printableCase.grade] || 'الأول'} - فصل {printableCase.classroom}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-bold text-slate-500">الأخصائي القائم بالبحث:</span>{' '}
              <span className="font-bold text-slate-800">{counselorName || 'أ. مروة الشافعي'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500">تاريخ فتح الملف:</span>{' '}
              <span className="font-mono text-slate-700">
                {new Date(printableCase.createdAtUtc).toLocaleDateString('ar-EG')}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="font-extrabold text-xs text-slate-800">بيان الجلسات والمتابعات التربوية:</h5>
          <div className="space-y-2 text-xs">
            {notes.map((n, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex justify-between font-bold text-[11px] text-[#5C2C90]">
                  <span>جلسة رقم ({idx + 1}): {n.type}</span>
                  <span className="font-mono text-slate-400">{n.date}</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">{n.note}</p>
                {n.actionPlan && (
                  <div className="text-emerald-800 font-semibold">
                    <span className="font-bold">خطة التدخل:</span> {n.actionPlan}
                  </div>
                )}
                {n.recommendation && (
                  <div className="text-purple-900 font-semibold">
                    <span className="font-bold">التوصية:</span> {n.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <span className="font-bold text-slate-700 block mb-6">الأخصائي الاجتماعي / النفسي</span>
            <span className="text-slate-400">........................</span>
          </div>
          <div>
            <span className="font-bold text-slate-700 block mb-6">وكيل شؤون الطلاب</span>
            <span className="text-slate-400">........................</span>
          </div>
          <div>
            <span className="font-bold text-slate-700 block mb-6">مدير المدرسة</span>
            <span className="text-slate-400">........................</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer size={15} />
            <span>طباعة الاستمارة</span>
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
