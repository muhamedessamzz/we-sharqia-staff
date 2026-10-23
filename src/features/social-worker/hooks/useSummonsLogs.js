import { useState, useEffect } from 'react';
import { INITIAL_SUMMONS } from '../constants';

const STORAGE_KEY = 'we_sharkia_summons';

export function useSummonsLogs() {
  const [summons, setSummons] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((l) => !['sum-1', 'sum-2'].includes(l.id));
        }
      }
      return INITIAL_SUMMONS;
    } catch (e) {
      return INITIAL_SUMMONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(summons));
    } catch (e) {}
  }, [summons]);

  const addSummon = (summonData) => {
    const newSummon = {
      id: 'sum-' + Date.now(),
      studentName: summonData.studentName,
      parentName: summonData.parentName,
      phoneNumber: summonData.phoneNumber || '01012345678',
      classroom: summonData.classroom || 'A1',
      reason: summonData.reason || 'متابعة شؤون الطالب',
      date: summonData.date || new Date().toISOString().split('T')[0],
      status: 'scheduled',
      outcomeNote: '',
    };
    setSummons((prev) => [newSummon, ...prev]);
    return newSummon;
  };

  const documentMeetingOutcome = (summonId, outcomeNote) => {
    setSummons((prev) =>
      prev.map((s) =>
        s.id === summonId
          ? { ...s, status: 'completed', outcomeNote: outcomeNote.trim() }
          : s
      )
    );
  };

  return {
    summons,
    addSummon,
    documentMeetingOutcome,
    totalCount: summons.length,
    pendingSummonsCount: summons.filter((s) => s.status !== 'completed').length,
  };
}
