import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { api } from '../../api/client';
import { useTeacherPermissions } from './hooks/useTeacherPermissions';
import { useTeacherData } from './hooks/useTeacherData';
import { useTeacherFilters } from './hooks/useTeacherFilters';
import TeacherHeader from './components/TeacherHeader';
import TeacherNavigationTabs from './components/TeacherNavigationTabs';
import LiveBoardTab from './components/tabs/LiveBoardTab';
import StudentAttendanceTab from './components/tabs/StudentAttendanceTab';
import TeacherMyAttendanceTab from './components/tabs/TeacherMyAttendanceTab';
import TeacherScheduleTab from './components/tabs/TeacherScheduleTab';
import AssignmentsTab from './components/tabs/AssignmentsTab';
import GradingTab from './components/tabs/GradingTab';
import AnnouncementsTab from './components/tabs/AnnouncementsTab';
import GradebookTab from './components/tabs/GradebookTab';
import CreateQuizModal from './components/modals/CreateQuizModal';
import CreateAssignmentModal from './components/modals/CreateAssignmentModal';
import GradingModal from './components/modals/GradingModal';

export default function TeacherView({ user }) {
  const [activeTab, setActiveTab] = useState('live');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState(null);

  const permissions = useTeacherPermissions(user);
  const {
    liveStudents,
    assignments,
    announcements,
    allStudents,
    statusMessage,
    setStatusMessage,
    showToast,
    loadAssignments,
    loadAnnouncements,
    loadLiveBoard,
    handleSendEncouragement,
    handleGrantExtraMinutes,
    handleDeleteAssignment,
    handleDeleteAnnouncement
  } = useTeacherData();

  const filters = useTeacherFilters({
    liveStudents,
    assignedClasses: permissions.assignedClasses,
    isRestricted: permissions.isRestricted
  });

  const handleOpenCreateModal = (type) => {
    if (type === 'quiz') {
      setIsQuizModalOpen(true);
    } else {
      setIsAssignmentModalOpen(true);
    }
  };

  const handlePublishAssignment = async (payload, targetClassroom, type) => {
    try {
      await api.createAssignment(payload, user.id);
      showToast(`تم نشر ${type === 'quiz' ? 'الاختبار القصير' : 'التكليف'} بنجاح لفصل ${targetClassroom === 'all' ? 'الجميع' : targetClassroom}!`);
      await loadAssignments();
      setActiveTab('assignments');
    } catch (err) {
      console.error('Failed to create assignment', err);
      showToast(err.message || 'فشل نشر التكليف', 'error');
      throw err;
    }
  };

  const handleSaveGrade = async (submissionId, formValues, studentName) => {
    try {
      await api.gradeSubmission(submissionId, {
        grade: Number(formValues.grade),
        feedback: formValues.feedback.trim(),
        returnForRevision: formValues.returnForRevision
      });

      showToast(
        formValues.returnForRevision
          ? `تمت إعادة التكليف للطالب "${studentName}" للمراجعة والتعديل ↺`
          : `تم رصد واعتماد الدرجة (${formValues.grade}) بنجاح للطالب "${studentName}" ✅`
      );
      setGradingSubmission(null);
      await loadLiveBoard();
    } catch (err) {
      console.error('Failed to grade submission', err);
      showToast(err.message || 'فشل رصد الدرجة', 'error');
      throw err;
    }
  };

  const handlePublishAnnouncement = async (formData) => {
    try {
      await api.createAnnouncement(formData, user.id);
      showToast('تم إرسال التنبيه ونشره لطلاب الفصل فوراً 📢');
      await loadAnnouncements();
    } catch (err) {
      console.error('Failed to send announcement', err);
      showToast(err.message || 'فشل إرسال التنبيه', 'error');
      throw err;
    }
  };

  const handleSelectAssignmentForGrading = (assignmentId) => {
    filters.setGradingAssignmentFilter(assignmentId);
    setActiveTab('grading');
  };

  return (
    <div className="space-y-6 fade-in text-[#26163A]" dir="rtl">
      {/* Toast Alert */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold shadow-md animate-fade-in ${
          statusMessage.type === 'error' 
            ? 'bg-rose-50 text-rose-800 border border-rose-200' 
            : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Executive Teacher Header */}
      <TeacherHeader
        permissions={permissions}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Navigation Tabs Bar */}
      <TeacherNavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          live: filters.scopedStudents.length,
          assignments: assignments.length,
          submissions: filters.submissionsList.length,
          announcements: announcements.length
        }}
      />

      {/* Tab 1: Live Board */}
      {activeTab === 'live' && (
        <LiveBoardTab
          permissions={permissions}
          filters={filters}
          onSendEncouragement={handleSendEncouragement}
          onGrantExtraMinutes={handleGrantExtraMinutes}
          onOpenGradingModal={setGradingSubmission}
        />
      )}

      {/* Tab: Student Attendance Register */}
      {activeTab === 'attendance' && (
        <StudentAttendanceTab
          allStudents={allStudents}
          permissions={permissions}
          user={user}
          showToast={showToast}
        />
      )}

      {/* Tab: Personal Staff Attendance & Absence (سجل حضوري وغيابي) */}
      {activeTab === 'my_attendance' && (
        <TeacherMyAttendanceTab
          user={user}
          permissions={permissions}
        />
      )}

      {/* Tab: Weekly Timetable & Labs */}
      {activeTab === 'schedule' && (
        <TeacherScheduleTab
          user={user}
          permissions={permissions}
        />
      )}

      {/* Tab 2: Assignments Hub */}
      {activeTab === 'assignments' && (
        <AssignmentsTab
          assignments={assignments}
          liveStudents={liveStudents}
          permissions={permissions}
          assignmentTypeFilter={filters.assignmentTypeFilter}
          setAssignmentTypeFilter={filters.setAssignmentTypeFilter}
          onOpenCreateModal={handleOpenCreateModal}
          onSelectAssignmentForGrading={handleSelectAssignmentForGrading}
          onDeleteAssignment={handleDeleteAssignment}
        />
      )}

      {/* Tab 3: Grading Queue */}
      {activeTab === 'grading' && (
        <GradingTab
          assignments={assignments}
          filters={filters}
          onOpenGradingModal={setGradingSubmission}
        />
      )}

      {/* Tab 4: Classroom Announcements */}
      {activeTab === 'announcements' && (
        <AnnouncementsTab
          announcements={announcements}
          permissions={permissions}
          onPublishAnnouncement={handlePublishAnnouncement}
          onDeleteAnnouncement={handleDeleteAnnouncement}
        />
      )}

      {/* Tab 5: Cumulative Gradebook */}
      {activeTab === 'gradebook' && (
        <GradebookTab
          allStudents={allStudents}
          liveStudents={liveStudents}
          assignments={assignments}
          filterClass={filters.filterClass}
          permissions={permissions}
        />
      )}

      {/* Modals */}
      <CreateQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        permissions={permissions}
        onPublish={handlePublishAssignment}
      />

      <CreateAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        permissions={permissions}
        onPublish={handlePublishAssignment}
      />

      <GradingModal
        submission={gradingSubmission}
        onClose={() => setGradingSubmission(null)}
        onSaveGrade={handleSaveGrade}
      />
    </div>
  );
}
