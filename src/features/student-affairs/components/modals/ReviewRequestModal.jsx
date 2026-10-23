import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, Send, X, Clock, User, Phone, FileText } from 'lucide-react';

const QUICK_RESPONSES = {
  approved: [
    'تم اعتماد إذن الخروج وإبلاغ أمن المدرسة ومشرف الدور.',
    'تم قبول عذر الغياب وتسجيله في كشوف شؤون الطلاب.',
    'تم تحديد موعد للمقابلة، نتشرف بحضوركم لمكتب إدارة المدرسة.',
    'تم تجهيز البيان المطلوب، ويمكنكم استلامه من شؤون الطلاب.',
  ],
  rejected: [
    'نعتذر عن عدم قبول الطلب لوجود تدريب عملي إلزامي بالمعامل.',
    'يرجى إرفاق تقرير طبي معتمد من التأمين الصحي لإعادة مراجعة العذر.',
    'يرجى التواصل هاتفيًا مع مكتب شؤون الطلاب لتحديد موعد آخر.',
  ],
};

export default function ReviewRequestModal({
  isOpen,
  request,
  onClose,
  onSubmit,
  currentUserName = 'شؤون الطلاب',
}) {
  const [status, setStatus] = useState('approved');
  const [adminResponse, setAdminResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (request) {
      setStatus(request.status === 'rejected' ? 'rejected' : 'approved');
      setAdminResponse(request.adminResponse || QUICK_RESPONSES.approved[0]);
    }
  }, [request]);

  if (!isOpen || !request) return null;

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    const defaults = QUICK_RESPONSES[newStatus] || [];
    if (defaults.length > 0) {
      setAdminResponse(defaults[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminResponse.trim()) {
      alert('أدخل رد إدارة المدرسة على الطلب');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(request.id, {
        status,
        adminResponse: adminResponse.trim(),
        reviewedBy: currentUserName,
      });
      onClose();
    } catch (err) {
      alert(err.message || 'حدث خطأ أثناء حفظ القرار');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full border border-slate-200 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto text-right animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5C2C90] flex items-center justify-center font-bold">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                مراجعة طلب ولي الأمر
              </h3>
              <p className="text-xs text-slate-500">
                يظهر هذا الرد لولي الأمر مباشرة عبر حسابه
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Request Details Summary Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">الطالب:</span>
              <span className="font-black text-slate-900 text-sm">{request.studentName}</span>
              <span className="font-mono bg-purple-100 text-[#5C2C90] px-2 py-0.5 rounded-md font-bold">
                فصل {request.classroom}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
              <Clock size={12} />
              <span>{new Date(request.createdAtUtc).toLocaleDateString('ar-EG')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-slate-600">
            <div className="flex items-center gap-1.5">
              <User size={13} className="text-[#5C2C90]" />
              <span>ولي الأمر: <b>{request.parentName}</b></span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <Phone size={13} className="text-emerald-600" />
              <span>{request.parentPhone}</span>
            </div>
          </div>

          <div className="pt-1">
            <span className="font-bold text-slate-700 block mb-1">تفاصيل ومبررات الطلب:</span>
            <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-medium">
              {request.details || request.reason || 'لا توجد تفاصيل إضافية'}
            </p>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-2">
              قرار الإدارة:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleStatusChange('approved')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  status === 'approved'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200'
                }`}
              >
                <CheckCircle2 size={16} />
                <span>قبول الطلب</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('rejected')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  status === 'rejected'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/30 ring-2 ring-rose-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:border-rose-200'
                }`}
              >
                <XCircle size={16} />
                <span>رفض الطلب</span>
              </button>
            </div>
          </div>

          {/* Quick Response Templates */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
              نماذج ردود سريعة:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(QUICK_RESPONSES[status] || []).map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAdminResponse(t)}
                  className="text-[10px] bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-[#5C2C90] border border-slate-200 rounded-lg px-2 py-1 transition-colors text-right cursor-pointer"
                >
                  {t.length > 35 ? t.slice(0, 35) + '...' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Response Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              الرد المرسل لولي الأمر:
            </label>
            <textarea
              rows={3}
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder="اكتب الرد أو الملاحظات لولي الأمر..."
              className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5C2C90] resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-400 font-medium">
              المراجع: <b>{currentUserName}</b>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white px-5 py-2 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send size={13} />
                <span>{submitting ? 'جارٍ الحفظ...' : 'إرسال الرد'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
