import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Maximize2, Minimize2, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { parseDriveLink } from '../../utils/driveUtils';

export default function DrivePreviewModal({ isOpen, onClose, url, title = 'معاينة الملف المرفق' }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, url]);

  if (!isOpen || !url) return null;

  const parsed = parseDriveLink(url);
  const embedUrl = parsed?.embedUrl || url;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 transition-all"
      dir="rtl"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-full max-w-5xl h-[88vh] max-h-[850px]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-purple-50 via-white to-purple-50 border-b border-purple-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#5C2C90] text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                {title}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-500">
                <span className="text-[#5C2C90] font-black">معاينة مباشرة داخل المنصة</span>
                <span>·</span>
                <span className="truncate">{parsed?.type ? `نوع الملف: ${parsed.type}` : 'Google Drive'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              title={isFullscreen ? 'تصغير الحجم' : 'تكبير ملء الشاشة'}
            >
              {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#5C2C90] hover:bg-purple-100 rounded-xl transition-all cursor-pointer"
              title="فتح الملف في تبويب خارجي بـ Google Drive"
            >
              <ExternalLink size={17} />
            </a>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              title="إغلاق المعاينة"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Embedded Iframe Container */}
        <div className="flex-1 w-full bg-slate-900/5 relative overflow-hidden flex flex-col">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 space-y-3">
              <div className="w-10 h-10 border-3 border-[#5C2C90] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-slate-600">جاري تحميل المعاينة المباشرة للملف من Google Drive...</p>
            </div>
          )}

          <iframe
            src={embedUrl}
            title={title}
            onLoad={() => setLoading(false)}
            allow="autoplay; encrypted-media; fullscreen"
            className="w-full h-full border-none"
          />
        </div>

        {/* Guidance Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-bold shrink-0 gap-2">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Sparkles size={13} className="text-[#FF6900]" />
            <span>يتم عرض الملف من Google Drive السحابي مباشرة لتوفير استهلاك باقة وسيرفر المنصة.</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <AlertCircle size={12} />
            <span>إذا لم يظهر المحتوى، تأكد أن إذن مشاركة الملف في درايف هو: Anyone with link</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
