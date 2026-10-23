import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  MessageSquare,
  Share2,
  Printer,
  ChevronDown,
  User,
  Phone,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import ReviewRequestModal from '../modals/ReviewRequestModal';

const REQUEST_TYPE_LABELS = {
  leave_permission: { label: 'إذن خروج مبكر', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  absence_excuse: { label: 'عذر غياب', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  meeting_request: { label: 'طلب مقابلة', color: 'bg-purple-50 text-[#5C2C90] border-purple-200' },
  certificate_request: { label: 'بيان قيد أو شهادة', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  general_inquiry: { label: 'استفسار أو شكوى', color: 'bg-slate-100 text-slate-800 border-slate-200' },
};

export default function ParentRequestsTab({
  requests = [],
  filteredRequests = [],
  loading = false,
  counts = { total: 0, pending: 0, approved: 0, rejected: 0 },
  statusFilter = 'all',
  setStatusFilter,
  typeFilter = 'all',
  setTypeFilter,
  searchQuery = '',
  setSearchQuery,
  onRefresh,
  onReviewRequest,
  currentUserName,
}) {
  const [selectedRequestForReview, setSelectedRequestForReview] = useState(null);

  const handleOpenWhatsApp = (req) => {
    const rawPhone = (req.parentPhone || '').replace(/[^0-9]/g, '');
    const finalPhone = rawPhone.startsWith('0')
      ? '2' + rawPhone
      : rawPhone.startsWith('20')
      ? rawPhone
      : '20' + rawPhone;

    const msg = `السلام عليكم ورحمة الله، الأستاذ/ ${req.parentName}،\nمن إدارة مدرسة WE للتكنولوجيا التطبيقية (فرع الشرقية).\nبخصوص طلبكم للطالب (${req.studentName} - فصل ${req.classroom}):\n` +
      (req.adminResponse ? `رد المدرسة: ${req.adminResponse}\n` : 'نحيطكم علمًا بأنه جارٍ متابعة الطلب والتواصل معكم.\n') +
      'مع خالص التحية والتقدير.';

    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handlePrintRequestSlip = (req) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return alert('يُرجى السماح بالنوافذ المنبثقة لطباعة التصريح.');

    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <title>تصريح رسمي - شؤون الطلاب مدرسة WE</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #26163A; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #5C2C90; padding-bottom: 15px; margin-bottom: 20px; }
            .title { font-size: 20px; font-weight: bold; color: #5C2C90; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 8px; font-weight: bold; background: #f3e8ff; color: #5C2C90; font-size: 14px; }
            .box { background: #fdfcff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
            .footer { margin-top: 40px; display: flex; justify-content: space-between; text-align: center; }
            .sig { border-top: 1px dashed #94a3b8; width: 180px; padding-top: 8px; font-size: 13px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">مدارس WE للتكنولوجيا التطبيقية · فرع الشرقية</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">وزارة التربية والتعليم والتعليم الفني · المصرية للاتصالات</div>
            </div>
            <div class="badge">إذن وتصريح شؤون طلاب رسمي</div>
          </div>

          <div class="box">
            <div class="row">
              <span><b>اسم الطالب:</b> ${req.studentName}</span>
              <span><b>الفصل الدراسي:</b> ${req.classroom}</span>
            </div>
            <div class="row">
              <span><b>ولي الأمر:</b> ${req.parentName}</span>
              <span><b>رقم الهاتف:</b> ${req.parentPhone}</span>
            </div>
            <div class="row">
              <span><b>نوع الإذن / الطلب:</b> ${REQUEST_TYPE_LABELS[req.requestType]?.label || req.requestType}</span>
              <span><b>تاريخ التقديم:</b> ${new Date(req.createdAtUtc).toLocaleDateString('ar-EG')}</span>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
              <b>مبررات الطلب:</b>
              <p style="margin-top: 6px; color: #334155; line-height: 1.6;">${req.details || req.reason || 'طلب إداري معتمد'}</p>
            </div>
            <div style="margin-top: 15px; padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
              <b style="color: #166534;">قرار شؤون الطلاب:</b>
              <p style="margin-top: 4px; color: #15803d;">${req.adminResponse || 'تمت الموافقة والاعتماد رسمياً.'}</p>
              <div style="font-size: 11px; color: #64748b; margin-top: 6px;">المعتمد: ${req.reviewedBy || 'شؤون الطلاب'} · بتاريخ: ${req.reviewedAtUtc ? new Date(req.reviewedAtUtc).toLocaleString('ar-EG') : 'اليوم'}</div>
            </div>
          </div>

          <div class="footer">
            <div class="sig">مشرف الدور / المعمل</div>
            <div class="sig">مسؤول أمن البوابة</div>
            <div class="sig">مسؤول شؤون الطلاب</div>
          </div>

          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* 1. Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>إجمالي طلبات أولياء الأمور</span>
            <FileText size={18} className="text-[#5C2C90]" />
          </div>
          <div className="text-3xl font-black text-slate-900">{counts.total}</div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">المسجلة عبر البوابة</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-2xs flex flex-col justify-between bg-gradient-to-bl from-amber-50/40 to-white">
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold mb-2">
            <span>طلبات قيد المراجعة</span>
            <Clock size={18} className="animate-spin-slow" />
          </div>
          <div className="text-3xl font-black text-amber-600">{counts.pending}</div>
          <p className="text-[11px] text-amber-700/80 font-bold mt-1">في انتظار الرد</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-emerald-200/80 shadow-2xs flex flex-col justify-between bg-gradient-to-bl from-emerald-50/40 to-white">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold mb-2">
            <span>الطلبات المقبولة</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="text-3xl font-black text-emerald-700">{counts.approved}</div>
          <p className="text-[11px] text-emerald-700/80 font-medium mt-1">تمت الموافقة عليها</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-rose-200/80 shadow-2xs flex flex-col justify-between bg-gradient-to-bl from-rose-50/40 to-white">
          <div className="flex items-center justify-between text-rose-700 text-xs font-bold mb-2">
            <span>الطلبات المرفوضة</span>
            <XCircle size={18} />
          </div>
          <div className="text-3xl font-black text-rose-600">{counts.rejected}</div>
          <p className="text-[11px] text-rose-700/80 font-medium mt-1">تم إبلاغ ولي الأمر</p>
        </div>
      </div>

      {/* 2. Controls & Search Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الكل ({counts.total})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-2xs font-black'
                  : 'text-amber-700 hover:bg-amber-100/60'
              }`}
            >
              <span>قيد المراجعة</span>
              <span className="w-4 h-4 rounded-full bg-white/30 text-[10px] flex items-center justify-center font-mono">
                {counts.pending}
              </span>
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'approved'
                  ? 'bg-emerald-600 text-white shadow-2xs font-black'
                  : 'text-emerald-700 hover:bg-emerald-100/60'
              }`}
            >
              المعتمدة ({counts.approved})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'rejected'
                  ? 'bg-rose-600 text-white shadow-2xs font-black'
                  : 'text-rose-700 hover:bg-rose-100/60'
              }`}
            >
              المرفوضة ({counts.rejected})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث باسم الطالب، ولي الأمر، الفصل، الهاتف..."
              className="w-full pl-3 pr-10 py-2 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5C2C90] bg-slate-50/50"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-2xl bg-purple-50 text-[#5C2C90] hover:bg-purple-100 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            title="تحديث قائمة الطلبات"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Filter by Type */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Filter size={12} />
            <span>نوع الطلب:</span>
          </span>
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-[#5C2C90] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            جميع الأنواع
          </button>
          {Object.entries(REQUEST_TYPE_LABELS).map(([k, cfg]) => (
            <button
              key={k}
              onClick={() => setTypeFilter(k)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                typeFilter === k
                  ? 'bg-purple-100 text-[#5C2C90] border-purple-300 font-black'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Requests List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200 shadow-2xs">
          <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#5C2C90]" />
          <span className="text-xs font-bold">جارٍ تحميل طلبات أولياء الأمور...</span>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 shadow-2xs space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5C2C90] mx-auto flex items-center justify-center font-bold text-xl">
            📬
          </div>
          <h4 className="font-black text-slate-800 text-sm">لا توجد طلبات تطابق معايير البحث</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            ستظهر هنا كافة أذونات الخروج المبكر، الأعذار الطبية، وطلبات المقابلة فور تقديمها من أولياء الأمور عبر البوابة.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredRequests.map((req) => {
            const isPending = (req.status || 'pending').toLowerCase() === 'pending';
            const isApproved = (req.status || '').toLowerCase() === 'approved';
            const isRejected = (req.status || '').toLowerCase() === 'rejected';
            const typeCfg = REQUEST_TYPE_LABELS[req.requestType] || {
              label: req.requestType || 'طلب إداري',
              color: 'bg-slate-100 text-slate-700 border-slate-200',
            };

            return (
              <div
                key={req.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-2xs hover:shadow-sm space-y-4 ${
                  isPending
                    ? 'border-amber-200/90 ring-1 ring-amber-200/50'
                    : isApproved
                    ? 'border-emerald-200/90'
                    : 'border-slate-200'
                }`}
              >
                {/* Header of Request Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full border ${typeCfg.color}`}
                    >
                      {typeCfg.label}
                    </span>

                    <span
                      className={`text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isPending
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : isApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {isPending ? (
                        <>
                          <Clock size={11} className="animate-spin-slow" />
                          <span>قيد المراجعة</span>
                        </>
                      ) : isApproved ? (
                        <>
                          <CheckCircle2 size={11} />
                          <span>مقبول</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={11} />
                          <span>مرفوض</span>
                        </>
                      )}
                    </span>

                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(req.createdAtUtc).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    {/* WhatsApp direct */}
                    {req.parentPhone && (
                      <button
                        onClick={() => handleOpenWhatsApp(req)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="إرسال رسالة عبر واتساب لولي الأمر"
                      >
                        <Share2 size={13} />
                        <span>واتساب</span>
                      </button>
                    )}

                    {/* Print Slip (for approved requests) */}
                    {isApproved && (
                      <button
                        onClick={() => handlePrintRequestSlip(req)}
                        className="bg-purple-50 hover:bg-purple-100 text-[#5C2C90] border border-purple-200/80 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="طباعة التصريح"
                      >
                        <Printer size={13} />
                        <span>طباعة التصريح</span>
                      </button>
                    )}

                    {/* Review Button */}
                    <button
                      onClick={() => setSelectedRequestForReview(req)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                        isPending
                          ? 'bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <MessageSquare size={13} />
                      <span>{isPending ? 'الرد على الطلب' : 'تعديل الرد'}</span>
                    </button>
                  </div>
                </div>

                {/* People Info & Classroom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold block mb-0.5">الطالب:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{req.studentName}</span>
                      <span className="font-mono bg-purple-100 text-[#5C2C90] px-2 py-0.5 rounded-md font-bold text-[11px]">
                        فصل {req.classroom}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-bold block mb-0.5">ولي الأمر:</span>
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <User size={13} className="text-[#5C2C90]" />
                      <span>{req.parentName}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-bold block mb-0.5">رقم التواصل:</span>
                    <div className="flex items-center gap-1.5 font-mono text-emerald-700 font-bold">
                      <Phone size={13} />
                      <span>{req.parentPhone || 'غير مسجل'}</span>
                    </div>
                  </div>
                </div>

                {/* Request Content / Details */}
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1">
                    تفاصيل الطلب:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 leading-relaxed font-medium">
                    {req.details || req.reason || 'لا توجد تفاصيل إضافية'}
                  </p>
                </div>

                {/* Administrative Decision Outcome (if reviewed) */}
                {req.adminResponse && (
                  <div
                    className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                      isApproved
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                        : isRejected
                        ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {isApproved ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        <span>رد إدارة المدرسة:</span>
                      </span>
                      <span className="text-[11px] font-normal text-slate-500">
                        المراجع: <b>{req.reviewedBy || 'شؤون الطلاب'}</b>
                        {req.reviewedAtUtc && ` (${new Date(req.reviewedAtUtc).toLocaleDateString('ar-EG')})`}
                      </span>
                    </div>
                    <p className="leading-relaxed font-medium pt-0.5">
                      {req.adminResponse}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      <ReviewRequestModal
        isOpen={Boolean(selectedRequestForReview)}
        request={selectedRequestForReview}
        onClose={() => setSelectedRequestForReview(null)}
        onSubmit={onReviewRequest}
        currentUserName={currentUserName}
      />
    </div>
  );
}
