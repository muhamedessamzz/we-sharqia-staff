import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api/client';
import { transliterate } from '../utils/transliterate';

export function useStudentAffairsData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const showToast = useCallback((text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users for student affairs', err);
      showToast('تعذر تحميل بيانات الطلاب من الخادم', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const syncStudentsFromFile = async () => {
    setSyncing(true);
    try {
      await api.syncStudentsFromFile();
      await loadUsers();
      showToast('تمت مزامنة وتحديث قوائم الطلاب بنجاح من ملف students.json 📁');
    } catch (err) {
      console.error('Failed to sync students', err);
      showToast(err.message || 'فشلت المزامنة مع ملف students.json', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const addStudent = async (form) => {
    let cleanUsername = form.username.trim().toLowerCase();
    if (!cleanUsername) {
      const cls = form.classroom.trim().toLowerCase();
      const transliterated = transliterate(form.fullName.trim());
      const parts = transliterated ? transliterated.split('_').filter(Boolean) : [];
      const twoNames = parts.length >= 2 ? `${parts[0]}_${parts[1]}` : parts[0] || 'std';
      cleanUsername = `${twoNames}_${cls}`;
    }

    await api.adminCreateUser({
      fullName: form.fullName.trim(),
      username: cleanUsername,
      password: form.password || 'student123',
      role: 0, // Student enum value
      grade: Number(form.grade),
      classroom: form.classroom.trim().toUpperCase(),
      phoneNumber: form.phoneNumber?.trim() || null,
      isSuperAdmin: false,
    });

    showToast(`تم تسجيل الطالب "${form.fullName}" بنجاح في فصل ${form.classroom.toUpperCase()}`);
    await loadUsers();
  };

  const updateStudent = async (studentId, form) => {
    await api.adminUpdateUser(studentId, {
      fullName: form.fullName.trim(),
      grade: Number(form.grade),
      classroom: form.classroom.trim().toUpperCase(),
      phoneNumber: form.phoneNumber?.trim() || null,
      parentConsent: form.parentConsent,
      status: form.status,
    });

    showToast(`تم تحديث بيانات الطالب "${form.fullName}" بنجاح`);
    await loadUsers();
  };

  const deleteStudent = async (student) => {
    await api.deleteUser(student.id);
    showToast(`تم حذف الطالب "${student.fullName}" من السجلات`);
    await loadUsers();
  };

  const students = users.filter((u) => u.role?.toLowerCase() === 'student');

  return {
    students,
    loading,
    syncing,
    statusMessage,
    setStatusMessage,
    showToast,
    refreshStudents: loadUsers,
    syncStudentsFromFile,
    addStudent,
    updateStudent,
    deleteStudent,
  };
}
