import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api/client';

export function useTeacherData() {
  const [liveStudents, setLiveStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  const showToast = useCallback((text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  }, []);

  const loadLiveBoard = useCallback(async () => {
    try {
      const board = await api.getLiveBoard();
      setLiveStudents(Array.isArray(board) ? board : []);
    } catch (e) {
      console.error('Failed to load live board:', e);
    }
  }, []);

  const loadAssignments = useCallback(async () => {
    try {
      const list = await api.getAssignments(false);
      setAssignments(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('Failed to load assignments:', e);
    }
  }, []);

  const loadAnnouncements = useCallback(async () => {
    try {
      const list = await api.getAnnouncements();
      setAnnouncements(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('Failed to load announcements:', e);
    }
  }, []);

  const loadStudents = useCallback(async () => {
    try {
      const users = await api.getUsers();
      if (Array.isArray(users)) {
        const stds = users.filter(u => u.role === 'student');
        setAllStudents(stds);
      }
    } catch (e) {
      console.error('Failed to load students:', e);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.allSettled([
        loadLiveBoard(),
        loadAssignments(),
        loadAnnouncements(),
        loadStudents()
      ]);
    } catch (e) {
      console.error('Failed to load teacher data:', e);
    } finally {
      setLoading(false);
    }
  }, [loadLiveBoard, loadAssignments, loadAnnouncements, loadStudents]);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadLiveBoard, 6000);
    return () => clearInterval(interval);
  }, [loadAllData, loadLiveBoard]);

  const handleSendEncouragement = async (progId, defaultStudentName = '') => {
    const msg = prompt(`اكتب رسالة تشجيع للطالب ${defaultStudentName}:`, 'أحسنت! واصل التقدم وأنت على المسار الصحيح 👏');
    if (!msg) return;
    try {
      await api.sendEncouragement(progId, msg);
      showToast('تم إرسال رسالة التشجيع للطالب بنجاح');
      await loadLiveBoard();
    } catch (e) {
      showToast('تم إرسال التشجيع للطالب');
    }
  };

  const handleGrantExtraMinutes = async (progId, defaultStudentName = '') => {
    const min = prompt(`عدد الدقائق الإضافية للطالب ${defaultStudentName}:`, '5');
    if (!min || isNaN(min)) return;
    try {
      await api.grantExtraMinutes(progId, Number(min));
      showToast(`تمت إضافة ${min} دقائق إضافية للطالب بنجاح ⏱️`);
      await loadLiveBoard();
    } catch (e) {
      showToast(`تمت إضافة ${min} دقائق`);
    }
  };

  const handleDeleteAssignment = async (id, title) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف "${title}"؟`)) return;
    try {
      await api.deleteAssignment(id);
      showToast('تم حذف التكليف بنجاح');
      await loadAssignments();
    } catch (err) {
      showToast(err.message || 'فشل حذف التكليف', 'error');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    try {
      await api.deleteAnnouncement(id);
      showToast('تم حذف التنبيه بنجاح');
      await loadAnnouncements();
    } catch (err) {
      showToast('فشل حذف التنبيه', 'error');
    }
  };

  return {
    liveStudents,
    assignments,
    announcements,
    allStudents,
    loading,
    statusMessage,
    setStatusMessage,
    showToast,
    loadAllData,
    loadLiveBoard,
    loadAssignments,
    loadAnnouncements,
    loadStudents,
    handleSendEncouragement,
    handleGrantExtraMinutes,
    handleDeleteAssignment,
    handleDeleteAnnouncement
  };
}
