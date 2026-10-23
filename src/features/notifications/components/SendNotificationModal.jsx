import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Send, X, Users, User, Building, AlertTriangle, 
  Info, ShieldAlert, Sparkles, CheckCircle2 
} from 'lucide-react';
import { api } from '../../../api/client';

const ROLE_BADGES = {
  admin: { label: 'مسؤول النظام', color: 'bg-purple-100 text-[#5C2C90]' },
  schoolmanager: { label: 'مدير المدرسة', color: 'bg-indigo-100 text-indigo-800' },
  teacher: { label: 'معلم', color: 'bg-blue-100 text-blue-800' },
  technicalengineer: { label: 'مهندس معامل', color: 'bg-sky-100 text-sky-800' },
  studentaffairs: { label: 'شؤون الطلاب', color: 'bg-amber-100 text-amber-800' },
  socialworker: { label: 'أخصائي اجتماعي', color: 'bg-purple-100 text-purple-700' },
  assessmentcoordinator: { label: 'مسؤول امتحانات', color: 'bg-emerald-100 text-emerald-800' },
  qualitycoordinator: { label: 'مسؤول الجودة', color: 'bg-teal-100 text-teal-800' },
  it: { label: 'الدعم الفني', color: 'bg-slate-100 text-slate-800' },
};

const TEMPLATES = [
  {
    label: 'اجتماع طارئ 📅',
    title: 'دعوة لحضور اجتماع طارئ لمجلس إدارة المدرسة',
    content: 'يُرجى من الزملاء الكرام التواجد في قاعة الاجتماعات الرئيسية اليوم لمناقشة المستجدات والتوجيهات الإدارية العاجلة.',
    priority: 'urgent',
    requiresAcknowledgment: true
  },
  {
    label: 'رصد أعمال السنة 📝',
    title: 'تذكير بموعد إغلاق رصد درجات أعمال السنة والغياب',
    content: 'نود تذكير السادة المعلمين والمهندسين بسرعة إنهاء رصد درجات الطلاب وحالات الحضور على المنصة قبل نهاية الأسبوع.',
    priority: 'administrative',
    requiresAcknowledgment: true
  },
  {
    label: 'توجيهات المعامل والورش 🔬',
    title: 'تعليمات تشغيل المعامل والأمن والسلامة المهنية',
    content: 'التأكيد على الالتزام الكامل بمعايير السلامة المهنية ومراجعة أجهزة المعامل قبل بدء الحصص التدريبية العملية.',
    priority: 'normal',
    requiresAcknowledgment: false
  },
  {
    label: 'إشعار إداري عام ℹ️',
    title: 'تنبيه إداري عام بشأن مواعيد الحضور والانصراف',
    content: 'السادة العاملين بالمدرسة، يُرجى الالتزام التام بالمواعيد الرسمية المعتمدة للحضور وتسجيل البصمة/الحضور اليومي.',
    priority: 'normal',
    requiresAcknowledgment: false
  }
];

export default function SendNotificationModal({
  isOpen,
  onClose,
  staffList = [],
  currentUser,
  onNotificationSent
}) {
  const [targetType, setTargetType] = useState('all'); // 'all' | 'single_user' | 'role'
  const [targetUserId, setTargetUserId] = useState(staffList[0]?.id || '');
  const [targetRole, setTargetRole] = useState('teacher');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal'); // 'normal' | 'urgent' | 'administrative'
  const [requiresAcknowledgment, setRequiresAcknowledgment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [staffSearch, setStaffSearch] = useState('');

  if (!isOpen) return null;

  // Filter staff list
  const filteredStaff = staffList.filter(s => {
    if (!staffSearch.trim()) return true;
    const q = staffSearch.toLowerCase().trim();
    return (
      s.fullName?.toLowerCase().includes(q) ||
      s.username?.toLowerCase().includes(q) ||
      s.role?.toLowerCase().includes(q)
    );
  });

  const selectedStaffMember = staffList.find(s => s.id === targetUserId) || staffList[0];

  const handleSelectTargetType = (type) => {
    setTargetType(type);
    if (type === 'single_user' && !targetUserId && staffList.length > 0) {
      setTargetUserId(staffList[0].id);
    }
  };

  const handleApplyTemplate = (tpl) => {
    setTitle(tpl.title);
    setContent(tpl.content);
    setPriority(tpl.priority);
    setRequiresAcknowledgment(tpl.requiresAcknowledgment);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (targetType === 'single_user' && !targetUserId) {
      alert('يرجى اختيار الموظف المستهدف بالإشعار');
      return;
    }

    setSaving(true);
    try {
      // Validate SenderId is a valid GUID
      const isValidGuid = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const senderId = currentUser?.id && isValidGuid(currentUser.id)
        ? currentUser.id
        : '00000000-0000-0000-0000-000000000001';

      const payload = {
        senderId,
        senderName: currentUser?.fullName || 'مسؤول النظام',
        title: title.trim(),
        content: content.trim(),
        targetRole: targetType === 'all' ? 'all' : targetType === 'single_user' ? 'single_user' : targetRole,
        targetUserId: targetType === 'single_user' ? (targetUserId || selectedStaffMember?.id) : null,
        targetUserName: targetType === 'single_user' ? (selectedStaffMember?.fullName || 'عضو من الاستف') : null,
        priority,
        requiresAcknowledgment
      };

      await api.createManagerNotification(payload);
      onNotificationSent?.(payload);
      onClose();
    } catch (err) {
      alert(err.message || 'تعذر إرسال الإشعار، يرجى المحاولة لاحقاً');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4 overflow-hidden"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 text-right flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Sticky Header */}
        <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5C2C90] to-[#E4007C] text-white flex items-center justify-center font-bold shadow-md shadow-purple-950/20">
              <Send size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">إرسال إشعار وتعميم مدرسي</h3>
              <p className="text-xs font-bold text-slate-400">إرسال توجيه فوري للطاقم بالكامل أو لموظف محدد مع تتبع الاطلاع</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="notification-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 py-4 space-y-4">
          {/* Templates Shortcuts */}
          <div>
            <span className="text-[11px] font-black text-slate-400 block mb-1.5">
              نماذج سريعة للإشعارات:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Audience Selector (All Staff vs Single Staff vs Department) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 block">
              الجهة أو المستهدف بالإشعار:
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 text-center">
              <button
                type="button"
                onClick={() => handleSelectTargetType('all')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  targetType === 'all'
                    ? 'bg-[#5C2C90] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users size={14} />
                <span>الاستف بالكامل ({staffList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTargetType('single_user')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  targetType === 'single_user'
                    ? 'bg-[#5C2C90] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User size={14} />
                <span>شخص محدد من الاستف</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTargetType('role')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  targetType === 'role'
                    ? 'bg-[#5C2C90] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building size={14} />
                <span>قسم أو وظيفة</span>
              </button>
            </div>
          </div>

          {/* Conditional Target Selection */}
          {targetType === 'single_user' && (
            <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-[#5C2C90]">
                  اختر الموظف المستهدف:
                </label>
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو الوظيفة..."
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  className="bg-white border border-purple-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5C2C90] w-48"
                />
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {filteredStaff.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">لا يوجد موظف بهذا الاسم</p>
                ) : (
                  filteredStaff.map((staff) => {
                    const isSelected = (targetUserId || staffList[0]?.id) === staff.id;
                    const badge = ROLE_BADGES[staff.role?.toLowerCase()] || { label: staff.role, color: 'bg-slate-100 text-slate-700' };

                    return (
                      <div
                        key={staff.id}
                        onClick={() => setTargetUserId(staff.id)}
                        className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-purple-100/90 border-[#5C2C90] shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200/70'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                            isSelected ? 'bg-[#5C2C90] text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {staff.fullName?.[0] || 'م'}
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-900 block leading-tight">
                              {staff.fullName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              @{staff.username}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
                            {badge.label}
                          </span>
                          {isSelected && <CheckCircle2 size={15} className="text-[#5C2C90]" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {targetType === 'role' && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="text-xs font-black text-slate-700 block mb-1.5">
                اختر القسم أو الوظيفة المستهدفة:
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/30"
              >
                <option value="teacher">المعلمون فقط (Teachers)</option>
                <option value="technicalengineer">مهندسو التدريب والمعامل (Engineers)</option>
                <option value="studentaffairs">شؤون الطلاب (Student Affairs)</option>
                <option value="socialworker">الأخصائيون الاجتماعيون (Social Workers)</option>
                <option value="assessmentcoordinator">مسؤولو التقييم والامتحانات (Assessment)</option>
                <option value="qualitycoordinator">منسقو الجودة (Quality)</option>
                <option value="it">الدعم الفني والشبكات (IT)</option>
              </select>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">
              عنوان الإشعار <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: تعليمات هامة بخصوص امتحانات الشهر..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-2xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/30"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">
              نص التوجيه أو الإشعار <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="اكتب التوجيه أو التعميم بوضوح هنا..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-2xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/30 resize-none leading-relaxed"
            />
          </div>

          {/* Priority & Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                درجة الأهمية
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/30"
              >
                <option value="normal">ℹ️ إشعار عام عادي</option>
                <option value="urgent">⚠️ عاجل وهام</option>
                <option value="administrative">🔴 تنبيه إداري رسمي</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 p-2.5 bg-purple-50/70 hover:bg-purple-50 rounded-xl border border-purple-200/80 cursor-pointer w-full transition-colors mt-auto">
                <input
                  type="checkbox"
                  checked={requiresAcknowledgment}
                  onChange={(e) => setRequiresAcknowledgment(e.target.checked)}
                  className="rounded text-[#5C2C90] focus:ring-[#5C2C90]"
                />
                <span className="text-xs font-bold text-purple-950">
                  طلب تأكيد "تم الاطلاع والعلم"
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Sticky Fixed Bottom Footer */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/60 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            إلغاء
          </button>

          <button
            type="submit"
            form="notification-form"
            disabled={saving}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white text-xs font-black shadow-md shadow-purple-950/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            <Send size={15} />
            <span>{saving ? 'جارٍ الإرسال...' : 'إرسال الإشعار فوراً 🚀'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
