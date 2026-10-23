import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api/client';

export function useParentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllParentRequests();
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.warn('Failed to fetch parent requests:', err);
      setError(err.message || 'فشل تحميل طلبات أولياء الأمور');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const reviewRequest = async (requestId, { status, adminResponse, reviewedBy }) => {
    try {
      await api.reviewParentRequest(requestId, {
        status,
        adminResponse,
        reviewedBy: reviewedBy || 'مسؤول شؤون الطلاب',
      });
      // Refresh list
      await fetchRequests();
      return true;
    } catch (err) {
      console.error('Error reviewing request:', err);
      throw err;
    }
  };

  const filteredRequests = requests.filter((req) => {
    // Status filter
    if (statusFilter !== 'all' && (req.status || 'pending').toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    // Type filter
    if (typeFilter !== 'all' && (req.requestType || '').toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchStudent = req.studentName?.toLowerCase().includes(q);
      const matchParent = req.parentName?.toLowerCase().includes(q);
      const matchPhone = req.parentPhone?.includes(q);
      const matchClass = req.classroom?.toLowerCase().includes(q);
      const matchDetails = (req.details || req.reason || '').toLowerCase().includes(q);
      if (!matchStudent && !matchParent && !matchPhone && !matchClass && !matchDetails) {
        return false;
      }
    }
    return true;
  });

  const pendingCount = requests.filter((r) => (r.status || 'pending').toLowerCase() === 'pending').length;
  const approvedCount = requests.filter((r) => (r.status || '').toLowerCase() === 'approved').length;
  const rejectedCount = requests.filter((r) => (r.status || '').toLowerCase() === 'rejected').length;

  return {
    requests,
    filteredRequests,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    searchQuery,
    setSearchQuery,
    fetchRequests,
    reviewRequest,
    counts: {
      total: requests.length,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
    },
  };
}
