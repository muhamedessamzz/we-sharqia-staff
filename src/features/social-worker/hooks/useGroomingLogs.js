import { useState, useEffect } from 'react';
import { INITIAL_GROOMING_LOGS } from '../constants';

const STORAGE_KEY = 'we_sharkia_grooming';

export function useGroomingLogs() {
  const [logs, setLogs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((l) => !['grm-1', 'grm-2', 'grm-3'].includes(l.id));
        }
      }
      return INITIAL_GROOMING_LOGS;
    } catch (e) {
      return INITIAL_GROOMING_LOGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {}
  }, [logs]);

  const addLog = (formData) => {
    const newEntry = {
      id: 'grm-' + Date.now(),
      studentName: formData.studentName.trim(),
      grade: formData.classroom.startsWith('A') ? 1 : formData.classroom.startsWith('B') ? 2 : 3,
      classroom: formData.classroom,
      parentName: formData.parentName.trim() || 'ولي الأمر',
      parentPhone: formData.parentPhone.trim() || '01012345678',
      date: new Date().toISOString().split('T')[0],
      violationType: formData.violationType,
      violationTitle:
        formData.violationType === 'haircut'
          ? 'قصة شعر طويلة مخالفة للائحة مدرسة WE'
          : formData.violationType === 'uniform'
          ? 'عدم الالتزام بزي مدارس WE الموحد'
          : 'ملاحظة نظافة شخصية ومظهر عام',
      actionTaken: formData.actionTaken,
      status: 'pending',
      notifiedViaWhatsapp: false,
    };

    setLogs((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  const resolveLog = (id) => {
    setLogs((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: 'resolved' } : g))
    );
  };

  return {
    groomingLogs: logs,
    addGroomingLog: addLog,
    resolveGroomingLog: resolveLog,
    pendingCount: logs.filter((g) => g.status === 'pending').length,
  };
}
