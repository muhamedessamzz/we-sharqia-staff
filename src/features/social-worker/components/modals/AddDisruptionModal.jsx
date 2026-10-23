import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function AddDisruptionModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    studentName: '',
    classroom: 'A1',
    parentName: '',
    parentPhone: '',
    location: 'معمل الحاسب والشبكات',
    incidentSummary: '',
    severity: 'medium',
    disciplinaryAction: 'تعهد خطي وإخطار ولي الأمر',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.studentName.trim() || !form.incidentSummary.trim()) return;
    onSubmit(form);
    setForm({
      studentName: '',
      classroom: 'A1',
      parentName: '',
      parentPhone: '',
      location: 'معمل الحاسب والشبكات',
      incidentSummary: '',
      severity: 'medium',
      disciplinaryAction: 'تعهد خطي وإخطار ولي الأمر',
    });
    onClose();
  };

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-2xl space-y-4 my-auto max-h-[90vh] overflow-y-auto text-right"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="font-black text-base text-slate-900">تسجيل مخالفة سلوكية</h4>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">اسم الطالب</label>
            <input
              type="text"
              required
              placeholder="اسم الطالب..."
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">الفصل</label>
              <select
                value={form.classroom}
                onChange={(e) => setForm({ ...form, classroom: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              >
                {['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'C1', 'C2'].map((c) => (
                  <option key={c} value={c}>
                    فصل {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">درجة الخطورة</label>
              <select
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              >
                <option value="medium">متوسطة (شغب وإزعاج)</option>
                <option value="high">جسيمة (إحالة للجنة الحماية)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">مكان الواقعة</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">تفاصيل وموجز واقعة الشغب</label>
            <textarea
              rows={2}
              required
              placeholder="وصف ما حدث من شغب أو مشاجرة أو عبث بأجهزة المعمل..."
              value={form.incidentSummary}
              onChange={(e) => setForm({ ...form, incidentSummary: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم ولي الأمر</label>
              <input
                type="text"
                placeholder="أ. ..."
                value={form.parentName}
                onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم هاتف ولي الأمر</label>
              <input
                type="text"
                placeholder="010..."
                value={form.parentPhone}
                onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                dir="ltr"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">الإجراء التربوي واللائحي</label>
            <input
              type="text"
              required
              value={form.disciplinaryAction}
              onChange={(e) => setForm({ ...form, disciplinaryAction: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold cursor-pointer"
            >
              حفظ المخالفة
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 text-slate-600 py-2.5 px-4 rounded-xl font-bold cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
