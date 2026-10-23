import React from 'react';
import { createPortal } from 'react-dom';
import { Zap, X, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function BulkAddModal({
  isOpen,
  onClose,
  bulkData,
  onBulkDataChange,
  previewList,
  submitting,
  progress,
  onSubmit,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-7 shadow-2xl border border-slate-200/80 my-auto max-h-[90vh] overflow-y-auto space-y-5 text-right"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5C2C90] to-[#E4007C] text-white flex items-center justify-center shadow-xs">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">إضافة مجموعة طلاب</h3>
              <p className="text-xs text-slate-500">
                يمكنك اللصق مباشرة من جدول إكسيل (الاسم - كود الطالب - الرقم القومي)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">الصف</label>
              <select
                value={bulkData.grade}
                onChange={(e) => {
                  const g = Number(e.target.value);
                  const defClass = g === 1 ? 'A1' : g === 2 ? 'B1' : 'C1';
                  onBulkDataChange({ ...bulkData, grade: g, classroom: defClass });
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:border-[#5C2C90]"
              >
                <option value={1}>الصف الأول (المرحلة A)</option>
                <option value={2}>الصف الثاني (المرحلة B)</option>
                <option value={3}>الصف الثالث (المرحلة C)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">الفصل</label>
              <select
                value={bulkData.classroom}
                onChange={(e) => onBulkDataChange({ ...bulkData, classroom: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold font-mono focus:outline-none focus:border-[#5C2C90]"
              >
                {bulkData.grade === 1 && (
                  <>
                    <option value="A1">فصل A1</option>
                    <option value="A2">فصل A2</option>
                    <option value="A3">فصل A3</option>
                    <option value="A4">فصل A4</option>
                  </>
                )}
                {bulkData.grade === 2 && (
                  <>
                    <option value="B1">فصل B1</option>
                    <option value="B2">فصل B2</option>
                    <option value="B3">فصل B3</option>
                  </>
                )}
                {bulkData.grade === 3 && (
                  <>
                    <option value="C1">فصل C1</option>
                    <option value="C2">فصل C2</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                بيانات الطلاب (الاسم - كود الطالب - الرقم القومي)
              </label>
              <span className="text-[11px] font-bold text-[#5C2C90] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60">
                {bulkData.namesText.split('\n').filter((l) => l.trim()).length} سجل
              </span>
            </div>
            <textarea
              rows={6}
              required
              placeholder={`انسخ والصق من Excel أو اكتب طالبًا في كل سطر بالصيغة:\nاسم الطالب [فاصلة أو Tab] كود الطالب [فاصلة أو Tab] الرقم القومي (14 رقمًا)\nمثال:\nأحمد محمد مصطفى\t20240101\t30805121234567\nسارة إبراهيم علي\t20240102\t30906151234568`}
              value={bulkData.namesText}
              onChange={(e) => onBulkDataChange({ ...bulkData, namesText: e.target.value })}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#5C2C90] focus:bg-white transition-all font-mono leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              💡 يمكنك نسخ الأعمدة الثلاثة مباشرة من ملف إكسيل ولصقها هنا.
            </p>
          </div>

          {/* Live Preview List */}
          {bulkData.namesText.trim() && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>معاينة الطلاب المطلوب إضافتهم ({previewList.length})</span>
                <span className="text-[10px] text-slate-400">فصل {bulkData.classroom}</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1.5">
                {previewList.slice(0, 10).map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-white px-3 py-2 rounded-xl border border-slate-200/70"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{p.fullName}</span>
                      <span className="text-[10px] text-purple-700 font-mono block">كود: {p.studentCode}</span>
                    </div>
                    <div>
                      {p.nationalId ? (
                        <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          🔒 {p.nationalId.slice(0, 3)}********{p.nationalId.slice(11)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">كلمة مرور افتراضية</span>
                      )}
                    </div>
                  </div>
                ))}
                {previewList.length > 10 && (
                  <div className="text-[11px] text-center text-slate-400 pt-1 font-bold">
                    ... و{previewList.length - 10} طلاب إضافيين
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress bar when submitting */}
          {submitting && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#5C2C90]">
                <span>جارٍ حفظ بيانات الطلاب...</span>
                <span>
                  {progress.current} / {progress.total}
                </span>
              </div>
              <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#5C2C90] to-[#E4007C] transition-all duration-200"
                  style={{ width: `${(progress.current / (progress.total || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting || !bulkData.namesText.trim()}
              className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-900/15 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'جارٍ الحفظ...' : `حفظ (${previewList.length}) طالب`}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
