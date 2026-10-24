import React, { useState } from 'react';
import { useManagerData } from './hooks/useManagerData';
import { useManagerFilters } from './hooks/useManagerFilters';
import { useStaffAttendance } from './hooks/useStaffAttendance';
import ManagerHeader from './components/ManagerHeader';
import ManagerStatCards from './components/ManagerStatCards';
import ManagerNavigationTabs from './components/ManagerNavigationTabs';
import StaffTab from './components/tabs/StaffTab';
import AuditTab from './components/tabs/AuditTab';
import NotificationsTab from './components/tabs/NotificationsTab';
import StaffAttendanceTab from './components/tabs/StaffAttendanceTab';
import EvaluateStaffModal from './components/modals/EvaluateStaffModal';
import SendNotificationModal from './components/modals/SendNotificationModal';
import ViewReceiptsModal from './components/modals/ViewReceiptsModal';
import StaffProfileModal from '../admin/components/StaffProfileModal';
import MasterScheduleViewer from '../../components/schedule/MasterScheduleViewer';
import { INITIAL_EVALUATION_FORM, INITIAL_NOTIFICATION_FORM } from './constants';

export default function ManagerView({ user }) {
  const [activeTab, setActiveTab] = useState('staff');
  const [evaluatingStaff, setEvaluatingStaff] = useState(null);
  const [selectedProfileStaff, setSelectedProfileStaff] = useState(null);
  const [evalForm, setEvalForm] = useState(INITIAL_EVALUATION_FORM);
  const [isSendNotificationOpen, setIsSendNotificationOpen] = useState(false);
  const [newNotice, setNewNotice] = useState(INITIAL_NOTIFICATION_FORM);
  const [viewingReceiptsNotice, setViewingReceiptsNotice] = useState(null);

  const {
    overview,
    auditLogs,
    notifications,
    savingAction,
    saveEvaluation,
    sendNotification,
    deleteNotification
  } = useManagerData(user);

  const {
    roleFilter,
    setRoleFilter,
    searchQuery,
    setSearchQuery,
    auditRoleFilter,
    setAuditRoleFilter,
    filteredStaff,
    filteredAuditLogs
  } = useManagerFilters({
    staff: overview?.staff || [],
    auditLogs
  });

  const {
    filteredStaffAttendance,
    metrics: attendanceMetrics,
    loading: attendanceLoading,
    statusFilter: attendanceStatusFilter,
    setStatusFilter: setAttendanceStatusFilter,
    roleFilter: attendanceRoleFilter,
    setRoleFilter: setAttendanceRoleFilter,
    searchQuery: attendanceSearchQuery,
    setSearchQuery: setAttendanceSearchQuery,
    fetchRecords: refreshStaffAttendance,
    manualCheckIn,
    manualCheckOut,
    savingAction: attendanceSavingAction,
  } = useStaffAttendance(overview?.staff || []);

  const handleOpenEvaluate = (staff) => {
    setEvaluatingStaff(staff);
    setEvalForm({
      punctuality: 5,
      pedagogy: 5,
      engagement: 5,
      cooperation: 5,
      notes: '',
      badge: staff.recognitionBadge || 'معلم متميز'
    });
  };

  const handleSaveEvaluationSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveEvaluation(evaluatingStaff, evalForm);
      setEvaluatingStaff(null);
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleSendNotificationSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendNotification(newNotice);
      setIsSendNotificationOpen(false);
      setNewNotice(INITIAL_NOTIFICATION_FORM);
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Hero Card with Principal Theme */}
      <ManagerHeader
        onOpenSendNotification={() => setIsSendNotificationOpen(true)}
      />

      {/* 2. Executive Stat Cards (Key Metrics) */}
      <ManagerStatCards
        overview={overview}
        notificationsCount={notifications.length}
        onSelectTab={setActiveTab}
      />

      {/* 3. Section Navigation Tabs */}
      <ManagerNavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        staffCount={overview?.staff?.length || 0}
        notificationsCount={notifications.length}
        attendanceRate={attendanceMetrics.attendanceRate}
        attendedCount={attendanceMetrics.totalAttendedToday}
      />

      {/* 4. Tab 1: Staff Accountability & Evaluation */}
      {activeTab === 'staff' && (
        <StaffTab
          staffList={filteredStaff}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          onOpenEvaluate={handleOpenEvaluate}
          onViewProfile={setSelectedProfileStaff}
        />
      )}

      {/* Tab: Master Weekly Schedule & Supervision Cards */}
      {activeTab === 'schedule' && (
        <MasterScheduleViewer user={user} />
      )}

      {/* 5. Tab 2: Daily Staff Attendance Register (Strictly Read-Only) */}
      {activeTab === 'attendance' && (
        <StaffAttendanceTab
          staffAttendance={filteredStaffAttendance}
          metrics={attendanceMetrics}
          loading={attendanceLoading}
          statusFilter={attendanceStatusFilter}
          setStatusFilter={setAttendanceStatusFilter}
          roleFilter={attendanceRoleFilter}
          setRoleFilter={setAttendanceRoleFilter}
          searchQuery={attendanceSearchQuery}
          setSearchQuery={setAttendanceSearchQuery}
          onRefresh={refreshStaffAttendance}
        />
      )}

      {/* 6. Tab 3: Live Audit Logs */}
      {activeTab === 'audit' && (
        <AuditTab
          auditLogs={filteredAuditLogs}
          auditRoleFilter={auditRoleFilter}
          setAuditRoleFilter={setAuditRoleFilter}
        />
      )}

      {/* 7. Tab 4: Notifications & Circulars Center */}
      {activeTab === 'notifications' && (
        <NotificationsTab
          notifications={notifications}
          onOpenSendNotification={() => setIsSendNotificationOpen(true)}
          onViewReceipts={setViewingReceiptsNotice}
          onDeleteNotification={deleteNotification}
        />
      )}

      {/* Modal: Evaluating Staff */}
      <EvaluateStaffModal
        staff={evaluatingStaff}
        evalForm={evalForm}
        setEvalForm={setEvalForm}
        saving={savingAction}
        onClose={() => setEvaluatingStaff(null)}
        onSubmit={handleSaveEvaluationSubmit}
      />

      {/* Modal: Send New Notification */}
      <SendNotificationModal
        isOpen={isSendNotificationOpen}
        onClose={() => setIsSendNotificationOpen(false)}
        newNotice={newNotice}
        setNewNotice={setNewNotice}
        staffList={overview?.staff || []}
        saving={savingAction}
        onSubmit={handleSendNotificationSubmit}
      />

      {/* Modal: Viewing Receipts */}
      <ViewReceiptsModal
        notice={viewingReceiptsNotice}
        onClose={() => setViewingReceiptsNotice(null)}
      />

      {/* Modal: Full Executive Staff Profile & Performance Dossier */}
      {selectedProfileStaff && (
        <StaffProfileModal
          user={selectedProfileStaff}
          isOpen={!!selectedProfileStaff}
          onClose={() => setSelectedProfileStaff(null)}
          currentUser={user}
        />
      )}
    </div>
  );
}
