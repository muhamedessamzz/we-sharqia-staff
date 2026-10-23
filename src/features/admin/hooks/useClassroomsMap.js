import { useState, useEffect } from 'react';
import { DEFAULT_GRADE_CLASSROOMS, STAGES_CONFIG } from '../constants';

export function useClassroomsMap(users) {
  const [selectedStage, setSelectedStage] = useState(1);
  const [selectedClassroom, setSelectedClassroom] = useState('all');
  const [classroomsMap, setClassroomsMap] = useState(DEFAULT_GRADE_CLASSROOMS);
  const [newClassInput, setNewClassInput] = useState('');
  const [isAddingClassInline, setIsAddingClassInline] = useState(false);

  // Dynamically discover and merge any existing classrooms from students/users
  useEffect(() => {
    if (!users || users.length === 0) return;
    setClassroomsMap((prev) => {
      const merged = {
        1: [...(prev[1] || DEFAULT_GRADE_CLASSROOMS[1])],
        2: [...(prev[2] || DEFAULT_GRADE_CLASSROOMS[2])],
        3: [...(prev[3] || DEFAULT_GRADE_CLASSROOMS[3])],
      };
      users.forEach((u) => {
        if (u.grade && u.classroom && merged[u.grade]) {
          const cls = u.classroom.toUpperCase().trim();
          if (!merged[u.grade].includes(cls)) {
            merged[u.grade].push(cls);
            merged[u.grade].sort();
          }
        }
      });
      return merged;
    });
  }, [users]);

  const addClassroom = (grade, className) => {
    let clean = className?.trim().toUpperCase();
    if (!clean) return;
    const stage = STAGES_CONFIG.find((s) => s.grade === Number(grade));
    if (stage && /^\d+$/.test(clean)) {
      clean = `${stage.letter}${clean}`;
    }
    setClassroomsMap((prev) => {
      const currentList = prev[grade] || [];
      if (currentList.includes(clean)) return prev;
      return {
        ...prev,
        [grade]: [...currentList, clean].sort(),
      };
    });
    setNewClassInput('');
    setIsAddingClassInline(false);
    setSelectedClassroom(clean);
  };

  return {
    selectedStage,
    setSelectedStage,
    selectedClassroom,
    setSelectedClassroom,
    classroomsMap,
    newClassInput,
    setNewClassInput,
    isAddingClassInline,
    setIsAddingClassInline,
    addClassroom,
  };
}
