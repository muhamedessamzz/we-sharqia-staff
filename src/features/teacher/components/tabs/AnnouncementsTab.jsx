import React, { useState } from 'react';
import { Megaphone, Send, Trash2 } from 'lucide-react';
import { INITIAL_ANNOUNCEMENT_FORM, DEFAULT_SCHOOL_CLASSROOMS } from '../../constants';

export default function AnnouncementsTab({
  announcements,
  permissions,
  onPublishAnnouncement,
  onDeleteAnnouncement
}) {
  const { isTeachingStaff, isRestricted, assignedClasses, isSuperAdmin } = permissions;
  const [form, setForm] = useState(INITIAL_ANNOUNCEMENT_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    setSubmitting(true);
    try {
      await onPublishAnnouncement({
        title: form.title.trim(),
        content: form.content.trim(),
        classroom: form.classroom,
        importance: form.importance
      });
      setForm(INITIAL_ANNOUNCEMENT_FORM);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Post New Announcement Card: Show form ONLY to teaching staff */}
      {isTeachingStaff ? (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Megaphone size={20} className="text-[#5C2C90]" />
            <h3 className="text-base font-black text-slate-900">نشر تنبيه للفصل</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان التنبيه</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: موعد الاختبار العملي غدًا"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#5C2C90] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الفصل</label>
                <select
                  value={form.classroom}
                  onChange={(e) => setForm(prev => ({ ...prev, classroom: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#5C2C90] cursor-pointer"
                >
                  {isRestricted ? (
                    <>
                      <option value="all">جميع فصولك ({assignedClasses.join(', ')})</option>
                      {assignedClasses.map(cls => (
                        <option key={cls} value={cls}>فصل {cls}</option>
                      ))}
                    </>
                  ) : (
                    <>
                      <option value="all">جميع فصول المدرسة (عام)</option>
                      {DEFAULT_SCHOOL_CLASSROOMS.map(cls => (
                        <option key={cls} value={cls}>فصل {cls}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نص التنبيه</label>
              <textarea
                required
                rows={3}
                placeholder="اكتب نص التنبيه هنا، وسيظهر للطلاب في حساباتهم."
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-[#5C2C90] focus:bg-white leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">درجة الأهمية:</span>
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'normal', label: 'عادي', color: 'bg-slate-100 text-slate-700' },
                    { id: 'urgent', label: 'عاجل', color: 'bg-rose-50 text-rose-700 border-rose-200' },
                    { id: 'assignment', label: 'اختبار أو واجب', color: 'bg-purple-50 text-[#5C2C90] border-purple-200' }
                  ].map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, importance: type.id }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        form.importance === type.id 
                          ? 'bg-[#5C2C90] text-white border-[#5C2C90] shadow-xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md shadow-purple-900/15 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send size={15} />
                <span>{submitting ? 'جارٍ النشر...' : 'نشر التنبيه'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-purple-50/70 border border-purple-200/80 p-5 rounded-3xl flex items-start gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#5C2C90] flex items-center justify-center shrink-0 shadow-2xs border border-purple-100">
            <Megaphone size={18} />
          </div>
          <div>
            <h4 className="font-black text-sm text-slate-900 mb-0.5">تنبيهات الفصول</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              يتم نشر التنبيهات من المعلمين لطلابهم مباشرة. بصفتك ({isSuperAdmin ? 'مسؤول النظام' : 'إدارة المدرسة'})، يمكنك متابعة التنبيهات أو حذفها.
            </p>
          </div>
        </div>
      )}

      {/* Announcements History List */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-black text-slate-900 mb-1">سجل التنبيهات المنشورة</h3>

        {announcements.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <div className="text-3xl mb-1">📢</div>
            <p className="text-xs">لا توجد تنبيهات منشورة حتى الآن.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((ann) => {
              const isUrgent = ann.importance === 'urgent';
              return (
                <div
                  key={ann.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                    isUrgent 
                      ? 'bg-rose-50/50 border-rose-200' 
                      : 'bg-slate-50/70 border-slate-200/80'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {ann.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md font-mono bg-purple-50 text-[#5C2C90] border border-purple-200">
                        فصل {ann.classroom}
                      </span>
                      {isUrgent && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                          عاجل
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                      {ann.content}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono block pt-1">
                      نُشر بتاريخ {new Date(ann.createdAtUtc).toLocaleDateString('ar-EG')} · {new Date(ann.createdAtUtc).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteAnnouncement(ann.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer self-end sm:self-auto"
                    title="حذف الرسالة"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
