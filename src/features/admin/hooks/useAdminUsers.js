import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api/client';

export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showFeedback = useCallback((text, type = 'success', duration = 3500) => {
    setFeedback({ text, type });
    if (duration > 0) {
      setTimeout(() => setFeedback(null), duration);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      // Ensure master root admin is NEVER shown on dashboard
      const visibleUsers = (data || []).filter(
        (u) =>
          u.username?.toLowerCase() !== 'zakaria' &&
          u.email?.toLowerCase() !== 'zakaria@sharqia.gfd.com'
      );
      setUsers(visibleUsers);
    } catch (e) {
      console.warn('Failed loading users', e);
      showFeedback('فشل تحميل قائمة المستخدمين من الخادم', 'error');
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const updateUserStatus = async (userId, newStatus, userName) => {
    try {
      await api.updateUserStatus(userId, newStatus);
      const actionName = newStatus === 3 ? 'تجميد وإيقاف' : newStatus === 1 ? 'تفعيل' : 'تحديث حالة';
      showFeedback(`تم ${actionName} حساب "${userName}" بنجاح`, 'success');
      await loadUsers();
    } catch (e) {
      alert('خطأ: ' + e.message);
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف حساب "${userName}" نهائياً من النظام؟`)) {
      return;
    }
    try {
      await api.deleteUser(userId);
      showFeedback(`تم حذف حساب "${userName}" بنجاح`, 'success', 4000);
      await loadUsers();
    } catch (e) {
      alert('فشل حذف المستخدم: ' + e.message);
    }
  };

  const createUser = async (payload) => {
    setIsSubmitting(true);
    try {
      await api.adminCreateUser(payload);
      showFeedback(
        `تم إنشاء حساب "${payload.fullName}" (${payload.isSuperAdmin ? 'سوبر أدمن' : payload.role}) بنجاح وبصلاحية تفعيل فورية!`,
        'success'
      );
      await loadUsers();
      return true;
    } catch (err) {
      showFeedback(err.message || 'فشل إنشاء المستخدم', 'error', 5000);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUser = async (userId, payload) => {
    setIsSubmitting(true);
    try {
      await api.adminUpdateUser(userId, payload);
      showFeedback(`تم تحديث بيانات الحساب "${payload.fullName}" بنجاح!`, 'success');
      await loadUsers();
      return true;
    } catch (err) {
      showFeedback(err.message || 'فشل تحديث بيانات الحساب', 'error', 5000);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    users,
    loading,
    feedback,
    isSubmitting,
    showFeedback,
    setFeedback,
    refreshUsers: loadUsers,
    updateUserStatus,
    deleteUser,
    createUser,
    updateUser,
  };
}
