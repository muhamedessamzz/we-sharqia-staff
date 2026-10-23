import React from 'react';
import { 
  Bell, AlertTriangle, Info, ShieldAlert, Clock, 
  Eye, Trash2, Users, User, Building, CheckCircle2 
} from 'lucide-react';

export default function NotificationCard({
  notification,
  onViewReceipts,
  onDelete
}) {
  const readCount = notification.readCount ?? notification.ReadCount ?? (notification.receipts?.length || 0);
  const totalTargeted = notification.totalTargeted ?? notification.TotalTargeted ?? 14;
  const readPercent = totalTargeted > 0 ? Math.round((readCount / totalTargeted) * 100) : 0;
  const isUrgent = notification.priority === 'urgent' || notification.priority === 'administrative';

  const isSingleUser = notification.targetRole === 'single_user';
  const isAll = notification.targetRole === 'all' || notification.targetRole === 'all_school';

  return (
    <div className={`bg-white rounded-3xl border p-5 shadow-xs hover:shadow-md transition-all ${
      notification.priority === 'administrative' 
        ? 'border-rose-200/90 bg-gradient-to-r from-rose-50/20 via-white to-white' 
        : notification.priority === 'urgent'
        ? 'border-amber-200/90 bg-gradient-to-r from-amber-50/20 via-white to-white'
        : 'border-slate-200/80'
    }`}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left Content Area (Right in RTL) */}
        <div className="space-y-2 flex-1">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {notification.priority === 'administrative' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                <ShieldAlert size={12} />
                <span>تنبيه إداري رسمي</span>
              </span>
            ) : notification.priority === 'urgent' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs">
                <AlertTriangle size={12} />
                <span>عاجل وهام</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                <Info size={12} />
                <span>إشعار عام</span>
              </span>
            )}

            {/* Target Audience Badge */}
            {isAll ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                <Users size={12} />
                <span>جميع العاملين بالمدرسة (الطاقم بالكامل)</span>
              </span>
            ) : isSingleUser ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                <User size={12} />
                <span>موظف محدد: {notification.targetUserName || 'عضو من الاستف'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                <Building size={12} />
                <span>قسم: {notification.targetRole}</span>
              </span>
            )}

            {/* Requires Acknowledgment */}
            {notification.requiresAcknowledgment && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={11} className="text-emerald-600" />
                <span>مطلوب تأكيد الاطلاع</span>
              </span>
            )}

            {/* Time */}
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mr-auto">
              <Clock size={11} />
              {new Date(notification.createdAtUtc).toLocaleDateString('ar-EG', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-sm font-black text-slate-900 pt-0.5">
            {notification.title}
          </h4>

          {/* Message Content */}
          <p className="text-xs font-medium text-slate-600 leading-relaxed max-w-3xl whitespace-pre-line">
            {notification.content}
          </p>

          {/* Sender metadata */}
          <div className="pt-1 text-[10px] text-slate-400 font-bold">
            المرسل: <span className="text-slate-700 font-extrabold">{notification.senderName || 'مسؤول النظام'}</span>
          </div>
        </div>

        {/* Right Stats and Actions (Left in RTL) */}
        <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 min-w-[160px]">
          {/* Read Progress */}
          <div className="text-right w-full">
            <span className="text-[10px] font-bold text-slate-400 block mb-0.5">نسبة الاطلاع:</span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-black text-slate-900">
                {readCount} من أصل {totalTargeted}
              </span>
              <span className="text-[10px] font-bold text-emerald-700">
                {readPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all"
                style={{ width: `${readPercent}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onViewReceipts(notification)}
              className="flex items-center gap-1.5 text-xs font-black text-[#5C2C90] bg-purple-50 hover:bg-purple-100 border border-purple-200/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              title="عرض قائمة من اطلعوا"
            >
              <Eye size={14} />
              <span>من اطلعوا ({readCount})</span>
            </button>

            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="حذف الإشعار"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
