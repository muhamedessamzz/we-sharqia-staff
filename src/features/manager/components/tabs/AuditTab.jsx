import React from 'react';
import { Clock } from 'lucide-react';
import { getRoleBadge } from '../../constants';

export default function AuditTab({
  auditLogs = [],
  auditRoleFilter,
  setAuditRoleFilter
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-slate-900">سجل العمليات والنشاط</h3>
          <p className="text-xs font-bold text-slate-400">متابعة زمنية للعمليات والإجراءات المنفذة في النظام.</p>
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">تصفية حسب الدور:</span>
          <select
            value={auditRoleFilter}
            onChange={(e) => setAuditRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-2xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="all">جميع العاملين</option>
            <option value="teacher">المعلمون</option>
            <option value="studentaffairs">شؤون الطلاب</option>
            <option value="socialworker">الأخصائي الاجتماعي</option>
            <option value="technicalengineer">مهندسو التدريب والمعامل</option>
            <option value="schoolmanager">مدير المدرسة</option>
          </select>
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm divide-y divide-slate-100">
        {auditLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-bold text-xs">
            لا توجد عمليات مسجلة حاليًا.
          </div>
        ) : (
          auditLogs.map((log) => {
            const roleInfo = getRoleBadge(log.userRole);
            return (
              <div key={log.id} className="py-3.5 flex items-start gap-3.5 first:pt-0 last:pb-0">
                <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#5C2C90] border border-purple-100 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Clock size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">
                        {log.userName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleInfo.bg}`}>
                        {roleInfo.label}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-slate-400">
                      {new Date(log.createdAtUtc).toLocaleDateString('ar-EG', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-700 mt-1 leading-relaxed">
                    {log.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
