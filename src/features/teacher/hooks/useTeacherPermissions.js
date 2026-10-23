import { useMemo } from 'react';

export function useTeacherPermissions(user) {
  return useMemo(() => {
    const userRole = user?.role?.toLowerCase() || '';
    const isSuperAdmin = Boolean(user?.isSuperAdmin || userRole === 'admin');
    const isSchoolManager = userRole === 'schoolmanager';
    const isTechnicalEngineer = userRole === 'technicalengineer';
    const isTeachingStaff = ['teacher', 'technicalengineer'].includes(userRole) && !isSuperAdmin;

    const isManagerOrSpecialist = [
      'admin', 'schoolmanager', 'socialworker', 
      'qualitycoordinator', 'studentaffairs', 'it', 'assessmentcoordinator'
    ].includes(userRole) || isSuperAdmin;

    const assignedClasses = (!isManagerOrSpecialist && user?.classroom)
      ? user.classroom.split(',').map((c) => c.trim().toUpperCase()).filter(Boolean)
      : [];

    const isRestricted = isTeachingStaff && assignedClasses.length > 0;

    return {
      userRole,
      isSuperAdmin,
      isSchoolManager,
      isTechnicalEngineer,
      isTeachingStaff,
      isManagerOrSpecialist,
      assignedClasses,
      isRestricted
    };
  }, [user]);
}
