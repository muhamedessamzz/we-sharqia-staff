import React from 'react';
import { Zap, Plus, RefreshCw, Printer } from 'lucide-react';

export default function HeaderActions({
  onOpenBulkAdd,
  onOpenAddSingle,
  onSyncFromFile,
  syncing,
  onPrint,
}) {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
          شؤون الطلاب وقوائم الفصول
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          إدارة بيانات الطلاب وتوزيع الفصول ومتابعة السجلات المدرسية
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onOpenBulkAdd}
          className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Zap size={15} />
          <span>إضافة مجموعة طلاب</span>
        </button>

        <button
          onClick={onOpenAddSingle}
          className="bg-white hover:bg-purple-50 text-[#5C2C90] border border-purple-200 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus size={15} />
          <span>+ إضافة طالب</span>
        </button>

        <button
          onClick={onSyncFromFile}
          disabled={syncing}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-200 cursor-pointer"
          title="تحديث بيانات الطلاب من ملف السجلات"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin text-[#5C2C90]' : ''} />
          <span>{syncing ? 'جارٍ التحديث...' : 'تحديث من الملف'}</span>
        </button>

        <button
          onClick={onPrint}
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Printer size={14} />
          <span className="hidden sm:inline">طباعة الكشف</span>
        </button>
      </div>
    </div>
  );
}
