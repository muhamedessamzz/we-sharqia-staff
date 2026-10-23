import { useState, useEffect } from 'react';
import { INITIAL_DISRUPTION_LOGS } from '../constants';

const STORAGE_KEY = 'we_sharkia_disruptions';

export function useDisruptionLogs() {
  const [logs, setLogs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((l) => !['dis-1', 'dis-2'].includes(l.id));
        }
      }
      return INITIAL_DISRUPTION_LOGS;
    } catch (e) {
      return INITIAL_DISRUPTION_LOGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {}
  }, [logs]);

  const addLog = (formData) => {
    const newEntry = {
      id: 'dis-' + Date.now(),
      studentName: formData.studentName.trim(),
      grade: formData.classroom.startsWith('A') ? 1 : formData.classroom.startsWith('B') ? 2 : 3,
      classroom: formData.classroom,
      parentName: formData.parentName.trim() || 'ولي الأمر',
      parentPhone: formData.parentPhone.trim() || '01012345678',
      date: new Date().toISOString().split('T')[0],
      location: formData.location,
      incidentSummary: formData.incidentSummary.trim(),
      severity: formData.severity,
      disciplinaryAction: formData.disciplinaryAction.trim(),
      notifiedParent: false,
      status: formData.severity === 'high' ? 'underCommittee' : 'active',
    };

    setLogs((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  return {
    disruptionLogs: logs,
    addDisruptionLog: addLog,
    totalCount: logs.length,
    underCommitteeCount: logs.filter((d) => d.status === 'underCommittee').length,
  };
}
