import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api/client';

export function useSocialWorkerData() {
  const [data, setData] = useState({ cases: [], students: [], earlyWarnings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getSocialWorkerData();
      setData(res || { cases: [], students: [], earlyWarnings: [] });
    } catch (err) {
      console.error('Failed to load social worker data', err);
      setError(err.message || 'فشل في تحميل بيانات الأخصائي');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createCase = async (casePayload) => {
    const res = await api.createSocialCase(casePayload);
    await loadData();
    return res;
  };

  const addCaseNote = async (caseId, notePayload) => {
    const res = await api.addCaseNote(caseId, notePayload);
    await loadData();
    return res;
  };

  const updateCaseStatus = async (caseId, newStatus) => {
    const res = await api.updateCaseStatus(caseId, newStatus);
    await loadData();
    return res;
  };

  const deleteCase = async (caseId) => {
    if (api.deleteSocialCase) {
      await api.deleteSocialCase(caseId);
    }
    setData((prev) => ({
      ...prev,
      cases: prev.cases.filter((c) => c.id !== caseId),
    }));
  };

  return {
    data,
    loading,
    error,
    refreshData: loadData,
    createCase,
    addCaseNote,
    updateCaseStatus,
    deleteCase,
  };
}
