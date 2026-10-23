import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api/client';

export function useStaffAttendance(staffList = []) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // all, present, late, left, unregistered
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savingAction, setSavingAction] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTodayStaffAttendance();
      if (Array.isArray(data)) {
        setRecords(data);
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.warn('Failed to load today staff attendance:', err);
      setError(err.message || 'فشل تحميل سجل حضور اليوم');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Combine registered attendance records with all expected staff members
  const mergedStaffAttendance = (staffList || []).map((staff) => {
    const rec = records.find(
      (r) => r.userId === staff.id || (r.userName && r.userName.toLowerCase() === staff.fullName?.toLowerCase())
    );

    let calculatedStatus = 'unregistered';
    if (rec) {
      if (rec.checkOutTimeUtc) {
        calculatedStatus = 'left';
      } else if (rec.status?.toLowerCase() === 'late') {
        calculatedStatus = 'late';
      } else if (rec.status?.toLowerCase() === 'excused') {
        calculatedStatus = 'excused';
      } else {
        calculatedStatus = 'present';
      }
    }

    return {
      userId: staff.id,
      fullName: staff.fullName,
      username: staff.username,
      role: staff.role || 'staff',
      phoneNumber: staff.phoneNumber || '',
      email: staff.email || '',
      hasRecord: Boolean(rec),
      recordId: rec?.id || null,
      status: calculatedStatus,
      rawStatus: rec?.status || 'Unregistered',
      checkInTimeUtc: rec?.checkInTimeUtc || null,
      checkOutTimeUtc: rec?.checkOutTimeUtc || null,
      notes: rec?.notes || '',
    };
  });

  // Calculate metrics
  const totalStaff = mergedStaffAttendance.length;
  const presentCount = mergedStaffAttendance.filter((s) => s.status === 'present').length;
  const lateCount = mergedStaffAttendance.filter((s) => s.status === 'late').length;
  const leftCount = mergedStaffAttendance.filter((s) => s.status === 'left').length;
  const excusedCount = mergedStaffAttendance.filter((s) => s.status === 'excused').length;
  const unregisteredCount = mergedStaffAttendance.filter((s) => s.status === 'unregistered').length;
  const totalAttendedToday = presentCount + lateCount + leftCount + excusedCount;
  const attendanceRate = totalStaff > 0 ? Math.round((totalAttendedToday / totalStaff) * 100) : 0;

  // Filter staff list
  const filteredStaffAttendance = mergedStaffAttendance.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    if (roleFilter !== 'all' && item.role.toLowerCase() !== roleFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.fullName?.toLowerCase().includes(q);
      const matchUser = item.username?.toLowerCase().includes(q);
      const matchPhone = item.phoneNumber?.includes(q);
      if (!matchName && !matchUser && !matchPhone) return false;
    }
    return true;
  });

  // Manual Check In by School Manager
  const manualCheckIn = async (staffUser, status = 'Present', notes = 'تسجيل يدوي بواسطة الإدارة') => {
    setSavingAction(true);
    try {
      await api.staffCheckIn({
        userId: staffUser.userId || staffUser.id,
        userName: staffUser.fullName || staffUser.username,
        fullName: staffUser.fullName || staffUser.username,
        userRole: staffUser.role || 'staff',
        role: staffUser.role || 'staff',
        status: status,
        notes: notes,
      });
      await fetchRecords();
      return true;
    } catch (err) {
      console.error('Error in manual check-in:', err);
      throw err;
    } finally {
      setSavingAction(false);
    }
  };

  // Manual Check Out by School Manager
  const manualCheckOut = async (userId) => {
    setSavingAction(true);
    try {
      await api.staffCheckOut(userId);
      await fetchRecords();
      return true;
    } catch (err) {
      console.error('Error in manual check-out:', err);
      throw err;
    } finally {
      setSavingAction(false);
    }
  };

  return {
    records,
    mergedStaffAttendance,
    filteredStaffAttendance,
    loading,
    error,
    savingAction,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    searchQuery,
    setSearchQuery,
    fetchRecords,
    manualCheckIn,
    manualCheckOut,
    metrics: {
      totalStaff,
      presentCount,
      lateCount,
      leftCount,
      excusedCount,
      unregisteredCount,
      totalAttendedToday,
      attendanceRate,
    },
  };
}
