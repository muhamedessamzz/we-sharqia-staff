import React from 'react';
import { createPortal } from 'react-dom';
import { Eye, X, Check, Clock, UserCheck, Users, ShieldAlert } from 'lucide-react';

const ROLE_BADGES = {
  admin: { label: 'مسؤول النظام', color: 'bg-purple-100 text-[#5C2C90]' },
  schoolmanager: { label: 'مدير المدرسة', color: 'bg-indigo-100 text-indigo-800' },
  teacher: { label: 'معلم', color: 'bg-blue-100 text-blue-800' },
  technicalengineer: { label: 'مهندس معامل', color: 'bg-sky-100 text-sky-800' },
  studentaffairs: { label: 'شؤون الطلاب', color: 'bg-amber-100 text-amber-800' },
  socialworker: { label: 'أخصائي اجتماعي', color: 'bg-purple-100 text-purple-700' },
  assessmentcoordinator: { label: 'مسؤول امتحانات', color: 'bg-emerald-100 text-emerald-800' },
  qualitycoordinator: { label: 'مسؤول الجودة', color: 'bg-teal-100 text-teal-800' },
  it: { label: 'الدعم الفني', color: 'bg-slate-100 text-slate-800' },
};

export default function NotificationReceiptsModal({
  isOpen,
  onClose,
  notification
}) {
  if (!isOpen || !notification) return null;

  const receipts = notification.receipts || notification.Receipts || [];
  const readCount = notification.readCount ?? notification.ReadCount ?? receipts.length;
  const totalTargeted = notification.totalTargeted ?? notification.TotalTargeted ?? 14;
  const readPercent = totalTargeted > 0 ? Math.round((readCount / totalTargeted) * 100) : 0;

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-right my-auto max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold">
              <Eye size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">سجل وتفاصيل الاطلاع</h3>
              <p className="text-xs font-bold text-slate-400">قائمة الطاقم الذين فتحوا الإشعار واطلعوا عليه</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notice Summary Box */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <h4 className="text-xs font-black text-slate-900">
            {notification.title}
          </h4>
          <p className="text-[11px] text-slate-600 line-clamp-2">
            {notification.content}
          </p>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-slate-500">
              نسبة الاطلاع: <strong className="text-slate-900">{readCount} من {totalTargeted}</strong> ({readPercent}%)
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              تاريخ الإرسال: {new Date(notification.createdAtUtc).toLocaleDateString('ar-EG')}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${readPercent}%` }}
            />
          </div>
        </div>

        {/* Receipts List */}
        <div className="space-y-2">
          <h5 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
            <UserCheck size={14} className="text-emerald-600" />
            <span>الطاقم الذين اطلعوا على الإشعار ({receipts.length}):</span>
          </h5>

          {receipts.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs font-bold">
              لم يقم أي مستخدم بفتح هذا الإشعار بعد.
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {receipts.map((r) => {
                const badge = ROLE_BADGES[r.userRole?.toLowerCase()] || { label: r.userRole, color: 'bg-slate-100 text-slate-700' };
                const readDate = new Date(r.readAtUtc).toLocaleDateString('ar-EG', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={r.id}
                    className="p-3 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold text-xs">
                        {r.userName?.[0] || 'ع'}
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block leading-tight">
                          {r.userName}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5">
                            <Clock size={10} />
                            {readDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {r.acknowledgedAtUtc ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-xl shrink-0">
                        <Check size={12} className="text-emerald-600" />
                        <span>تم العلم والاطلاع</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-xl shrink-0">
                        تم الفتح
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 text-left">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
