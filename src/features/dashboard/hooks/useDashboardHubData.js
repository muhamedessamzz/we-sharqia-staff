import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api/client';

export function useDashboardHubData() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [managerOverview, setManagerOverview] = useState(null);
  const [parentRequests, setParentRequests] = useState([]);
  const [staffAttendance, setStaffAttendance] = useState([]);
  const [socialData, setSocialData] = useState(null);
  const [students, setStudents] = useState([]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, mgrRes, reqsRes, attRes, socRes, usersRes] = await Promise.allSettled([
        api.getStats(),
        api.getManagerOverview(),
        api.getAllParentRequests(),
        api.getTodayStaffAttendance(),
        api.getSocialWorkerData(),
        api.getUsers()
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (mgrRes.status === 'fulfilled') setManagerOverview(mgrRes.value);
      if (reqsRes.status === 'fulfilled' && Array.isArray(reqsRes.value)) setParentRequests(reqsRes.value);
      if (attRes.status === 'fulfilled' && Array.isArray(attRes.value)) setStaffAttendance(attRes.value);
      if (socRes.status === 'fulfilled') setSocialData(socRes.value);
      if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value)) {
        const stds = usersRes.value.filter((u) => u.role?.toLowerCase() === 'student');
        setStudents(stds);
      }
    } catch (e) {
      console.warn('Dashboard hub data loading issue:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Derived calculations
  const totalStudents = stats?.totalStudents ?? students.length ?? 0;
  const staffList = managerOverview?.staff || [];
  const totalStaff = managerOverview?.totalStaffCount || staffList.length || 0;
  const activeStaffToday = managerOverview?.activeTodayStaffCount || staffAttendance.length || 0;
  const staffAttendanceRate = totalStaff > 0 ? Math.round((activeStaffToday / totalStaff) * 100) : 0;

  const totalAssignments = stats?.totalAssignments || 0;
  const completedProgresses = stats?.completedSubmissions ?? stats?.completedProgresses ?? 0;
  const completionRate = stats?.submissionRatePercent ?? stats?.completionRate ?? 0;

  const pendingRequests = parentRequests.filter((r) => (r.status || 'pending').toLowerCase() === 'pending').length;
  const activeCasesCount = socialData?.cases?.length || 0;

  return {
    loading,
    refresh: loadAll,
    stats,
    students,
    managerOverview,
    parentRequests,
    staffAttendance,
    socialData,
    metrics: {
      totalStudents,
      totalStaff,
      activeStaffToday,
      staffAttendanceRate,
      totalAssignments,
      completedProgresses,
      completionRate,
      pendingRequests,
      activeCasesCount,
    },
    honorRoll: stats?.honorRoll || [],
  };
}
