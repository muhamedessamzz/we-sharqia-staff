import { useState, useEffect } from 'react';
import { INITIAL_ABSENCE_LOGS } from '../constants';

const STORAGE_KEY = 'we_sharkia_absence';

export function useAbsenceLogs() {
  const [logs, setLogs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((l) => !['abs-1', 'abs-2', 'abs-3'].includes(l.id));
        }
      }
      return INITIAL_ABSENCE_LOGS;
    } catch (e) {
      return INITIAL_ABSENCE_LOGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {}
  }, [logs]);

  const addLog = (formData) => {
    const days = Number(formData.absenceDaysCount) || 3;
    const newEntry = {
      id: 'abs-' + Date.now(),
      studentName: formData.studentName.trim(),
      grade: formData.classroom.startsWith('A') ? 1 : formData.classroom.startsWith('B') ? 2 : 3,
      classroom: formData.classroom,
      parentName: formData.parentName.trim() || 'ولي الأمر',
      parentPhone: formData.parentPhone.trim() || '01012345678',
      absenceDaysCount: days,
      consecutiveDays: Number(formData.consecutiveDays) || 1,
      lastAbsenceDate: new Date().toISOString().split('T')[0],
      warningLevel: days >= 7 ? 'final' : days >= 5 ? 'second' : 'first',
      actionTaken: formData.actionTaken,
      notified: false,
    };

    setLogs((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  return {
    absenceLogs: logs,
    addAbsenceLog: addLog,
    totalCount: logs.length,
    finalWarningsCount: logs.filter((l) => l.warningLevel === 'final').length,
  };
}
