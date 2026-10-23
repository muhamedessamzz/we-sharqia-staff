import React from 'react';
import { Bell, Send, AlertTriangle, Info, Clock, Eye, Trash2 } from 'lucide-react';

export default function NotificationsTab({
  notifications = [],
  onOpenSendNotification,
  onViewReceipts,
  onDeleteNotification
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-slate-900">الإشعارات المدرسية المرسلة</h3>
          <p className="text-xs font-bold text-slate-400">
            إرسال التوجيهات ومتابعة من اطلع عليها بالاسم والوقت.
          </p>
        </div>

        <button
          onClick={onOpenSendNotification}
          className="px-4 py-2.5 rounded-2xl bg-[#5C2C90] hover:bg-[#4d2477] text-white font-black text-xs shadow-md shadow-purple-950/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Send size={15} />
          <span>إرسال إشعار جديد</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90">
            <Bell size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-500">لا توجد إشعارات مرسلة حتى الآن</p>
          </div>
        ) : (
          notifications.map((n) => {
            const readPercent = n.totalTargeted > 0 ? Math.round((n.readCount / n.totalTargeted) * 100) : 0;
            const isUrgent = n.priority === 'administrative' || n.priority === 'urgent';

            return (
              <div
                key={n.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isUrgent ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                          <AlertTriangle size={11} />
                          {n.priority === 'administrative' ? 'تنبيه إداري' : 'عاجل'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          <Info size={11} />
                          إشعار عام
                        </span>
                      )}

                      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        المستهدف: {n.targetRole === 'all' ? 'جميع العاملين' : n.targetRole === 'single_user' ? `موظف محدد (${n.targetUserName})` : n.targetRole}
                      </span>

                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(n.createdAtUtc).toLocaleDateString('ar-EG', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 pt-1">
                      {n.title}
                    </h4>

                    <p className="text-xs font-medium text-slate-600 leading-relaxed max-w-3xl">
                      {n.content}
                    </p>
                  </div>

                  {/* Right: Read Receipt Stats & Actions */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 block">نسبة الاطلاع</span>
                      <span className="text-sm font-black text-slate-900">
                        {n.readCount} من إجمالي {n.totalTargeted} اطلعوا ({readPercent}%)
                      </span>
                      <div className="w-32 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${readPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewReceipts(n)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5C2C90] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>من اطلع على الإشعار؟</span>
                      </button>

                      <button
                        onClick={() => onDeleteNotification(n.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                        title="حذف الإشعار"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
