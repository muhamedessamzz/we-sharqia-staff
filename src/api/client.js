const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function apiRequest(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || 'حدث خطأ في الاتصال بالخادم');
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] Failed to call ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (username, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  changePassword: (userId, newPassword) =>
    apiRequest(`/auth/change-password/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    }),
  register: (data) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getUsers: () => apiRequest('/auth/users'),
  adminCreateUser: (data) =>
    apiRequest('/auth/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteUser: (id) =>
    apiRequest(`/auth/users/${id}`, {
      method: 'DELETE',
    }),
  adminUpdateUser: (id, data) =>
    apiRequest(`/auth/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateUserStatus: (id, status) =>
    apiRequest(`/auth/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  syncStudentsFromFile: () =>
    apiRequest('/auth/students/sync-file', {
      method: 'POST',
    }),

  // Assignments
  getAssignments: (onlyPublished = true) =>
    apiRequest(`/assignments?onlyPublished=${onlyPublished}`),
  getAssignmentById: (id) => apiRequest(`/assignments/${id}`),
  createAssignment: (data, teacherId) =>
    apiRequest(`/assignments${teacherId ? `?teacherId=${teacherId}` : ''}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteAssignment: (id) =>
    apiRequest(`/assignments/${id}`, { method: 'DELETE' }),

  // Progress
  getStudentProgress: (studentId) =>
    apiRequest(`/progress/student/${studentId}`),
  getLiveBoard: () => apiRequest('/progress/live'),
  startProgress: (assignmentId, studentId) =>
    apiRequest(`/progress/start/${assignmentId}?studentId=${studentId}`, {
      method: 'POST',
    }),
  updateProgress: (id, data) =>
    apiRequest(`/progress/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  sendEncouragement: (id, message) =>
    apiRequest(`/progress/${id}/message`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
  grantExtraMinutes: (id, minutes) =>
    apiRequest(`/progress/${id}/extra-minutes`, {
      method: 'POST',
      body: JSON.stringify({ minutes }),
    }),
  gradeSubmission: (id, data) =>
    apiRequest(`/progress/${id}/grade`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Announcements
  getAnnouncements: (classroom) =>
    apiRequest(`/announcements${classroom ? `?classroom=${classroom}` : ''}`),
  createAnnouncement: (data, teacherId) =>
    apiRequest(`/announcements${teacherId ? `?teacherId=${teacherId}` : ''}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteAnnouncement: (id) =>
    apiRequest(`/announcements/${id}`, { method: 'DELETE' }),

  // Videos
  getVideos: (studentId) =>
    apiRequest(`/videos${studentId ? `?studentId=${studentId}` : ''}`),
  createVideo: (data) =>
    apiRequest('/videos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  recordView: (id, studentId, data) =>
    apiRequest(`/videos/${id}/view?studentId=${studentId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Skills
  getSkills: (studentId) => apiRequest(`/skills/student/${studentId}`),
  claimSkill: (studentId, skillKey, claimed) =>
    apiRequest(`/skills/claim?studentId=${studentId}&skillKey=${skillKey}&claimed=${claimed}`, {
      method: 'POST',
    }),
  confirmSkill: (studentId, skillKey, confirmed) =>
    apiRequest(`/skills/confirm?studentId=${studentId}&skillKey=${skillKey}&confirmed=${confirmed}`, {
      method: 'POST',
    }),

  // Dashboard
  getStats: () => apiRequest('/dashboard/stats'),
  getParentDashboard: (parentId) => apiRequest(`/dashboard/parent/${parentId}`),

  // Social Worker
  getSocialWorkerData: () => apiRequest('/dashboard/social-worker'),
  createSocialCase: (data) =>
    apiRequest('/dashboard/social-worker/cases', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  addCaseNote: (caseId, data) =>
    apiRequest(`/dashboard/social-worker/cases/${caseId}/notes`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCaseStatus: (caseId, status) =>
    apiRequest(`/dashboard/social-worker/cases/${caseId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  deleteSocialCase: (caseId) =>
    apiRequest(`/dashboard/social-worker/cases/${caseId}`, {
      method: 'DELETE',
    }),
  createStudentNotice: (data) =>
    apiRequest('/dashboard/student-notices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getStudentDisciplineNotices: (studentId = '', category = '', status = '') => {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    return apiRequest(`/dashboard/student-notices?${params.toString()}`);
  },
  resolveStudentNotice: (id) =>
    apiRequest(`/dashboard/student-notices/${id}/resolve`, {
      method: 'PUT',
    }),

  // Manager & Staff Governance
  getManagerOverview: () => apiRequest('/manager/overview'),
  getAuditLogs: (role = '', limit = 50, userId = '') =>
    apiRequest(`/manager/audit-logs?role=${encodeURIComponent(role)}&limit=${limit}${userId ? `&userId=${userId}` : ''}`),
  createAuditLog: (data) =>
    apiRequest('/manager/audit-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getStaffEvaluations: (staffUserId = '') =>
    apiRequest(`/manager/evaluations${staffUserId ? `?staffUserId=${staffUserId}` : ''}`),
  saveStaffEvaluation: (data) =>
    apiRequest('/manager/evaluations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getManagerNotifications: () => apiRequest('/manager/notifications'),
  createStaffNotification: (data) =>
    apiRequest('/manager/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteStaffNotification: (id) =>
    apiRequest(`/manager/notifications/${id}`, {
      method: 'DELETE',
    }),
  getMyNotifications: (userId, role) =>
    apiRequest(`/manager/notifications/my?userId=${userId}&role=${encodeURIComponent(role)}`),
  markNotificationRead: (id, userId, userName, userRole) =>
    apiRequest(`/manager/notifications/${id}/read?userId=${userId}&userName=${encodeURIComponent(userName)}&userRole=${encodeURIComponent(userRole)}`, {
      method: 'POST',
    }),
  acknowledgeNotification: (id, userId, userName, userRole) =>
    apiRequest(`/manager/notifications/${id}/acknowledge?userId=${userId}&userName=${encodeURIComponent(userName)}&userRole=${encodeURIComponent(userRole)}`, {
      method: 'POST',
    }),

  // Operations: Attendance
  staffCheckIn: (data) =>
    apiRequest('/attendance/staff/check-in', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  staffCheckOut: (userId) =>
    apiRequest(`/attendance/staff/check-out?userId=${userId}`, {
      method: 'POST',
    }),
  getTodayStaffAttendance: () => apiRequest('/attendance/staff/today'),
  getMyStaffAttendance: (userId, staffName) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (staffName) params.append('staffName', staffName);
    return apiRequest(`/attendance/staff/my?${params.toString()}`);
  },
  recordStudentAttendance: (data) =>
    apiRequest('/attendance/students/batch', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getClassAttendance: (classroom, date = '') =>
    apiRequest(`/attendance/students?classroom=${encodeURIComponent(classroom)}${date ? `&date=${date}` : ''}`),
  getStudentAttendanceStats: (studentId) =>
    apiRequest(`/attendance/students/stats/${studentId}`),
  getStudentAttendanceHistory: (studentId) =>
    apiRequest(`/attendance/students/history/${studentId}`),
  getStudentSocialCases: (studentId) =>
    apiRequest(`/dashboard/social-worker/student/${studentId}`),

  // Operations: Schedules & Duties
  getClassSchedule: (classroom) =>
    apiRequest(`/schedule?classroom=${encodeURIComponent(classroom)}`),
  getTeacherSchedule: (teacherName, userId = '') =>
    apiRequest(`/schedule/teacher?teacherName=${encodeURIComponent(teacherName || '')}${userId ? `&userId=${encodeURIComponent(userId)}` : ''}`),
  getMasterSchedule: (filters = {}) => {
    const q = new URLSearchParams(filters).toString();
    return apiRequest(`/schedule/master${q ? `?${q}` : ''}`);
  },
  getStaffScheduleList: () => apiRequest('/schedule/staff'),
  linkStaffAccount: (data) =>
    apiRequest('/schedule/staff/link', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAllSchedules: () => apiRequest('/schedule/all'),

  // Operations: Parent Requests
  getAllParentRequests: (status = '') =>
    apiRequest(`/parent-requests${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  reviewParentRequest: (id, data) =>
    apiRequest(`/parent-requests/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Operations: HR (شؤون العاملين والموارد البشرية)
  getHrOverview: () => apiRequest('/hr/overview'),
  getHrAttendance: (date = '', role = 'all') =>
    apiRequest(`/hr/attendance?date=${encodeURIComponent(date)}&role=${encodeURIComponent(role)}`),
  recordHrAttendance: (data) =>
    apiRequest('/hr/attendance/record', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getHrLeaves: () => apiRequest('/hr/leaves'),
  createHrLeave: (data) =>
    apiRequest('/hr/leaves', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateHrLeaveStatus: (id, data) =>
    apiRequest(`/hr/leaves/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getHrInvestigations: () => apiRequest('/hr/investigations'),
  createHrInvestigation: (data) =>
    apiRequest('/hr/investigations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateHrInvestigation: (id, data) =>
    apiRequest(`/hr/investigations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getHrMemos: () => apiRequest('/hr/memos'),
  createHrMemo: (data) =>
    apiRequest('/hr/memos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateHrMemo: (id, data) =>
    apiRequest(`/hr/memos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Operations: Assessment & Remedial Exams (الامتحانات التكوينية والتحسينية)
  getAssessmentOverview: () => apiRequest('/assessment/overview'),
  getExams: (type = 'all', classroom = 'all') =>
    apiRequest(`/assessment/exams?type=${encodeURIComponent(type)}&classroom=${encodeURIComponent(classroom)}`),
  createExam: (data) =>
    apiRequest('/assessment/exams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getExamScores: (examId) => apiRequest(`/assessment/exams/${examId}/scores`),
  saveExamScore: (examId, data) =>
    apiRequest(`/assessment/exams/${examId}/scores`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getRemedialStudents: (classroom = 'all') =>
    apiRequest(`/assessment/remedial-students?classroom=${encodeURIComponent(classroom)}`),
  updateRemedialStatus: (scoreId, data) =>
    apiRequest(`/assessment/scores/${scoreId}/remedial-status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Operations: Sports & Physical Education (التربية الرياضية والأنشطة)
  getSportsOverview: () => apiRequest('/sports/overview'),
  getSportsAssessments: (classroom = 'all', grade = null) => {
    const params = new URLSearchParams({ classroom });
    if (grade) params.append('grade', grade);
    return apiRequest(`/sports/assessments?${params.toString()}`);
  },
  saveSportsAssessment: (data) =>
    apiRequest('/sports/assessments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getSportsTournaments: () => apiRequest('/sports/tournaments'),
  createSportsTournament: (data) =>
    apiRequest('/sports/tournaments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSportsTournament: (id, data) =>
    apiRequest(`/sports/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

