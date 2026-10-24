/**
 * Date and Time utilities for WeSharkia Platform (Arabic Locale)
 */

export function formatDateTimeArabic(dateInput) {
  if (!dateInput) return '—';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '—';

  return d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function formatTimeOnlyArabic(dateInput) {
  if (!dateInput) return '—';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '—';

  return d.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function formatDateOnlyArabic(dateInput) {
  if (!dateInput) return '—';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '—';

  return d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function calculateDurationArabic(startDate, finishDate) {
  if (!startDate || !finishDate) return '—';
  const start = new Date(startDate).getTime();
  const finish = new Date(finishDate).getTime();
  if (isNaN(start) || isNaN(finish)) return '—';

  const diffMs = finish - start;
  if (diffMs <= 0) return 'أقل من دقيقة';

  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} ثانية`;
  }
  if (minutes < 60) {
    return seconds > 0 ? `${minutes} دقيقة و ${seconds} ثانية` : `${minutes} دقيقة`;
  }
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return `${hours} ساعة و ${remMinutes} دقيقة`;
}

export function isDeadlinePassed(dueDate) {
  if (!dueDate) return false;
  const d = new Date(dueDate);
  if (isNaN(d.getTime())) return false;
  return new Date() > d;
}
