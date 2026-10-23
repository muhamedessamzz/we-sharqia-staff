import { useState, useMemo } from 'react';

export function useTeacherFilters({ liveStudents = [], assignedClasses = [], isRestricted = false }) {
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [assignmentTypeFilter, setAssignmentTypeFilter] = useState('all');
  const [gradingAssignmentFilter, setGradingAssignmentFilter] = useState('all');
  const [gradingStatusFilter, setGradingStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Scoped student records for teacher's assigned classes
  const scopedStudents = useMemo(() => {
    return isRestricted
      ? liveStudents.filter(s => assignedClasses.includes(s.classroom?.toUpperCase()))
      : liveStudents;
  }, [liveStudents, isRestricted, assignedClasses]);

  const classFilteredStudents = useMemo(() => {
    return scopedStudents.filter(s => {
      if (filterClass === 'all') return true;
      return s.classroom?.toUpperCase() === filterClass.toUpperCase();
    });
  }, [scopedStudents, filterClass]);

  const liveFiltered = useMemo(() => {
    return classFilteredStudents.filter(s => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'help') return s.status === 2 || s.helpTypeRequested;
      if (filterStatus === 'working') return s.status === 1;
      if (filterStatus === 'done') return s.status === 4;
      return true;
    });
  }, [classFilteredStudents, filterStatus]);

  const helpCount = useMemo(() => {
    return classFilteredStudents.filter(s => s.status === 2 || s.helpTypeRequested).length;
  }, [classFilteredStudents]);

  const workingCount = useMemo(() => {
    return classFilteredStudents.filter(s => s.status === 1).length;
  }, [classFilteredStudents]);

  const doneCount = useMemo(() => {
    return classFilteredStudents.filter(s => s.status === 4).length;
  }, [classFilteredStudents]);

  // Submissions for grading
  const submissionsList = useMemo(() => {
    return scopedStudents.filter(s => s.status === 4 || s.isGraded || s.manualGrade != null);
  }, [scopedStudents]);

  const filteredSubmissions = useMemo(() => {
    return submissionsList.filter(s => {
      if (gradingAssignmentFilter !== 'all' && s.assignmentId !== gradingAssignmentFilter) return false;
      if (filterClass !== 'all' && s.classroom?.toUpperCase() !== filterClass.toUpperCase()) return false;
      if (gradingStatusFilter === 'graded' && !s.isGraded) return false;
      if (gradingStatusFilter === 'pending' && s.isGraded) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = s.studentName?.toLowerCase().includes(q);
        const matchTitle = s.assignmentTitle?.toLowerCase().includes(q);
        return matchName || matchTitle;
      }
      return true;
    });
  }, [submissionsList, gradingAssignmentFilter, filterClass, gradingStatusFilter, searchQuery]);

  return {
    filterClass,
    setFilterClass,
    filterStatus,
    setFilterStatus,
    assignmentTypeFilter,
    setAssignmentTypeFilter,
    gradingAssignmentFilter,
    setGradingAssignmentFilter,
    gradingStatusFilter,
    setGradingStatusFilter,
    searchQuery,
    setSearchQuery,
    scopedStudents,
    classFilteredStudents,
    liveFiltered,
    helpCount,
    workingCount,
    doneCount,
    submissionsList,
    filteredSubmissions
  };
}
