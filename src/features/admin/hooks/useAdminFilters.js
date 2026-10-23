import { useState, useMemo } from 'react';

export function useAdminFilters(users) {
  const [tab, setTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Staff & Administration users
  const staffAndAdminUsers = useMemo(() => {
    return (users || []).filter((u) => {
      const r = u.role?.toLowerCase();
      return (
        u.isSuperAdmin ||
        [
          'admin',
          'schoolmanager',
          'teacher',
          'technicalengineer',
          'studentaffairs',
          'socialworker',
          'assessmentcoordinator',
          'qualitycoordinator',
          'sportscoach',
          'it',
        ].includes(r)
      );
    });
  }, [users]);

  const counts = useMemo(() => {
    return {
      all: staffAndAdminUsers.length,
      superadmin: staffAndAdminUsers.filter((u) => u.isSuperAdmin || u.role?.toLowerCase() === 'admin').length,
      managers: staffAndAdminUsers.filter((u) => u.role?.toLowerCase() === 'schoolmanager').length,
      teachers: staffAndAdminUsers.filter((u) =>
        ['teacher', 'technicalengineer'].includes(u.role?.toLowerCase())
      ).length,
      specialists: staffAndAdminUsers.filter((u) =>
        ['studentaffairs', 'socialworker', 'assessmentcoordinator', 'qualitycoordinator', 'sportscoach', 'it'].includes(
          u.role?.toLowerCase()
        )
      ).length,
      suspended: staffAndAdminUsers.filter((u) => u.status === 'suspended').length,
      pending: staffAndAdminUsers.filter((u) => u.status === 'pending').length,
    };
  }, [staffAndAdminUsers]);

  const filteredUsers = useMemo(() => {
    return staffAndAdminUsers.filter((u) => {
      const r = u.role?.toLowerCase();

      // Tab filter
      if (tab === 'pending' && u.status !== 'pending') return false;
      if (tab === 'suspended' && u.status !== 'suspended') return false;
      if (tab === 'superadmin' && !(u.isSuperAdmin || r === 'admin')) return false;
      if (tab === 'managers' && r !== 'schoolmanager') return false;
      if (tab === 'teachers' && !['teacher', 'technicalengineer'].includes(r)) return false;
      if (
        tab === 'specialists' &&
        !['studentaffairs', 'socialworker', 'assessmentcoordinator', 'qualitycoordinator', 'sportscoach', 'it'].includes(r)
      ) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = u.fullName?.toLowerCase().includes(q);
        const matchUser = u.username?.toLowerCase().includes(q);
        const matchEmail = u.email?.toLowerCase().includes(q);
        const matchPhone = u.phoneNumber?.includes(q);
        const matchClass = u.classroom?.toLowerCase().includes(q);
        return matchName || matchUser || matchEmail || matchPhone || matchClass;
      }
      return true;
    });
  }, [staffAndAdminUsers, tab, searchQuery]);

  return {
    tab,
    setTab,
    searchQuery,
    setSearchQuery,
    counts,
    filteredUsers,
  };
}
