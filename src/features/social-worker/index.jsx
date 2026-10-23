import React, { useState, useEffect } from 'react';
import HeaderBanner from './components/HeaderBanner';
import NavigationTabs from './components/NavigationTabs';
import CasesTab from './components/tabs/CasesTab';
import GroomingTab from './components/tabs/GroomingTab';
import AbsenceTab from './components/tabs/AbsenceTab';
import DisruptionTab from './components/tabs/DisruptionTab';
import SummonsTab from './components/tabs/SummonsTab';
import EarlyWarningsTab from './components/tabs/EarlyWarningsTab';
import NewCaseForm from './components/tabs/NewCaseForm';

// Modals
import NotifyParentModal from './components/modals/NotifyParentModal';
import AddGroomingModal from './components/modals/AddGroomingModal';
import AddAbsenceModal from './components/modals/AddAbsenceModal';
import AddDisruptionModal from './components/modals/AddDisruptionModal';
import CaseFollowupModal from './components/modals/CaseFollowupModal';
import PrintableCaseModal from './components/modals/PrintableCaseModal';
import PrintableWarningModal from './components/modals/PrintableWarningModal';
import PrintableSummonModal from './components/modals/PrintableSummonModal';
import StudentProfileModal from '../student-affairs/components/modals/StudentProfileModal';

// Hooks
import { useSocialWorkerData } from './hooks/useSocialWorkerData';
import { useGroomingLogs } from './hooks/useGroomingLogs';
import { useAbsenceLogs } from './hooks/useAbsenceLogs';
import { useDisruptionLogs } from './hooks/useDisruptionLogs';
import { useSummonsLogs } from './hooks/useSummonsLogs';
import { useParentNotification } from './hooks/useParentNotification';

export default function SocialWorkerFeature({ user }) {
  const isSocialWorker = user?.role?.toLowerCase() === 'socialworker';
  const [activeSubTab, setActiveSubTab] = useState('cases');

  // Guard: Admin and non-social-worker users are for oversight/monitoring only
  useEffect(() => {
    if (!isSocialWorker && activeSubTab === 'new-case') {
      setActiveSubTab('cases');
    }
    if (activeSubTab === 'programs') {
      setActiveSubTab('cases');
    }
  }, [isSocialWorker, activeSubTab]);

  // New Case Intake Form State (when opened from radar or button)
  const [newCaseDefaults, setNewCaseDefaults] = useState(null);

  // Active Case Note Modal
  const [activeCaseForNote, setActiveCaseForNote] = useState(null);

  // Comprehensive Student Profile Modal State
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);

  // Printable Modals State
  const [printableCase, setPrintableCase] = useState(null);
  const [printableSummon, setPrintableSummon] = useState(null);
  const [printableWarning, setPrintableWarning] = useState(null);

  // Add Entries Modals State
  const [showGroomingModal, setShowGroomingModal] = useState(false);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [showDisruptionModal, setShowDisruptionModal] = useState(false);

  // Business Logic Hooks
  const { data, loading, error, createCase, addCaseNote, deleteCase } = useSocialWorkerData();
  const { groomingLogs, addGroomingLog, resolveGroomingLog, pendingCount: pendingGrooming } = useGroomingLogs();
  const { absenceLogs, addAbsenceLog, totalCount: totalAbsence } = useAbsenceLogs();
  const { disruptionLogs, addDisruptionLog, totalCount: totalDisruptions } = useDisruptionLogs();
  const { summons, addSummon, documentMeetingOutcome, totalCount: totalSummons } = useSummonsLogs();
  const {
    notifyModalData,
    customMessage,
    setCustomMessage,
    setNotifyModalData,
    openNotifyModal,
    closeNotifyModal,
    sendWhatsApp,
    sendToPortal,
  } = useParentNotification();

  const handleIntakeRadarCase = (warningItem) => {
    if (!isSocialWorker) return;
    setNewCaseDefaults({
      studentId: warningItem.studentId,
      caseType: 'إرشاد أكاديمي وصعوبات تقنية',
      priority: 'عاجلة',
      note: `رصد استفسار ومساعدة في تكليف: "${warningItem.assignmentTitle}". نوع الدعم: ${warningItem.helpType || 'استفسار تطبيقي'}`,
    });
    setActiveSubTab('new-case');
  };

  const handleDeleteCase = async (caseId, studentName) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف ملف الحالة الإرشادية للطالب "${studentName}"؟`)) {
      return;
    }
    try {
      await deleteCase(caseId);
    } catch (err) {
      alert('حدث خطأ أثناء حذف الحالة: ' + err.message);
    }
  };

  const handleViewStudentProfile = (studentOrTarget) => {
    if (!studentOrTarget) return;
    if (studentOrTarget.id && studentOrTarget.fullName && studentOrTarget.classroom) {
      setSelectedStudentForProfile(studentOrTarget);
      return;
    }
    const targetId = studentOrTarget.studentId || studentOrTarget.id;
    const targetName = studentOrTarget.studentName || studentOrTarget.fullName;
    const matched = data.students?.find(
      (s) => (targetId && s.id === targetId) || (targetName && s.fullName === targetName)
    );
    if (matched) {
      setSelectedStudentProfile(matched);
    } else {
      setSelectedStudentProfile({
        id: targetId || '00000000-0000-0000-0000-000000000000',
        fullName: targetName || 'طالب',
        classroom: studentOrTarget.classroom || 'A1',
        grade: studentOrTarget.grade || 1,
        studentCode: studentOrTarget.studentCode || 'STU-000',
      });
    }
  };

  return (
    <div className="space-y-6 fade-in text-[#26163A]" dir="rtl">
      {/* 1. Header Banner */}
      <HeaderBanner
        isSocialWorker={isSocialWorker}
        stats={{
          pendingGrooming,
          totalAbsence,
          totalDisruptions,
          totalCases: data.cases?.length || 0,
        }}
        activeTab={activeSubTab}
        onSelectTab={(tabId) => {
          if (tabId === 'new-case' && !isSocialWorker) return;
          setActiveSubTab(tabId);
          if (tabId !== 'new-case') setNewCaseDefaults(null);
        }}
        onOpenNewCase={
          isSocialWorker
            ? () => {
                setNewCaseDefaults(null);
                setActiveSubTab('new-case');
              }
            : null
        }
      />

      {/* 2. Navigation Subtabs */}
      <NavigationTabs
        activeTab={activeSubTab}
        onSelectTab={(tabId) => {
          if (tabId === 'new-case' && !isSocialWorker) return;
          setActiveSubTab(tabId);
          if (tabId !== 'new-case') setNewCaseDefaults(null);
        }}
        counts={{
          cases: data.cases?.length || 0,
          grooming: groomingLogs.length,
          absence: absenceLogs.length,
          disruption: disruptionLogs.length,
          summons: summons.length,
          earlyWarnings: data.earlyWarnings?.length || 0,
        }}
      />

      {/* 3. Subtab Content Panels */}
      {activeSubTab === 'cases' && (
        <CasesTab
          cases={data.cases}
          isSocialWorker={isSocialWorker}
          onOpenNewCase={() => {
            if (!isSocialWorker) return;
            setNewCaseDefaults(null);
            setActiveSubTab('new-case');
          }}
          onOpenFollowup={(c) => setActiveCaseForNote(c)}
          onOpenNotify={openNotifyModal}
          onPrintCase={(c) => setPrintableCase(c)}
          onDeleteCase={handleDeleteCase}
          onViewStudentProfile={handleViewStudentProfile}
        />
      )}

      {activeSubTab === 'new-case' && isSocialWorker && (
        <NewCaseForm
          students={data.students}
          initialStudentId={newCaseDefaults?.studentId}
          initialCaseType={newCaseDefaults?.caseType}
          initialPriority={newCaseDefaults?.priority}
          initialNote={newCaseDefaults?.note}
          counselorName={user.fullName}
          onSubmit={createCase}
          onCancel={() => {
            setNewCaseDefaults(null);
            setActiveSubTab('cases');
          }}
        />
      )}

      {activeSubTab === 'grooming' && (
        <GroomingTab
          groomingLogs={groomingLogs}
          isSocialWorker={isSocialWorker}
          onOpenAddGrooming={() => setShowGroomingModal(true)}
          onOpenNotify={openNotifyModal}
          onResolveGrooming={resolveGroomingLog}
        />
      )}

      {activeSubTab === 'absence' && (
        <AbsenceTab
          absenceLogs={absenceLogs}
          isSocialWorker={isSocialWorker}
          onOpenAddAbsence={() => setShowAbsenceModal(true)}
          onOpenNotify={openNotifyModal}
          onPrintWarning={(log) => setPrintableWarning(log)}
          onViewStudentProfile={handleViewStudentProfile}
        />
      )}

      {activeSubTab === 'disruption' && (
        <DisruptionTab
          disruptionLogs={disruptionLogs}
          isSocialWorker={isSocialWorker}
          onOpenAddDisruption={() => setShowDisruptionModal(true)}
          onOpenNotify={openNotifyModal}
          onViewStudentProfile={handleViewStudentProfile}
        />
      )}

      {activeSubTab === 'summons' && (
        <SummonsTab
          summons={summons}
          isSocialWorker={isSocialWorker}
          onAddSummon={addSummon}
          onDocumentOutcome={documentMeetingOutcome}
          onPrintSummon={(s) => setPrintableSummon(s)}
          onViewStudentProfile={handleViewStudentProfile}
        />
      )}

      {activeSubTab === 'warnings' && (
        <EarlyWarningsTab
          earlyWarnings={data.earlyWarnings}
          isSocialWorker={isSocialWorker}
          onIntakeCase={handleIntakeRadarCase}
          onViewStudentProfile={handleViewStudentProfile}
        />
      )}

      {/* 4. Feature Modals */}
      <NotifyParentModal
        modalData={notifyModalData}
        message={customMessage}
        onMessageChange={setCustomMessage}
        onPhoneChange={(phone) => setNotifyModalData((prev) => ({ ...prev, phone }))}
        onSendWhatsApp={sendWhatsApp}
        onSendToPortal={sendToPortal}
        onClose={closeNotifyModal}
      />

      <AddGroomingModal
        isOpen={showGroomingModal}
        onClose={() => setShowGroomingModal(false)}
        onSubmit={addGroomingLog}
      />

      <AddAbsenceModal
        isOpen={showAbsenceModal}
        onClose={() => setShowAbsenceModal(false)}
        onSubmit={addAbsenceLog}
      />

      <AddDisruptionModal
        isOpen={showDisruptionModal}
        onClose={() => setShowDisruptionModal(false)}
        onSubmit={addDisruptionLog}
      />

      <CaseFollowupModal
        activeCase={activeCaseForNote}
        onClose={() => setActiveCaseForNote(null)}
        onSubmit={addCaseNote}
        counselorName={user.fullName}
      />

      <PrintableCaseModal
        printableCase={printableCase}
        onClose={() => setPrintableCase(null)}
        counselorName={user.fullName}
      />

      <PrintableWarningModal
        printableWarning={printableWarning}
        onClose={() => setPrintableWarning(null)}
      />

      <PrintableSummonModal
        printableSummon={printableSummon}
        onClose={() => setPrintableSummon(null)}
      />

      {/* Comprehensive 360-degree Student Profile Modal */}
      <StudentProfileModal
        isOpen={!!selectedStudentForProfile}
        student={selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        currentUser={user}
      />
    </div>
  );
}
