import { useState } from 'react';
import { api } from '../../../api/client';
import { transliterate } from '../utils/transliterate';

export function useBulkEnrollment(onSuccess, showToast) {
  const [isOpen, setIsOpen] = useState(false);
  const [bulkData, setBulkData] = useState({
    grade: 1,
    classroom: 'A1',
    namesText: '',
    defaultPassword: 'student123',
    usernameFormat: 'name_class',
  });
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const normalizeDigits = (val) => {
    if (!val) return '';
    return val.replace(/[٠-٩]/g, (d) => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
  };

  const getPreviewList = () => {
    const rawLines = bulkData.namesText.split('\n').map((l) => l.trim()).filter(Boolean);
    const cls = bulkData.classroom?.toLowerCase() || 'a1';

    // Filter out table divider lines or header lines
    const lines = rawLines.filter((l) => {
      if (/^-+$/.test(l.replace(/[\s|+-]/g, ''))) return false;
      if (/school\s*code|student\s*name|national\s*id|كود الطالب|اسم الطالب|الرقم القومي/i.test(l)) return false;
      return true;
    });

    return lines.map((line, index) => {
      // Check if line is tab, comma, semicolon, or pipe separated
      const cols = line.split(/[\t,;|]+/).map((c) => c.trim()).filter(Boolean);
      let fullName = line;
      let studentCode = '';
      let nationalId = '';
      let phoneNumber = null;
      let parentPhone = null;

      if (cols.length >= 2) {
        const firstIsCode = /^\d{5,10}$/.test(normalizeDigits(cols[0]));
        if (firstIsCode) {
          studentCode = normalizeDigits(cols[0]);
          fullName = cols[1];
          if (cols[2]) nationalId = normalizeDigits(cols[2]).replace(/[\s-]/g, '');
          if (cols[3]) phoneNumber = normalizeDigits(cols[3]);
          if (cols[4]) parentPhone = normalizeDigits(cols[4]);
        } else {
          fullName = cols[0];
          if (cols.length >= 3) {
            studentCode = normalizeDigits(cols[1]);
            nationalId = normalizeDigits(cols[2]).replace(/[\s-]/g, '');
            if (cols[3]) phoneNumber = normalizeDigits(cols[3]);
            if (cols[4]) parentPhone = normalizeDigits(cols[4]);
          } else {
            const secondCol = normalizeDigits(cols[1]).replace(/[\s-]/g, '');
            if (secondCol.length === 14) {
              nationalId = secondCol;
            } else {
              studentCode = secondCol;
            }
          }
        }
      }

      if (!studentCode) {
        const parts = transliterate(fullName).split('_').filter(Boolean);
        const twoNames = parts.slice(0, 2).join('_') || 'std';
        if (bulkData.usernameFormat === 'code') {
          const num = String(index + 1).padStart(2, '0');
          studentCode = `std_${num}_${cls}`;
        } else {
          studentCode = `${twoNames}_${cls}`;
        }
      }

      const hasValidNatId = nationalId.length === 14;
      const password = hasValidNatId ? nationalId : (bulkData.defaultPassword || 'student123');

      return {
        fullName,
        username: studentCode.toLowerCase(),
        studentCode,
        nationalId: hasValidNatId ? nationalId : null,
        password,
        phoneNumber,
        parentPhone,
        grade: Number(bulkData.grade),
        classroom: bulkData.classroom,
        role: 'Student',
      };
    });
  };

  const submitBulkEnrollment = async (e) => {
    if (e) e.preventDefault();
    const studentsToCreate = getPreviewList();
    if (studentsToCreate.length === 0) {
      alert('أدخل بيانات الطلاب أولًا');
      return;
    }

    setSubmitting(true);
    setProgress({ current: 0, total: studentsToCreate.length });

    let createdCount = 0;
    const errors = [];

    for (let i = 0; i < studentsToCreate.length; i++) {
      const s = studentsToCreate[i];
      setProgress({ current: i + 1, total: studentsToCreate.length });
      try {
        await api.adminCreateUser({
          fullName: s.fullName,
          username: s.username,
          studentCode: s.studentCode,
          nationalId: s.nationalId,
          password: s.password,
          phoneNumber: s.phoneNumber,
          parentPhone: s.parentPhone,
          role: 'Student',
          grade: s.grade,
          classroom: s.classroom,
          isSuperAdmin: false,
        });
        createdCount++;
      } catch (err) {
        errors.push(`تعذر إضافة "${s.fullName}": ${err.message}`);
      }
    }

    setSubmitting(false);
    setIsOpen(false);
    setBulkData((prev) => ({ ...prev, namesText: '' }));

    if (onSuccess) await onSuccess();

    if (errors.length > 0) {
      showToast(`تمت إضافة ${createdCount} طالب، وتعذر إضافة ${errors.length}`, 'error');
    } else {
      showToast(`تمت إضافة ${createdCount} طالب بنجاح`);
    }
  };

  return {
    isOpen,
    setIsOpen,
    bulkData,
    setBulkData,
    submitting,
    progress,
    previewList: getPreviewList(),
    submitBulkEnrollment,
  };
}
