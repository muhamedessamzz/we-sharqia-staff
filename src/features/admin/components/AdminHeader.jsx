import React from 'react';
import { UserPlus, Search, UserCheck } from 'lucide-react';

export default function AdminHeader({ onOpenCreateModal, onOpenStudentLookup, activeSection = 'users' }) {
  const sectionMeta = {
    users: {
      title: 'إدارة طاقم العمل والمستخدمين',
      desc: 'إدارة حسابات المعلمين والمهندسين والإدارة المدرسية وتخصيص الصلاحيات والمهام',
      tag: 'إدارة الحسابات'
    },
    kpis: {
      title: 'مؤشرات الحوكمة والأداء الشاملة',
      desc: 'تقارير الالتزام المباشر، ونسب الإنجاز الأكاديمي، ونشاط الفصول التسعة للمدرسة',
      tag: 'لوحة المؤشرات'
    },
    audit: {
      title: 'سجل التدقيق والرقابة (Audit Log)',
      desc: 'سجل أمني مركزي موثق لكافة الحركات والعمليات والقرارات الإدارية اللحظية بالمنظومة',
      tag: 'الأمان والرقابة'
    },
    schedule: {
      title: 'الجدول المدرسي العام ومصفوفة الإشراف',
      desc: 'توزيع الـ 375 حصة الأسبوعية وتكليفات الإشراف والاحتياطي عبر الـ 9 فصول (A1 - C2)',
      tag: 'الجدول المعتمد'
    },
    attendance: {
      title: 'سجل رقابة حضور وغياب الاستف',
      desc: 'متابعة حوكمة انضباط الطاقم المدرسي الموثقة رسمياً بمعرفة إدارة الموارد البشرية (HR)',
      tag: 'رقابة الحضور (HR)'
    }
  };

  const current = sectionMeta[activeSection] || sectionMeta.users;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-50 text-[#5C2C90] border border-purple-200/80">
            {current.tag}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {current.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          {current.desc}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {onOpenStudentLookup && (
          <button
            onClick={onOpenStudentLookup}
            className="bg-purple-50 hover:bg-purple-100 text-[#5C2C90] border border-purple-200/80 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
            title="البحث عن أي طالب واستعراض البروفايل الشامل (الغياب، التسليمات، تفاعل المنصة، وسجل الأخصائي)"
          >
            <Search size={15} />
            <span>استعلام بروفايل طالب</span>
          </button>
        )}

        <button
          onClick={onOpenCreateModal}
          className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <UserPlus size={16} />
          <span>إضافة عضو جديد</span>
        </button>
      </div>
    </div>
  );
}
