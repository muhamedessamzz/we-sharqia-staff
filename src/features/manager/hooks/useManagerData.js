import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api/client';

export function useManagerData(user) {
  const [overview, setOverview] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingAction, setSavingAction] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [ovData, logsData, notifsData] = await Promise.all([
        api.getManagerOverview(),
        api.getAuditLogs('', 60),
        api.getManagerNotifications()
      ]);
      setOverview(ovData);
      setAuditLogs(Array.isArray(logsData) ? logsData : (logsData?.value || []));
      setNotifications(Array.isArray(notifsData) ? notifsData : (notifsData?.value || []));
    } catch (err) {
      console.error('Failed to load manager data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveEvaluation = async (evaluatingStaff, evalForm) => {
    if (!evaluatingStaff) return;
    setSavingAction(true);
    try {
      await api.saveStaffEvaluation({
        staffUserId: evaluatingStaff.id,
        staffUserName: evaluatingStaff.fullName,
        staffRole: evaluatingStaff.role,
        evaluatorId: user?.id || '00000000-0000-0000-0000-000000000000',
        evaluatorName: user?.fullName || 'مدير المدرسة',
        period: 'الفصل الحالي 2026',
        punctualityRating: Number(evalForm.punctuality),
        pedagogyRating: Number(evalForm.pedagogy),
        systemEngagementRating: Number(evalForm.engagement),
        cooperationRating: Number(evalForm.cooperation),
        notes: evalForm.notes,
        recognitionBadge: evalForm.badge
      });

      await loadData();
    } catch (err) {
      alert('حدث خطأ أثناء حفظ التقييم: ' + err.message);
      throw err;
    } finally {
      setSavingAction(false);
    }
  };

  const sendNotification = async (newNotice) => {
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      alert('يرجى كتابة عنوان وتفاصيل التعميم');
      return;
    }

    setSavingAction(true);
    try {
      await api.createStaffNotification({
        senderId: user?.id || '00000000-0000-0000-0000-000000000000',
        senderName: user?.fullName || 'د. خالد السعدني (مدير المدرسة)',
        title: newNotice.title,
        content: newNotice.content,
        targetRole: newNotice.targetRole,
        targetUserId: newNotice.targetUserId ? newNotice.targetUserId : null,
        targetUserName: newNotice.targetUserId
          ? (overview?.staff || []).find(s => s.id === newNotice.targetUserId)?.fullName
          : null,
        priority: newNotice.priority,
        requiresAcknowledgment: newNotice.requiresAcknowledgment
      });

      await loadData();
    } catch (err) {
      alert('حدث خطأ أثناء إرسال التعميم: ' + err.message);
      throw err;
    } finally {
      setSavingAction(false);
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التعميم؟')) return;
    try {
      await api.deleteStaffNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      alert('فشل حذف التعميم: ' + err.message);
    }
  };

  return {
    overview,
    auditLogs,
    notifications,
    loading,
    savingAction,
    loadData,
    saveEvaluation,
    sendNotification,
    deleteNotification
  };
}
