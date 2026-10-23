import React from 'react';
import { createPortal } from 'react-dom';
import { Trash2 } from 'lucide-react';

export default function DeleteStudentModal({ student, onClose, onConfirmDelete }) {
  if (!student) return null;

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 my-auto max-h-[90vh] overflow-y-auto text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
          <Trash2 size={22} />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900">حذف الطالب</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            هل تريد حذف الطالب <span className="font-bold text-slate-900">"{student.fullName}"</span> من السجلات؟
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={() => onConfirmDelete(student)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm cursor-pointer"
          >
            حذف الطالب
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
