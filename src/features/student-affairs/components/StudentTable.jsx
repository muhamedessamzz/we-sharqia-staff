import React, { useState } from 'react';
import { 
  Users, CheckCircle2, Edit2, Trash2, 
  Eye, EyeOff, Copy, Check, Phone, 
  Sparkles 
} from 'lucide-react';
import { GRADE_NAMES } from '../constants';

export default function StudentTable({
  students,
  loading,
  gradeFilter,
  classFilter,
  onEditStudent,
  onDeleteStudent,
  onSyncFromFile,
  onViewStudentProfile,
}) {
  // Local state to track which student national IDs are revealed (default hidden)
  const [revealedMap, setRevealedMap] = useState({});
  const [revealAll, setRevealAll] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const toggleRowReveal = (studentId) => {
    setRevealedMap(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const toggleRevealAll = () => {
    const nextState = !revealAll;
    setRevealAll(nextState);
    if (!nextState) {
      setRevealedMap({});
    }
  };

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
      {/* Top Header Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-white via-slate-50/50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold shadow-xs">
            <Users size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                قائمة الطلاب
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#5C2C90] text-white shadow-xs">
                {students.length} طالب
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle All National IDs */}
          <button
            onClick={toggleRevealAll}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              revealAll
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
            }`}
            title={revealAll ? 'إخفاء كافة الأرقام القومية' : 'إظهار كافة الأرقام القومية'}
          >
            {revealAll ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{revealAll ? 'إخفاء الأرقام القومية' : 'إظهار الأرقام القومية'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs">
          <div className="w-9 h-9 mx-auto border-3 border-purple-200 border-t-[#5C2C90] rounded-full animate-spin mb-3"></div>
          <p className="font-bold text-slate-600">جارٍ مزامنة وتحميل بيانات الطلاب...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="p-16 text-center text-slate-400 text-xs space-y-3">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Users size={28} />
          </div>
          <p className="text-sm font-bold text-slate-600">لا توجد بيانات مطابقة للبحث أو التصفية الحالية.</p>
          <button
            onClick={onSyncFromFile}
            className="inline-flex items-center gap-1.5 bg-[#5C2C90] text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#4a2275] transition-all cursor-pointer shadow-xs"
          >
            <Sparkles size={14} />
            <span>تحديث البيانات من الملف المدرسي</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] sm:text-xs text-slate-600 font-black">
                <th className="py-3.5 px-3 w-10 text-center">#</th>
                <th className="py-3.5 px-3 min-w-[220px]">بيانات الطالب والتواصل</th>
                <th className="py-3.5 px-3 text-center min-w-[110px]">كود الطالب</th>
                <th className="py-3.5 px-3 text-center min-w-[190px]">الرقم القومي</th>
                <th className="py-3.5 px-3 text-center min-w-[150px]">المرحلة الدراسية</th>
                <th className="py-3.5 px-3 text-center min-w-[85px]">الفصل</th>
                <th className="py-3.5 px-3 text-center min-w-[95px]">الموافقة</th>
                <th className="py-3.5 px-3 text-center min-w-[80px]">الحالة</th>
                <th className="py-3.5 px-3 text-center w-20">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90 text-xs">
              {students.map((st, idx) => {
                const isRevealed = revealAll || !!revealedMap[st.id];
                const realNatId = st.nationalId || (st.password && st.password.length === 14 ? st.password : null);
                const displayNatId = isRevealed && realNatId ? realNatId : (st.nationalIdMasked || '••••••••••••••');

                return (
                  <tr 
                    key={st.id || idx} 
                    className="hover:bg-purple-50/35 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-3.5 px-3 text-center font-bold text-slate-400 group-hover:text-purple-700">
                      {idx + 1}
                    </td>

                    {/* Student Full Name & Phones */}
                    <td className="py-3.5 px-3">
                      <div 
                        onClick={() => onViewStudentProfile && onViewStudentProfile(st)}
                        className="flex items-center gap-3 cursor-pointer group/stname"
                      >
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#5C2C90] to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs group-hover/stname:scale-105 group-hover/stname:shadow-md transition-all">
                          {st.fullName ? st.fullName.trim()[0] : 'ط'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-slate-900 group-hover/stname:text-[#5C2C90] text-xs sm:text-sm truncate transition-colors">
                            {st.fullName}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            {st.phoneNumber && (
                              <span 
                                className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md hover:bg-slate-200 transition-colors"
                                title="هاتف الطالب"
                              >
                                <Phone size={10} className="text-slate-400" />
                                <span>{st.phoneNumber}</span>
                              </span>
                            )}
                            {st.parentPhone && (
                              <span 
                                className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-900 bg-purple-50 border border-purple-200/70 font-bold px-2 py-0.5 rounded-md"
                                title="هاتف ولي الأمر"
                              >
                                <span className="text-[10px] text-purple-600 font-sans">ولي الأمر:</span>
                                <span>{st.parentPhone}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Student Code */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => handleCopy(st.studentCode || st.username, `code-${st.id}`)}
                        className="inline-flex items-center gap-1.5 font-mono font-black text-xs text-[#5C2C90] bg-purple-50/80 hover:bg-purple-100 border border-purple-200/60 px-2.5 py-1 rounded-xl transition-all cursor-pointer group/code"
                        title="انقر لنسخ كود الطالب"
                      >
                        <span>{st.studentCode || st.username}</span>
                        {copiedId === `code-${st.id}` ? (
                          <Check size={12} className="text-emerald-600" />
                        ) : (
                          <Copy size={11} className="text-purple-400 opacity-60 group-hover/code:opacity-100 transition-opacity" />
                        )}
                      </button>
                    </td>

                    {/* National ID with Eye Toggle */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center justify-between gap-1.5 px-2 py-1 rounded-xl border font-mono text-xs transition-all select-none shadow-2xs w-[175px] max-w-full bg-slate-50 border-slate-200/90 text-slate-700">
                        {/* Eye Icon Button */}
                        <button
                          type="button"
                          onClick={() => toggleRowReveal(st.id)}
                          className={`p-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                            isRevealed
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 shadow-2xs'
                          }`}
                          title={isRevealed ? 'إخفاء الرقم القومي' : 'إظهار الرقم القومي كاملاً'}
                        >
                          {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>

                        {/* National ID Number */}
                        <span className={`font-bold tracking-wider truncate ${
                          isRevealed ? 'text-emerald-800 font-extrabold text-[11px]' : 'text-slate-700 text-[11px]'
                        }`}>
                          {displayNatId}
                        </span>

                        {/* Copy Full NatId Button */}
                        <button
                          type="button"
                          onClick={() => handleCopy(realNatId || st.nationalIdMasked, `nat-${st.id}`)}
                          className="p-1 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors shrink-0 cursor-pointer"
                          title="نسخ الرقم القومي"
                        >
                          {copiedId === `nat-${st.id}` ? (
                            <Check size={12} className="text-emerald-600" />
                          ) : (
                            <Copy size={11} />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Grade Name */}
                    <td className="py-3.5 px-3 text-center font-bold">
                      <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap border shadow-2xs ${
                        st.grade === 1
                          ? 'bg-sky-50/80 text-sky-800 border-sky-200'
                          : st.grade === 2
                          ? 'bg-indigo-50/80 text-indigo-800 border-indigo-200'
                          : 'bg-purple-50/80 text-purple-800 border-purple-200'
                      }`}>
                        {st.grade ? GRADE_NAMES[st.grade] || `الصف ${st.grade}` : '—'}
                      </span>
                    </td>

                    {/* Classroom Badge */}
                    <td className="py-3.5 px-3 text-center">
                      {st.classroom ? (
                        <span
                          className={`inline-block font-black font-mono px-2.5 py-1 rounded-xl border text-xs shadow-2xs ${
                            st.classroom?.startsWith('A')
                              ? 'text-sky-800 bg-sky-50 border-sky-200/90'
                              : st.classroom?.startsWith('B')
                              ? 'text-indigo-800 bg-indigo-50 border-indigo-200/90'
                              : 'text-[#E4007C] bg-pink-50 border-pink-200/90'
                          }`}
                        >
                          فصل {st.classroom}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Parent Consent */}
                    <td className="py-3.5 px-3 text-center">
                      {st.parentConsent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shadow-2xs">
                          <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                          <span>معتمد</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                          قيد المراجعة
                        </span>
                      )}
                    </td>

                    {/* Status with Glowing Dot */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 font-bold text-[11px] px-2.5 py-0.5 rounded-full border shadow-2xs ${
                          st.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          st.status === 'approved' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                        }`} />
                        <span>{st.status === 'approved' ? 'نشط' : 'معلّق'}</span>
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-3 text-center w-24">
                      <div className="flex items-center justify-center gap-1">
                        {onViewStudentProfile && (
                          <button
                            onClick={() => onViewStudentProfile(st)}
                            className="p-1.5 text-purple-700 hover:text-[#5C2C90] hover:bg-purple-100/70 rounded-xl transition-all cursor-pointer"
                            title="عرض الملف الشامل للطالب"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => onEditStudent(st)}
                          className="p-1.5 text-slate-500 hover:text-[#5C2C90] hover:bg-purple-100/70 rounded-xl transition-all cursor-pointer"
                          title="تعديل بيانات الطالب"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(st)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100/70 rounded-xl transition-all cursor-pointer"
                          title="حذف الطالب"
                        >
                          <Trash2 size={14} />
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
