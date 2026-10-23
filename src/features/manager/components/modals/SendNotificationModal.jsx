import React from 'react';
import { createPortal } from 'react-dom';
import { Send, X } from 'lucide-react';

export default function SendNotificationModal({
  isOpen,
  onClose,
  newNotice,
  setNewNotice,
  staffList = [],
  saving,
  onSubmit
}) {
  if (!isOpen) return null;

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
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold">
              <Send size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">إرسال إشعار جديد</h3>
              <p className="text-xs font-bold text-slate-400">يصل الإشعار إلى الفئة المحددة مع متابعة الاطلاع</p>
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
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">
              عنوان الإشعار
            </label>
            <input
              type="text"
              required
              placeholder="مثال: موعد تسليم درجات أعمال السنة"
              value={newNotice.title}
              onChange={(e) => setNewNotice(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-2xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">
              نص الإشعار
            </label>
            <textarea
              rows={4}
              required
              placeholder="اكتب نص الإشعار هنا..."
              value={newNotice.content}
              onChange={(e) => setNewNotice(prev => ({ ...prev, content: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                المستلمون
              </label>
              <select
                value={newNotice.targetRole}
                onChange={(e) => setNewNotice(prev => ({ ...prev, targetRole: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-2xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="all">جميع العاملين بالمدرسة (الاستاف)</option>
                <option value="teacher">المعلمون فقط</option>
                <option value="technicalengineer">مهندسو التدريب والمعامل</option>
                <option value="studentaffairs">شؤون الطلاب</option>
                <option value="socialworker">الأخصائي الاجتماعي</option>
                <option value="assessmentcoordinator">مسؤول التقييم والامتحانات</option>
                <option value="parent">أولياء الأمور فقط</option>
                <option value="student">الطلاب فقط</option>
                <option value="all_school">كافة مجتمع المدرسة (عاملين، أولياء أمور، وطلاب)</option>
                <option value="single_user">موظف محدد</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                درجة الأهمية
              </label>
              <select
                value={newNotice.priority}
                onChange={(e) => setNewNotice(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-2xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="administrative">تنبيه إداري 🔴</option>
                <option value="urgent">عاجل ⚠️</option>
                <option value="normal">إشعار عام ℹ️</option>
              </select>
            </div>
          </div>

          {/* If Single User is selected */}
          {newNotice.targetRole === 'single_user' && (
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                اختر الموظف
              </label>
              <select
                value={newNotice.targetUserId}
                onChange={(e) => setNewNotice(prev => ({ ...prev, targetUserId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-2xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300"
                required
              >
                <option value="">-- اختر الموظف --</option>
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>{s.fullName} ({s.role})</option>
                ))}
              </select>
            </div>
          )}

          {/* Checkbox for acknowledgment */}
          <label className="flex items-center gap-2 p-3 bg-purple-50/60 rounded-2xl border border-purple-200/70 cursor-pointer">
            <input
              type="checkbox"
              checked={newNotice.requiresAcknowledgment}
              onChange={(e) => setNewNotice(prev => ({ ...prev, requiresAcknowledgment: e.target.checked }))}
              className="rounded text-[#5C2C90] focus:ring-[#5C2C90]"
            />
            <span className="text-xs font-bold text-purple-950">
              طلب تأكيد الاطلاع من المستلم
            </span>
          </label>

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
              className="px-5 py-2.5 rounded-2xl bg-[#5C2C90] hover:bg-[#4d2477] text-white text-xs font-black shadow-md shadow-purple-900/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Send size={14} />
              <span>{saving ? 'جارٍ الإرسال...' : 'إرسال الإشعار'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
