import React from 'react';
import { Send } from 'lucide-react';

export default function ManagerHeader({ onOpenSendNotification }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#3D1466] via-[#5C2C90] to-[#7A3EAE] text-white p-6 sm:p-8 shadow-xl shadow-purple-950/15">
      <div className="absolute top-0 left-0 -mt-8 -ml-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            متابعة العاملين والإشعارات المدرسية
          </h1>
          <p className="text-purple-100/90 text-xs sm:text-sm font-medium leading-relaxed">
            متابعة أداء المعلمين والإداريين، والاطلاع على سجل العمليات، وإرسال التنبيهات المدرسية مع متابعة تأكيد الاطلاع.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenSendNotification}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-purple-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-950/20 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Send size={16} />
            <span>إرسال إشعار جديد</span>
          </button>
        </div>
      </div>
    </div>
  );
}
