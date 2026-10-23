import { useState, useMemo } from 'react';

export function useStudentFilters(students) {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');

  const filteredStudents = useMemo(() => {
    return (students || []).filter((s) => {
      if (gradeFilter !== 'all' && s.grade !== Number(gradeFilter)) return false;
      if (classFilter !== 'all' && s.classroom?.toUpperCase() !== classFilter.toUpperCase()) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = s.fullName?.toLowerCase().includes(q);
        const matchUser = s.username?.toLowerCase().includes(q);
        return matchName || matchUser;
      }
      return true;
    });
  }, [students, gradeFilter, classFilter, searchTerm]);

  const counts = useMemo(() => {
    const list = students || [];
    return {
      total: list.length,
      grade1: list.filter((s) => s.grade === 1).length,
      grade2: list.filter((s) => s.grade === 2).length,
      grade3: list.filter((s) => s.grade === 3).length,
      a1: list.filter((s) => s.grade === 1 && s.classroom?.toUpperCase() === 'A1').length,
      a2: list.filter((s) => s.grade === 1 && s.classroom?.toUpperCase() === 'A2').length,
      a3: list.filter((s) => s.grade === 1 && s.classroom?.toUpperCase() === 'A3').length,
      a4: list.filter((s) => s.grade === 1 && s.classroom?.toUpperCase() === 'A4').length,
      b1: list.filter((s) => s.grade === 2 && s.classroom?.toUpperCase() === 'B1').length,
      b2: list.filter((s) => s.grade === 2 && s.classroom?.toUpperCase() === 'B2').length,
      b3: list.filter((s) => s.grade === 2 && s.classroom?.toUpperCase() === 'B3').length,
      c1: list.filter((s) => s.grade === 3 && s.classroom?.toUpperCase() === 'C1').length,
      c2: list.filter((s) => s.grade === 3 && s.classroom?.toUpperCase() === 'C2').length,
    };
  }, [students]);

  return {
    searchTerm,
    setSearchTerm,
    gradeFilter,
    setGradeFilter,
    classFilter,
    setClassFilter,
    filteredStudents,
    counts,
  };
}
