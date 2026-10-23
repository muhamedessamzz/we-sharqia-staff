import { useState, useMemo } from 'react';

export function useManagerFilters({ staff = [], auditLogs = [] }) {
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditRoleFilter, setAuditRoleFilter] = useState('all');

  const filteredStaff = useMemo(() => {
    return staff.filter(item => {
      const matchesRole = roleFilter === 'all' || item.role?.toLowerCase() === roleFilter.toLowerCase();
      const matchesSearch = !searchQuery.trim() ||
        item.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [staff, roleFilter, searchQuery]);

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      return auditRoleFilter === 'all' || log.userRole?.toLowerCase() === auditRoleFilter.toLowerCase();
    });
  }, [auditLogs, auditRoleFilter]);

  return {
    roleFilter,
    setRoleFilter,
    searchQuery,
    setSearchQuery,
    auditRoleFilter,
    setAuditRoleFilter,
    filteredStaff,
    filteredAuditLogs
  };
}
