import React from 'react';
import { 
  Users, ShieldCheck, Mail, Phone, Edit3, Trash2, 
  PlayCircle, PauseCircle, CheckCircle, Ban, User, Eye, FileText
} from 'lucide-react';
import { ROLE_BADGES, getSpecialtyConfig, getRoleBadgeInfo } from '../constants';

export default function AdminUserTable({
  users,
  loading,
  onOpenEdit,
  onViewProfile,
  onUpdateStatus,
  onDeleteUser,
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-black text-sm sm:text-base text-slate-900">
          طاقم العمل والمستخدمين ({users.length})
        </h3>
        <span className="text-xs text-slate-400">
          انقر على أي عضو لعرض ملفه الشامل وصلاحياته
        </span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          <div className="w-8 h-8 mx-auto border-2 border-purple-200 border-t-[#5C2C90] rounded-full animate-spin mb-3"></div>
          جارٍ تحميل بيانات المستخدمين...
        </div>
      ) : users.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs space-y-2">
          <Users size={32} className="mx-auto text-slate-300 mb-1" />
          <p>لا يوجد مستخدمون يطابقون البحث.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">الاسم وبيانات الاتصال</th>
                <th className="py-3.5 px-4">اسم المستخدم</th>
                <th className="py-3.5 px-4">الدور والصلاحية</th>
                <th className="py-3.5 px-4">الفصول المسندة</th>
                <th className="py-3.5 px-4 text-center">حالة الحساب</th>
                <th className="py-3.5 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u, idx) => {
                const roleBadge = getRoleBadgeInfo(u);
                const isSuspended = u.status === 'suspended';
                // Clean name from redundant role/title parentheses e.g. "م. أحمد حسام (مهندس ذكاء اصطناعي)" -> "م. أحمد حسام"
                const cleanFullName = u.fullName ? u.fullName.replace(/\s*\([^)]*\)\s*$/i, '').trim() : u.username;

                return (
                  <tr key={u.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div 
                        onClick={() => onViewProfile && onViewProfile(u)}
                        className="flex items-center gap-2.5 cursor-pointer group/name"
                      >
                        <div className="w-8 h-8 rounded-xl bg-purple-100 group-hover/name:bg-[#5C2C90] text-[#5C2C90] group-hover/name:text-white font-black text-xs flex items-center justify-center shrink-0 transition-colors">
                          {cleanFullName ? cleanFullName[0] : 'ع'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold group-hover/name:text-[#5C2C90] transition-colors">{cleanFullName}</span>
                            {u.isSuperAdmin && (
                              <span title="مسؤول النظام الرئيسي">
                                <ShieldCheck size={14} className="text-[#5C2C90]" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                            {u.email && <span>{u.email}</span>}
                            {u.phoneNumber && <span>• {u.phoneNumber}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                      @{u.username}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block font-bold text-xs px-3 py-1 rounded-full border shadow-2xs ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {u.classroom ? (
                        <span className="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 text-[11px]">
                          {u.classroom}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">جميع الفصول</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block font-bold text-[11px] px-2.5 py-0.5 rounded-full border ${
                          isSuspended
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {isSuspended ? 'موقوف' : 'نشط'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Full 360 Profile Dossier Button */}
                        <button
                          id={`btn-staff-dossier-${idx}`}
                          onClick={() => onViewProfile && onViewProfile(u)}
                          className="px-2.5 py-1 text-xs font-bold text-[#5C2C90] bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                          title="عرض الملف المهني الشامل (الحصص، التكليفات، التصحيح، الحضور، والتقييم)"
                        >
                          <FileText size={13} />
                          <span>الملف الشامل</span>
                        </button>

                        {isSuspended ? (
                          <button
                            onClick={() => onUpdateStatus(u.id, 1, u.fullName)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                            title="تفعيل الحساب"
                          >
                            <PlayCircle size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateStatus(u.id, 3, u.fullName)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                            title="إيقاف الحساب"
                          >
                            <PauseCircle size={15} />
                          </button>
                        )}

                        <button
                          onClick={() => onOpenEdit(u)}
                          className="p-1.5 text-slate-500 hover:text-[#5C2C90] hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                          title="تعديل الحساب"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          onClick={() => onDeleteUser(u.id, u.fullName)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="حذف الحساب"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
