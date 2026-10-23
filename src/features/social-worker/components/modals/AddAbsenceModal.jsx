import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function AddAbsenceModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    studentName: '',
    classroom: 'A1',
    parentName: '',
    parentPhone: '',
    absenceDaysCount: 3,
    consecutiveDays: 2,
    actionTaken: 'إرسال إنذار غياب أول لولي الأمر',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.studentName.trim()) return;
    onSubmit(form);
    setForm({
      studentName: '',
      classroom: 'A1',
      parentName: '',
      parentPhone: '',
      absenceDaysCount: 3,
      consecutiveDays: 2,
      actionTaken: 'إرسال إنذار غياب أول لولي الأمر',
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
          <h4 className="font-black text-base text-slate-900">تسجيل وإصدار إنذار غياب</h4>
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
          <div className="grid grid-cols-3 gap-2">
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
              <label className="block font-bold text-slate-700 mb-1">أيام الغياب</label>
              <input
                type="number"
                min={1}
                value={form.absenceDaysCount}
                onChange={(e) => setForm({ ...form, absenceDaysCount: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">أيام متصلة</label>
              <input
                type="number"
                min={1}
                value={form.consecutiveDays}
                onChange={(e) => setForm({ ...form, consecutiveDays: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
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
              <label className="block font-bold text-slate-700 mb-1">رقم الهاتف (واتساب)</label>
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
            <label className="block font-bold text-slate-700 mb-1">الإجراء المتخذ</label>
            <input
              type="text"
              required
              value={form.actionTaken}
              onChange={(e) => setForm({ ...form, actionTaken: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 bg-[#5C2C90] hover:bg-[#4a2175] text-white py-2.5 rounded-xl font-bold cursor-pointer"
            >
              تسجيل الإنذار
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
