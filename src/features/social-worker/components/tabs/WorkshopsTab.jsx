import React from 'react';

export default function WorkshopsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center text-2xl mb-2">
          🎯
        </div>
        <h4 className="font-black text-base text-slate-900">برنامج رعاية المبتكرين والنوابغ</h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          اكتشاف ودعم المتميزين في حل مسائل البرمجة والشبكات وربطهم بهاكاثونات ومبادرات WE والمصرية للاتصالات.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#E4007C] flex items-center justify-center text-2xl mb-2">
          🤝
        </div>
        <h4 className="font-black text-base text-slate-900">برنامج الأقران (Peer Tutoring)</h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          دمج الطلاب ذوي الحاجة للدعم مع زملائهم المتميزين داخل معامل الحواسيب لكسر حاجز الخجل والارتقاء بالأداء العملي.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-2">
          🌱
        </div>
        <h4 className="font-black text-base text-slate-900">جلسات الانضباط الصناعي والمهني</h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          تهيئة الطلاب لآداب وأخلاقيات سوق العمل والانضباط في شركات الاتصالات والشبكات المصرية والتزام مظهر المهندس الفني.
        </p>
      </div>
    </div>
  );
}
