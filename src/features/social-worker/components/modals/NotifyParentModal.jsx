import React from 'react';
import { createPortal } from 'react-dom';
import { Share2 } from 'lucide-react';

export default function NotifyParentModal({
  modalData,
  message,
  onMessageChange,
  onPhoneChange,
  onSendWhatsApp,
  onSendToPortal,
  onClose,
}) {
  if (!modalData) return null;

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg border border-slate-200 shadow-2xl space-y-4 text-right my-auto max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Share2 size={20} />
            </div>
            <div>
              <h4 className="font-black text-base text-slate-900">إخطار ولي الأمر</h4>
              <p className="text-xs text-slate-500">
                الطالب: {modalData.studentName} (فصل {modalData.classroom})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 font-bold flex items-center justify-center text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-600">اسم ولي الأمر:</span>
            <span className="font-bold text-slate-900">{modalData.parentName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-600">رقم الهاتف المسجل:</span>
            <input
              type="text"
              value={modalData.phone || ''}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold text-emerald-700 text-left"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>نص الرسالة:</span>
            <span className="text-[11px] text-[#5C2C90]">يمكنك تعديل النص قبل الإرسال</span>
          </label>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5C2C90] focus:bg-white leading-relaxed font-medium"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={onSendWhatsApp}
            className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-900/15 cursor-pointer"
          >
            <span>إرسال عبر واتساب</span>
          </button>
          <button
            onClick={onSendToPortal}
            className="w-full sm:flex-1 bg-[#5C2C90] hover:bg-[#4a2175] text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-900/15 cursor-pointer"
          >
            <span>إرسال إلى منصة ولي الأمر</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
