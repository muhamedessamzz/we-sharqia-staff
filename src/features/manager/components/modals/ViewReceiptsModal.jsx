import React from 'react';
import { createPortal } from 'react-dom';
import { Eye, X, Check } from 'lucide-react';

export default function ViewReceiptsModal({ notice, onClose }) {
  if (!notice) return null;

  const receipts = notice.receipts || [];

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-right my-auto max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Eye size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">سجل الاطلاع وتأكيد الاستلام</h3>
              <p className="text-xs font-bold text-slate-400 truncate max-w-xs">{notice.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-2 max-h-80 overflow-y-auto divide-y divide-slate-100">
          {receipts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-bold">
              لم يطّلع أحد على هذا الإشعار بعد.
            </div>
          ) : (
            receipts.map((r) => (
              <div key={r.id} className="py-2.5 flex items-center justify-between first:pt-0">
                <div>
                  <span className="text-xs font-black text-slate-900 block">{r.userName}</span>
                  <span className="text-[10px] text-slate-400 font-bold block">{r.userRole}</span>
                </div>

                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold block">
                    اطّلع: {new Date(r.readAtUtc).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {r.acknowledgedAtUtc ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-0.5">
                      <Check size={10} />
                      أكّد الاطلاع
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold block">لم يؤكد بعد</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
