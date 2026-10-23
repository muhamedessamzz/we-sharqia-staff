import React, { useState } from 'react';
import { 
  AlertCircle, CheckCircle2, X, Users, MailCheck, 
  Building2, LayoutGrid, ListFilter 
} from 'lucide-react';

// Components
import HeaderActions from './components/HeaderActions';
import ClassroomCardGrid from './components/ClassroomCardGrid';
import ClassroomDetailPage from './components/ClassroomDetailPage';
import GradeStatCards from './components/GradeStatCards';
import ClassroomFilterBar from './components/ClassroomFilterBar';
import StudentTable from './components/StudentTable';
import ParentRequestsTab from './components/tabs/ParentRequestsTab';

// Modals
import BulkAddModal from './components/modals/BulkAddModal';
import AddStudentModal from './components/modals/AddStudentModal';
import EditStudentModal from './components/modals/EditStudentModal';
import DeleteStudentModal from './components/modals/DeleteStudentModal';
import StudentProfileModal from './components/modals/StudentProfileModal';

// Hooks
import { useStudentAffairsData } from './hooks/useStudentAffairsData';
import { useBulkEnrollment } from './hooks/useBulkEnrollment';
import { useStudentFilters } from './hooks/useStudentFilters';
import { useParentRequests } from './hooks/useParentRequests';

export default function StudentAffairsFeature({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('students'); // 'students' | 'requests'
  const [viewMode, setViewMode] = useState('classrooms'); // 'classrooms' (9 cards) | 'all_roster' (full table)
  const [selectedClassroom, setSelectedClassroom] = useState(null); // 'A1', 'C2', etc. (inner page)
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null); // Student object for comprehensive profile
  const [editingStudent, setEditingStudent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [initialClassForAdd, setInitialClassForAdd] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  // Business Logic Hooks - Students
  const {
    students,
    loading,
    syncing,
    statusMessage,
    setStatusMessage,
    showToast,
    refreshStudents,
    syncStudentsFromFile,
    addStudent,
    updateStudent,
    deleteStudent,
  } = useStudentAffairsData();

  const {
    isOpen: isBulkModalOpen,
    setIsOpen: setIsBulkModalOpen,
    bulkData,
    setBulkData,
    submitting: bulkSubmitting,
    progress: bulkProgress,
    previewList: bulkPreviewList,
    submitBulkEnrollment,
  } = useBulkEnrollment(refreshStudents, showToast);

  const {
    searchTerm,
    setSearchTerm,
    gradeFilter,
    setGradeFilter,
    classFilter,
    setClassFilter,
    filteredStudents,
    counts,
  } = useStudentFilters(students);

  // Business Logic Hooks - Parent Requests
  const {
    requests: parentRequests,
    filteredRequests: filteredParentRequests,
    loading: requestsLoading,
    statusFilter: requestStatusFilter,
    setStatusFilter: setRequestStatusFilter,
    typeFilter: requestTypeFilter,
    setTypeFilter: setRequestTypeFilter,
    searchQuery: requestSearchQuery,
    setSearchQuery: setRequestSearchQuery,
    fetchRequests: refreshRequests,
    reviewRequest,
    counts: requestCounts,
  } = useParentRequests();

  const handleSelectFilter = (grade, cls) => {
    setGradeFilter(grade);
    setClassFilter(cls);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReviewParentRequest = async (requestId, payload) => {
    try {
      await reviewRequest(requestId, payload);
      showToast('تم حفظ قرار شؤون الطلاب وتحديث حالة الطلب بنجاح ✅', 'success');
    } catch (err) {
      showToast(err.message || 'فشل حفظ قرار الطلب', 'error');
      throw err;
    }
  };

  const handleOpenAddStudent = (targetClass = null) => {
    setInitialClassForAdd(targetClass);
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6 fade-in pb-10" dir="rtl">
      {/* Toast Alert */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold shadow-md animate-fade-in ${
            statusMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Sub-Navigation Modules: Students & Classrooms vs Parent Requests */}
      <div className="bg-white rounded-3xl p-2 border border-slate-200/90 shadow-2xs flex items-center gap-2">
        <button
          onClick={() => {
            setActiveSubTab('students');
            // If they click on students tab, keep their place or let them return
          }}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'students'
              ? 'bg-gradient-to-l from-[#5C2C90] to-[#7134b2] text-white shadow-md shadow-purple-900/20'
              : 'text-slate-600 hover:text-[#5C2C90] hover:bg-purple-50/60'
          }`}
        >
          <Users size={17} />
          <span>الطلاب والفصول الدراسية ({students.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('requests');
          }}
          className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
            activeSubTab === 'requests'
              ? 'bg-gradient-to-l from-[#5C2C90] to-[#7134b2] text-white shadow-md shadow-purple-900/20'
              : 'text-slate-600 hover:text-[#5C2C90] hover:bg-purple-50/60'
          }`}
        >
          <MailCheck size={17} />
          <span>طلبات واستئذانات أولياء الأمور</span>
          {requestCounts.pending > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono transition-transform animate-pulse ${
                activeSubTab === 'requests'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-amber-500 text-white'
              }`}
              title="يوجد طلبات جديدة قيد المراجعة"
            >
              {requestCounts.pending} معلق
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Students & Classrooms Hub */}
      {activeSubTab === 'students' && (
        <div className="space-y-6">
          {/* If a specific classroom is selected: Render the Inner Classroom Page ("صفحة بداخل صفحة") */}
          {selectedClassroom ? (
            <ClassroomDetailPage
              classroomName={selectedClassroom}
              students={students}
              loading={loading}
              onBack={() => setSelectedClassroom(null)}
              onOpenAddStudent={handleOpenAddStudent}
              onOpenEditStudent={(st) => setEditingStudent(st)}
              onOpenDeleteStudent={(st) => setDeletingStudent(st)}
              onViewStudentProfile={(st) => setSelectedStudentProfile(st)}
            />
          ) : (
            /* Otherwise: Render the Main Classrooms & Stages Hub */
            <div className="space-y-6">
              {/* 1. Header with Global Actions */}
              <HeaderActions
                onOpenBulkAdd={() => setIsBulkModalOpen(true)}
                onOpenAddSingle={() => handleOpenAddStudent(null)}
                onSyncFromFile={syncStudentsFromFile}
                syncing={syncing}
                onPrint={handlePrint}
              />

              {/* 2. Switcher: Classrooms Grid vs Full Students Table */}
              <div className="flex items-center justify-between bg-white rounded-2xl p-2.5 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('classrooms')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      viewMode === 'classrooms'
                        ? 'bg-[#5C2C90] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutGrid size={15} />
                    <span>المراحل والفصول الدراسية (9 فصول)</span>
                  </button>

                  <button
                    onClick={() => setViewMode('all_roster')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      viewMode === 'all_roster'
                        ? 'bg-[#5C2C90] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ListFilter size={15} />
                    <span>كشف جميع الطلاب ({counts.total || students.length} طالب)</span>
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-medium hidden sm:inline px-3">
                  {viewMode === 'classrooms'
                    ? 'اختر الفصل للانتقال إلى صفحته التفصيلية المستقلة'
                    : 'جدول عام لفرز وبحث كافة سجلات الطلاب بالمدرسة'}
                </span>
              </div>

              {/* View Mode 1: Classrooms Grid (Drill-Down Entry) */}
              {viewMode === 'classrooms' && (
                <ClassroomCardGrid
                  students={students}
                  counts={counts}
                  onOpenClassroom={(cls) => setSelectedClassroom(cls)}
                  onViewAllStudents={() => setViewMode('all_roster')}
                />
              )}

              {/* View Mode 2: Full Students Table & Filters */}
              {viewMode === 'all_roster' && (
                <div className="space-y-6">
                  {/* Stage Tabs & Search/Filter Bar */}
                  <ClassroomFilterBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    gradeFilter={gradeFilter}
                    classFilter={classFilter}
                    onSelectFilter={handleSelectFilter}
                    counts={counts}
                  />

                  {/* Student Data Table */}
                  <StudentTable
                    students={filteredStudents}
                    loading={loading}
                    gradeFilter={gradeFilter}
                    classFilter={classFilter}
                    onEditStudent={(st) => setEditingStudent(st)}
                    onDeleteStudent={(st) => setDeletingStudent(st)}
                    onSyncFromFile={syncStudentsFromFile}
                    onViewStudentProfile={(st) => setSelectedStudentProfile(st)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Parent Requests */}
      {activeSubTab === 'requests' && (
        <ParentRequestsTab
          requests={parentRequests}
          filteredRequests={filteredParentRequests}
          loading={requestsLoading}
          counts={requestCounts}
          statusFilter={requestStatusFilter}
          setStatusFilter={setRequestStatusFilter}
          typeFilter={requestTypeFilter}
          setTypeFilter={setRequestTypeFilter}
          searchQuery={requestSearchQuery}
          setSearchQuery={setRequestSearchQuery}
          onRefresh={refreshRequests}
          onReviewRequest={handleReviewParentRequest}
          currentUserName={user?.fullName || 'مسؤول شؤون الطلاب'}
        />
      )}

      {/* Comprehensive Student Profile Modal (Layer 3) */}
      <StudentProfileModal
        isOpen={!!selectedStudentProfile}
        student={selectedStudentProfile}
        onClose={() => setSelectedStudentProfile(null)}
        onEditStudent={(st) => setEditingStudent(st)}
        onDeleteStudent={(st) => setDeletingStudent(st)}
      />

      {/* Other Modals for Students */}
      <BulkAddModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        bulkData={bulkData}
        onBulkDataChange={setBulkData}
        previewList={bulkPreviewList}
        submitting={bulkSubmitting}
        progress={bulkProgress}
        onSubmit={submitBulkEnrollment}
      />

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setInitialClassForAdd(null);
        }}
        onAddStudent={addStudent}
        initialClassroom={initialClassForAdd}
      />

      <EditStudentModal
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onUpdateStudent={updateStudent}
      />

      <DeleteStudentModal
        student={deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirmDelete={async (st) => {
          await deleteStudent(st);
          setDeletingStudent(null);
        }}
      />
    </div>
  );
}
