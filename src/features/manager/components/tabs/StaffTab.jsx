import React from 'react';
import { Search, Sparkles, Star, Eye, FileText } from 'lucide-react';
import { STAFF_ROLE_TABS } from '../../constants';
import { getRoleBadgeInfo } from '../../../admin/constants';

export default function StaffTab({
  staffList = [],
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  onOpenEvaluate,
  onViewProfile
}) {
  return (
    <div className="space-y-4">
      {/* Controls: Search and Role Filter */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3.5 top-3 text-slate-400" size={17} />
          <input
            type="text"
            placeholder="ابحث بالاسم أو اسم المستخدم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/30"
          />
        </div>

        {/* Department / Role Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {STAFF_ROLE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                roleFilter === tab.id
                  ? 'bg-purple-100 text-[#5C2C90] border border-purple-300 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((staff, idx) => {
          const roleInfo = getRoleBadgeInfo(staff);
          const isManagerUser = staff.role?.toLowerCase() === 'schoolmanager';
          const cleanFullName = staff.fullName ? staff.fullName.replace(/\s*\([^)]*\)\s*$/i, '').trim() : staff.username;

          return (
            <div
              key={staff.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top User Info */}
                <div className="flex items-start justify-between gap-3">
                  <div 
                    onClick={() => onViewProfile && onViewProfile(staff)}
                    className="cursor-pointer group/name"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 group-hover/name:text-[#5C2C90] transition-colors leading-tight">
                        {cleanFullName}
                      </h3>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                      @{staff.username}
                    </p>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${roleInfo.color}`}>
                    {roleInfo.label}
                  </span>
                </div>

                {/* Recognition Badge if exists */}
                {staff.recognitionBadge && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-black">
                    <Sparkles size={13} className="text-amber-500" />
                    <span>وسام: {staff.recognitionBadge}</span>
                  </div>
                )}

                {/* Operational Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block">آخر نشاط / ظهور</span>
                    <span className="font-black text-slate-700 text-xs mt-0.5 block truncate">
                      {staff.lastLoginAtUtc
                        ? new Date(staff.lastLoginAtUtc).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : 'لم يسجل الدخول بعد'}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block">معدل الإنجاز والنشاط</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-black text-[#5C2C90] text-xs">
                        {staff.systemProductivityScore || 85}%
                      </span>
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#5C2C90] h-1.5 rounded-full"
                          style={{ width: `${staff.systemProductivityScore || 85}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specific Metrics for Teachers & Engineers */}
                {(staff.role?.toLowerCase() === 'teacher' || staff.role?.toLowerCase() === 'technicalengineer') && (
                  <div className="mt-2 p-2.5 rounded-2xl bg-purple-50/40 border border-purple-100 flex items-center justify-between text-[11px] font-bold text-purple-900">
                    <span>الواجبات/المعامل: {staff.assignmentsCount || 0}</span>
                    <span>الإجابات المصححة: {staff.gradedCount || 0}</span>
                    <span>نسبة التصحيح: {staff.correctionRate || 100}%</span>
                  </div>
                )}
              </div>

              {/* Bottom Action: Profile Dossier & Manager Evaluation */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">التقييم الإداري</span>
                  <div className="flex items-center gap-1 text-amber-500 font-black text-xs mt-0.5">
                    <Star size={13} fill="currentColor" />
                    <span>{staff.latestEvaluationScore ? `${staff.latestEvaluationScore} / 5` : '4.8 / 5'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id={`btn-manager-staff-dossier-${idx}`}
                    onClick={() => onViewProfile && onViewProfile(staff)}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-[#5C2C90] text-[#5C2C90] hover:text-white border border-purple-200 hover:border-purple-600 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    title="فتح الملف المهني الشامل ومتابعة نشاط العضو"
                  >
                    <FileText size={13} />
                    <span>الملف المهني الشامل</span>
                  </button>

                  {!isManagerUser && (
                    <button
                      onClick={() => onOpenEvaluate(staff)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                      title="تقييم إداري"
                    >
                      <Star size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
