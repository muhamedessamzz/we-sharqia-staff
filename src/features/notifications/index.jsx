import React, { useState, useEffect } from 'react';
import { 
  Bell, Send, Plus, Search, Filter, RefreshCw, 
  CheckCircle2, AlertTriangle, Users, User, Clock, 
  Sparkles, MailCheck 
} from 'lucide-react';
import { api } from '../../api/client';
import NotificationStats from './components/NotificationStats';
import NotificationCard from './components/NotificationCard';
import SendNotificationModal from './components/SendNotificationModal';
import NotificationReceiptsModal from './components/NotificationReceiptsModal';

export default function NotificationsView({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'broadcast' | 'single' | 'urgent'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedReceiptNotice, setSelectedReceiptNotice] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [noticesData, usersData] = await Promise.all([
        api.getManagerNotifications(),
        api.getUsers()
      ]);

      const notices = Array.isArray(noticesData) ? noticesData : (noticesData?.notifications || []);
      setNotifications(notices);

      // Filter staff only
      const users = Array.isArray(usersData) ? usersData : (usersData?.users || []);
      const staff = users.filter(
        u => u.role?.toLowerCase() !== 'student' && u.role?.toLowerCase() !== 'parent'
      );
      setStaffList(staff);
    } catch (err) {
      console.warn('Failed to load notifications data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteNotification = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإشعار نهائياً؟')) return;
    try {
      await api.deleteManagerNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      showToast('تم حذف الإشعار بنجاح');
    } catch (err) {
      alert(err.message || 'تعذر حذف الإشعار');
    }
  };

  const handleNotificationSent = async (payload) => {
    showToast(
      payload.targetRole === 'single_user'
        ? `تم إرسال الإشعار بنجاح إلى: ${payload.targetUserName || 'الموظف المحدد'}`
        : 'تم إرسال التعميم بنجاح إلى جميع العاملين بالمدرسة!'
    );
    await loadData();
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    // Tab Filter
    if (activeFilter === 'broadcast') {
      if (n.targetRole !== 'all' && n.targetRole !== 'all_school') return false;
    } else if (activeFilter === 'single') {
      if (n.targetRole !== 'single_user') return false;
    } else if (activeFilter === 'urgent') {
      if (n.priority !== 'urgent' && n.priority !== 'administrative') return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = n.title?.toLowerCase().includes(q);
      const matchContent = n.content?.toLowerCase().includes(q);
      const matchTarget = n.targetUserName?.toLowerCase().includes(q) || n.targetRole?.toLowerCase().includes(q);
      return matchTitle || matchContent || matchTarget;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-[120] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-black animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#5C2C90] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              إدارة المنظومة المدرسية
            </span>
            <span className="text-xs font-black text-slate-400">•</span>
            <span className="text-xs font-bold text-slate-500">
              {staffList.length} أعضاء بالطاقم
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            مركز الإشعارات والتنبيهات المدرسية
          </h2>
          <p className="text-xs font-bold text-slate-500">
            إرسال التعميمات والتوجيهات الإدارية لطاقم المدرسة بالكامل أو لموظف بعينه مع متابعة نسب الاطلاع بالاسم والتوقيت
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="p-2.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            onClick={() => setIsSendModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-md shadow-purple-950/20 transition-all cursor-pointer active:scale-[0.98]"
          >
            <Plus size={18} />
            <span>إرسال إشعار جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <NotificationStats notifications={notifications} />

      {/* Filter Tabs and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#5C2C90] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            جميع الإشعارات ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('broadcast')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeFilter === 'broadcast'
                ? 'bg-[#5C2C90] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الاستف بالكامل ({notifications.filter(n => n.targetRole === 'all' || n.targetRole === 'all_school').length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('single')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeFilter === 'single'
                ? 'bg-[#5C2C90] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            إشعارات فردية لموظفين ({notifications.filter(n => n.targetRole === 'single_user').length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('urgent')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeFilter === 'urgent'
                ? 'bg-[#5C2C90] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            عاجل وإداري ({notifications.filter(n => n.priority === 'urgent' || n.priority === 'administrative').length})
          </button>
        </div>

        {/* Live Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="ابحث بالعنوان، المحتوى، أو اسم الموظف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-9 pl-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/30"
          />
          <Search size={15} className="absolute right-3 top-2.5 text-slate-400" />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <RefreshCw size={28} className="mx-auto text-[#5C2C90] animate-spin mb-3" />
            <p className="text-xs font-bold text-slate-500">جارٍ تحميل مركز الإشعارات...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-purple-50 text-[#5C2C90] flex items-center justify-center">
              <Bell size={28} />
            </div>
            <h4 className="text-sm font-black text-slate-900">لا توجد إشعارات مطابقة</h4>
            <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto">
              {searchQuery ? 'لم يتم العثور على أي إشعار يطابق كلمة البحث.' : 'لم يتم إرسال أي إشعارات ضمن هذه الفئة حتى الآن.'}
            </p>
            <button
              type="button"
              onClick={() => setIsSendModalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#5C2C90] text-xs font-black transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>إرسال أول إشعار الآن</span>
            </button>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onViewReceipts={setSelectedReceiptNotice}
              onDelete={handleDeleteNotification}
            />
          ))
        )}
      </div>

      {/* Send Notification Modal */}
      <SendNotificationModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        staffList={staffList}
        currentUser={user}
        onNotificationSent={handleNotificationSent}
      />

      {/* Notification Receipts Detail Modal */}
      <NotificationReceiptsModal
        isOpen={Boolean(selectedReceiptNotice)}
        onClose={() => setSelectedReceiptNotice(null)}
        notification={selectedReceiptNotice}
      />
    </div>
  );
}
