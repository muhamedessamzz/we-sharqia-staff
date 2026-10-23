import React from 'react';
import { createPortal } from 'react-dom';
import { Star, X } from 'lucide-react';
import { EVALUATION_CRITERIA } from '../../constants';

export default function EvaluateStaffModal({
  staff,
  evalForm,
  setEvalForm,
  saving,
  onClose,
  onSubmit
}) {
  if (!staff) return null;

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-right my-auto max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Star size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">تقييم أداء الموظف</h3>
              <p className="text-xs font-bold text-slate-400">{staff.fullName} ({staff.role})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          {/* Rating criteria */}
          <div className="space-y-3">
            {EVALUATION_CRITERIA.map(item => (
              <div key={item.key} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEvalForm(prev => ({ ...prev, [item.key]: star }))}
                      className={`p-1 cursor-pointer transition-colors ${
                        star <= evalForm[item.key] ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      <Star size={18} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Recognition Badge */}
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">
              وسام تقديري (اختياري)
            </label>
            <select
              value={evalForm.badge}
              onChange={(e) => setEvalForm(prev => ({ ...prev, badge: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-2xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="معلم متميز">معلم متميز</option>
              <option value="الأكثر تفاعلاً">الأكثر تفاعلًا</option>
              <option value="انضباط إداري نموذجي">انضباط والتزام نموذجي</option>
              <option value="شكر وتقدير من المدير">شكر وتقدير من إدارة المدرسة</option>
              <option value="">بدون وسام</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">
              الملاحظات والتوجيهات
            </label>
            <textarea
              rows={3}
              value={evalForm.notes}
              onChange={(e) => setEvalForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="اكتب ملاحظاتك أو توجيهاتك..."
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-2xl bg-[#5C2C90] hover:bg-[#4d2477] text-white text-xs font-black shadow-md shadow-purple-900/20 transition-all cursor-pointer"
            >
              {saving ? 'جارٍ الحفظ...' : 'حفظ التقييم'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
