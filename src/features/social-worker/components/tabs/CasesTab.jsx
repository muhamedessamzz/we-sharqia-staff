import React, { useState } from 'react';
import { Search, PlusCircle, Trash2, Printer, Share2, HeartHandshake } from 'lucide-react';
import { STATUS_CONFIG } from '../../constants';

export default function CasesTab({
  cases,
  isSocialWorker = true,
  onOpenNewCase,
  onOpenFollowup,
  onOpenNotify,
  onPrintCase,
  onDeleteCase,
  onViewStudentProfile,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCases = (cases || []).filter((c) => {
    const matchesSearch = !searchQuery.trim() || (c.studentName && c.studentName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="بحث باسم الطالب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#5C2C90] w-52 sm:w-64"
            />
            <Search size={14} className="absolute right-3 top-2.5 text-slate-400" />
          </div>
          {isSocialWorker && (
            <button
              onClick={onOpenNewCase}
              className="bg-[#5C2C90] hover:bg-[#4a2175] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <PlusCircle size={14} />
              <span>+ فتح ملف حالة</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-[#5C2C90] text-white shadow-xs' : 'bg-slate-50 text-slate-600'
            }`}
          >
            الكل ({cases?.length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('open')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
              statusFilter === 'open' ? 'bg-[#E4007C] text-white shadow-xs' : 'bg-slate-50 text-slate-600'
            }`}
          >
            جديدة ({cases?.filter((c) => c.status === 'open').length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('inSupport')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
              statusFilter === 'inSupport' ? 'bg-purple-700 text-white shadow-xs' : 'bg-slate-50 text-slate-600'
            }`}
          >
            قيد الدعم
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
              statusFilter === 'resolved' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-50 text-slate-600'
            }`}
          >
            تحسن ملحوظ
          </button>
        </div>
      </div>

      {filteredCases.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 text-[#5C2C90] flex items-center justify-center mb-3">
            <HeartHandshake size={28} />
          </div>
          <h4 className="text-sm font-bold text-slate-800">لا توجد حالات إرشادية مسجلة حاليًا</h4>
          <p className="text-xs text-slate-500 mt-1">
            {isSocialWorker
              ? 'يمكنك فتح ملف دراسة حالة جديدة للطلاب الذين يحتاجون إلى متابعة ودعم.'
              : 'يمكنك متابعة وتصفح سجلات الحالات الإرشادية فور تسجيلها من قِبل الأخصائي الاجتماعي.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCases.map((c) => {
            const statusCfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.open;
            let notes = [];
            try {
              notes = JSON.parse(c.notesJson || '[]');
            } catch (e) {}

            return (
              <div key={c.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        onClick={() => onViewStudentProfile && onViewStudentProfile(c)}
                        className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#5C2C90] to-[#E4007C] text-white font-black text-sm flex items-center justify-center shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                        title="فتح البروفايل الشامل للطالب"
                      >
                        {c.studentName ? c.studentName.substring(0, 2) : 'ط'}
                      </div>
                      <div 
                        onClick={() => onViewStudentProfile && onViewStudentProfile(c)}
                        className="cursor-pointer group/st"
                        title="فتح البروفايل الشامل للطالب"
                      >
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-black text-sm sm:text-base text-slate-900 group-hover/st:text-[#5C2C90] transition-colors">
                            {c.studentName}
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-50 text-[#5C2C90] border border-purple-200/60 opacity-0 group-hover/st:opacity-100 transition-opacity">
                            البروفايل 👤
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">فصل {c.classroom}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                      <button
                        onClick={() => onDeleteCase(c.id, c.studentName)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>الجلسات التراكمية ({notes.length}):</span>
                      <button
                        onClick={() => onPrintCase(c)}
                        className="text-[#5C2C90] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Printer size={12} />
                        <span>طباعة الاستمارة</span>
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {notes.map((n, idx) => (
                        <div key={idx} className="bg-slate-50 p-2.5 rounded-xl text-xs border border-slate-100">
                          <div className="flex justify-between font-bold text-[#5C2C90] text-[11px] mb-0.5">
                            <span>{n.type}</span>
                            <span className="font-mono text-slate-400">{n.date}</span>
                          </div>
                          <p className="text-slate-700">{n.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onViewStudentProfile && onViewStudentProfile(c)}
                    className="bg-purple-50 hover:bg-purple-100 text-[#5C2C90] py-2 px-3 rounded-xl text-xs font-bold border border-purple-200/80 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    title="البروفايل الشامل للطالب (غياب، مشاكل وسلوك، تسليمات وتفاعل المنصة)"
                  >
                    <span>البروفايل الشامل 👤</span>
                  </button>

                  {isSocialWorker && (
                    <button
                      onClick={() => onOpenFollowup(c)}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-800 py-2 px-3 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer"
                    >
                      + إضافة جلسة متابعة
                    </button>
                  )}
                  <button
                    onClick={() =>
                      onOpenNotify(
                        { studentName: c.studentName, parentName: 'ولي الأمر', parentPhone: '01012345678' },
                        'counseling'
                      )
                    }
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-2 px-3 rounded-xl text-xs font-bold border border-emerald-200 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Share2 size={13} /> إخطار ولي الأمر
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
