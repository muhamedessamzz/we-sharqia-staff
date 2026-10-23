import React, { useState, useEffect } from 'react';
import { 
  Award, CheckCircle2, TrendingUp, Search, Filter, 
  Printer, Star, CheckSquare, Edit3, Send, Plus, 
  BookOpen, Clock, AlertTriangle, FileText, ChevronLeft,
  X, Check, Sparkles, UserCheck, Eye, RefreshCw
} from 'lucide-react';
import { api } from '../api/client';
import StaffProfileModal from '../features/admin/components/StaffProfileModal';
import { getRoleBadgeInfo } from '../features/admin/constants';

const GRADE_NAMES = {
  1: 'الصف الأول',
  2: 'الصف الثاني',
  3: 'الصف الثالث',
};

export default function AssessmentView({ user }) {
  const [activeTab, setActiveTab] = useState('formative'); // 'formative' | 'remedial' | 'staff_dossiers' | 'printable'
  const [overview, setOverview] = useState(null);
  const [exams, setExams] = useState([]);
  const [remedialStudents, setRemedialStudents] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedProfileStaff, setSelectedProfileStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modals
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
  const [selectedExamForScoring, setSelectedExamForScoring] = useState(null);
  const [examScores, setExamScores] = useState([]);
  const [loadingScores, setLoadingScores] = useState(false);
  const [editingRemedialStudent, setEditingRemedialStudent] = useState(null);
  const [printableExam, setPrintableExam] = useState(null);

  // Forms
  const [createExamForm, setCreateExamForm] = useState({
    title: '',
    examType: 'تكويني نظري',
    subject: 'تكنولوجيا الشبكات والاتصالات (ICT)',
    classroom: 'all',
    grade: 1,
    maxScore: 100,
    passingScore: 50,
    examDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [remedialUpdateForm, setRemedialUpdateForm] = useState({
    newScore: 75,
    remedialStatus: 'اجتاز التحسين بنجاح',
    teacherNotes: ''
  });

  const [scoringInputs, setScoringInputs] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAllAssessmentData();
  }, []);

  const loadAllAssessmentData = async () => {
    setLoading(true);
    try {
      const [overviewData, examsData, remedialData, usersData] = await Promise.allSettled([
        api.getAssessmentOverview(),
        api.getExams(),
        api.getRemedialStudents(),
        api.getUsers()
      ]);

      if (overviewData.status === 'fulfilled') setOverview(overviewData.value);
      if (examsData.status === 'fulfilled') setExams(examsData.value || []);
      if (remedialData.status === 'fulfilled') setRemedialStudents(remedialData.value || []);
      if (usersData.status === 'fulfilled' && Array.isArray(usersData.value)) {
        const staff = usersData.value.filter(u => ['teacher', 'technicalengineer', 'sportscoach'].includes(u.role?.toLowerCase()));
        setStaffList(staff);
      }
    } catch (err) {
      console.error('Failed to load assessment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenScoringModal = async (exam) => {
    setSelectedExamForScoring(exam);
    setLoadingScores(true);
    try {
      const scores = await api.getExamScores(exam.id);
      setExamScores(scores || []);
      const inputs = {};
      (scores || []).forEach(s => {
        inputs[s.studentId] = s.score;
      });
      setScoringInputs(inputs);
    } catch (err) {
      alert('فشل تحميل كشف درجات الامتحان: ' + err.message);
    } finally {
      setLoadingScores(false);
    }
  };

  const handleSaveStudentScore = async (studentScore) => {
    const inputVal = scoringInputs[studentScore.studentId];
    if (inputVal === undefined || isNaN(inputVal)) {
      alert('يرجى إدخال درجة صحيحة');
      return;
    }
    try {
      await api.saveExamScore(selectedExamForScoring.id, {
        studentId: studentScore.studentId,
        score: Number(inputVal),
        isRemedial: selectedExamForScoring.examType === 'تحسيني',
        teacherNotes: studentScore.teacherNotes
      });
      alert(`تم اعتماد درجة الطالب "${studentScore.studentName}" بنجاح ✅`);
      // Reload scores
      const updatedScores = await api.getExamScores(selectedExamForScoring.id);
      setExamScores(updatedScores || []);
      await loadAllAssessmentData();
    } catch (err) {
      alert('فشل حفظ الدرجة: ' + err.message);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!createExamForm.title.trim()) {
      alert('يرجى إدخال عنوان الامتحان');
      return;
    }
    setSubmitting(true);
    try {
      await api.createExam({
        ...createExamForm,
        createdById: user?.id || '00000000-0000-0000-0000-000000000000',
        createdByName: user?.fullName || 'مسؤول التقييم والامتحانات'
      });
      alert('تم إنشاء وتجهيز كشف الامتحان بنجاح');
      setIsCreateExamOpen(false);
      setCreateExamForm({
        title: '',
        examType: 'تكويني نظري',
        subject: 'تكنولوجيا الشبكات والاتصالات (ICT)',
        classroom: 'all',
        grade: 1,
        maxScore: 100,
        passingScore: 50,
        examDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      await loadAllAssessmentData();
    } catch (err) {
      alert('خطأ: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRemedial = async (e) => {
    e.preventDefault();
    if (!editingRemedialStudent) return;
    setSubmitting(true);
    try {
      await api.updateRemedialStatus(editingRemedialStudent.id, {
        newScore: Number(remedialUpdateForm.newScore),
        remedialStatus: remedialUpdateForm.remedialStatus,
        teacherNotes: remedialUpdateForm.teacherNotes
      });
      alert('تم رصد وتحديث نتيجة الامتحان التحسيني بنجاح');
      setEditingRemedialStudent(null);
      await loadAllAssessmentData();
    } catch (err) {
      alert('خطأ أثناء تحديث حالة التحسين: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered lists
  const filteredExams = exams.filter(e => {
    const matchType = typeFilter === 'all' || e.examType === typeFilter;
    const matchClass = classFilter === 'all' || e.classroom === classFilter || e.classroom === 'all';
    const matchSearch = !searchQuery.trim() || 
      (e.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchClass && matchSearch;
  });

  const filteredRemedial = remedialStudents.filter(s => {
    const matchClass = classFilter === 'all' || s.classroom === classFilter;
    const matchSearch = !searchQuery.trim() || 
      (s.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.studentCode || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* Top Executive Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <Award size={14} />
              <span>وحدة القياس والتقويم والامتحانات (Assessment & Examination Unit)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              منظومة الامتحانات التكوينية والتحسينية ورصد الدرجات
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              إدارة الامتحانات التكوينية (النظري والعملي بالمعامل)، رصد الدرجات المعتمدة، ومتابعة الطلاب في مسارات التحسين الأكاديمي حتى تمام الاجتياز.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCreateExamOpen(true)}
              className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>إنشاء امتحان جديد</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
              <span>إجمالي الامتحانات</span>
              <BookOpen size={16} className="text-purple-300" />
            </div>
            <div className="text-2xl font-black text-white">{overview?.totalExams || exams.length}</div>
            <div className="text-[11px] text-purple-200 mt-1 font-medium">نظري، عملي، وتحسيني</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
              <span>امتحانات تكوينية (معملية ونظرية)</span>
              <CheckSquare size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {(overview?.formativeTheoryCount || 0) + (overview?.formativePracticalCount || 0)}
            </div>
            <div className="text-[11px] text-emerald-200 mt-1 font-medium">
              {overview?.formativeTheoryCount || 0} نظري | {overview?.formativePracticalCount || 0} عملي معملي
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
              <span>الامتحانات التحسينية</span>
              <RefreshCw size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{overview?.remedialCount || 0}</div>
            <div className="text-[11px] text-amber-200 mt-1 font-medium">فرص تعويضية لدعم الطلاب</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
              <span>الطلاب في مسار التحسين</span>
              <TrendingUp size={16} className="text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-300">
              {overview?.remedialStudentsCount || remedialStudents.length}
            </div>
            <div className="text-[11px] text-emerald-300 mt-1 font-medium">
              منهم {overview?.passedRemedialCount || 0} اجتازوا التحسين بنجاح ✅
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-3 gap-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('formative')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'formative'
                ? 'bg-[#5C2C90] text-white shadow-md shadow-purple-900/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <BookOpen size={16} />
            <span>📋 الامتحانات التكوينية والعملية ({exams.filter(e => e.ExamType !== 'تحسيني').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('remedial')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'remedial'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <RefreshCw size={16} />
            <span>🔄 متابعة ورصد الامتحانات التحسينية</span>
            {remedialStudents.length > 0 && (
              <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-black">
                {remedialStudents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('staff_dossiers')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'staff_dossiers'
                ? 'bg-[#5C2C90] text-white shadow-md shadow-purple-900/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <UserCheck size={16} />
            <span>👥 ملفات تقييم وإنجاز الكادر التدريسي ({staffList.length})</span>
          </button>
        </div>

        <button
          onClick={loadAllAssessmentData}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-all cursor-pointer shrink-0"
        >
          تحديث السجلات 🔄
        </button>
      </div>

      {/* TAB 1: Formative & Practical Exams */}
      {activeTab === 'formative' && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="relative flex-1 max-w-xs">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="بحث باسم الامتحان أو المادة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
              />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="all">كافة أنواع الامتحانات</option>
                <option value="تكويني نظري">تكويني نظري</option>
                <option value="تكويني عملي">تكويني عملي (معملي)</option>
              </select>

              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="all">كافة الفصول</option>
                <option value="A1">فصل A1</option>
                <option value="A2">فصل A2</option>
                <option value="B1">فصل B1</option>
                <option value="B2">فصل B2</option>
                <option value="C1">فصل C1</option>
                <option value="C2">فصل C2</option>
              </select>
            </div>
          </div>

          {/* Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                      exam.examType === 'تكويني عملي'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : exam.examType === 'تحسيني'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-purple-50 text-[#5C2C90] border-purple-200'
                    }`}>
                      {exam.examType}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(exam.examDate).toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">{exam.title}</h4>
                    <p className="text-xs text-[#E4007C] font-bold mt-0.5">{exam.subject}</p>
                    {exam.notes && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{exam.notes}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">الفصل</span>
                      <strong className="text-slate-800">{exam.classroom === 'all' ? 'كافة الفصول' : exam.classroom}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">الدرجة العظمى</span>
                      <strong className="text-[#5C2C90] font-mono">{exam.maxScore}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">حد النجاح</span>
                      <strong className="text-emerald-700 font-mono">{exam.passingScore}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenScoringModal(exam)}
                    className="flex-1 bg-gradient-to-r from-[#5C2C90] to-[#7134b2] hover:opacity-95 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Edit3 size={14} />
                    <span>رصد الدرجات المعتمدة</span>
                  </button>
                  <button
                    onClick={() => setPrintableExam(exam)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    title="معاينة شيت الدرجات للطباعة"
                  >
                    <Printer size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Remedial / Improvement Students Tracking */}
      {activeTab === 'remedial' && (
        <div className="space-y-5">
          <div className="bg-amber-50/70 rounded-3xl p-5 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <h3 className="text-sm font-black text-amber-950">
                  لوحة متابعة ورصد الامتحانات التحسينية للطلاب (الفرص التعويضية)
                </h3>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed max-w-3xl">
                يتم هنا حصر الطلاب الذين لم يجتازوا الحد الأدنى في الاختبار التكويني الأول أو تقدموا بطلب تحسين درجات. يمكنك رصد الدرجة الجديدة وتحديث حالة الطالب فوراً.
              </p>
            </div>
          </div>

          {/* Remedial Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-black text-slate-900">
                قائمة الطلاب المقيدين في مسار الاختبار التحسيني ({filteredRemedial.length})
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">اسم الطالب والكود</th>
                    <th className="py-3 px-3">الفصل</th>
                    <th className="py-3 px-3 text-center">الدرجة السابقة</th>
                    <th className="py-3 px-3 text-center">درجة التحسين</th>
                    <th className="py-3 px-3 text-center">حالة التحسيني الحالية</th>
                    <th className="py-3 px-3">ملاحظات مسؤول الامتحانات</th>
                    <th className="py-3 px-3 text-center">إجراء الرصد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRemedial.map((scoreItem, idx) => {
                    const status = scoreItem.remedialStatus || 'يحتاج تحسين';

                    return (
                      <tr key={scoreItem.id} className="hover:bg-amber-50/20 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-400 font-bold">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-extrabold text-slate-900 text-sm">{scoreItem.studentName}</div>
                          <span className="text-[10px] text-purple-700 font-mono">كود: {scoreItem.studentCode}</span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-700">
                          فصل {scoreItem.classroom}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">
                          {scoreItem.previousScore !== null ? `${scoreItem.previousScore} / 100` : '—'}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-black text-sm">
                          {scoreItem.score > 0 ? (
                            <span className="text-[#5C2C90]">{scoreItem.score} / 100</span>
                          ) : (
                            <span className="text-slate-300 font-normal">لم ترصد بعد</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {status === 'اجتاز التحسين بنجاح' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <CheckCircle2 size={12} /> اجتاز بنجاح ✅
                            </span>
                          ) : status === 'قيد الاختبار التحسيني' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                              <Clock size={12} /> قيد الاختبار ⏳
                            </span>
                          ) : status === 'لم يجتز بعد - فرصة استثنائية' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                              <AlertTriangle size={12} /> لم يجتز (فرصة ثانية) ⚠️
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              <RefreshCw size={12} /> يحتاج تحسين 🔴
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={scoreItem.teacherNotes}>
                          {scoreItem.teacherNotes || '—'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => {
                              setEditingRemedialStudent(scoreItem);
                              setRemedialUpdateForm({
                                newScore: scoreItem.score || 75,
                                remedialStatus: scoreItem.remedialStatus || 'اجتاز التحسين بنجاح',
                                teacherNotes: scoreItem.teacherNotes || ''
                              });
                            }}
                            className="text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 mx-auto"
                          >
                            <Edit3 size={13} />
                            <span>رصد التحسيني</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create Exam */}
      {isCreateExamOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-right my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#5C2C90] flex items-center gap-2">
                <BookOpen size={18} />
                <span>إنشاء وتجهيز امتحان رسمي جديد</span>
              </h3>
              <button onClick={() => setIsCreateExamOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان الامتحان *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الامتحان التكويني الثاني - مادة برمجة بايثون"
                  value={createExamForm.title}
                  onChange={(e) => setCreateExamForm({ ...createExamForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع الامتحان *</label>
                  <select
                    value={createExamForm.examType}
                    onChange={(e) => setCreateExamForm({ ...createExamForm, examType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  >
                    <option value="تكويني نظري">تكويني نظري</option>
                    <option value="تكويني عملي">تكويني عملي (معملي)</option>
                    <option value="تحسيني">امتحان تحسيني (فرصة تعويضية)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المادة الدراسية *</label>
                  <input
                    type="text"
                    required
                    value={createExamForm.subject}
                    onChange={(e) => setCreateExamForm({ ...createExamForm, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الفصل المستهدف</label>
                  <select
                    value={createExamForm.classroom}
                    onChange={(e) => setCreateExamForm({ ...createExamForm, classroom: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  >
                    <option value="all">كافة الفصول</option>
                    <option value="A1">فصل A1</option>
                    <option value="A2">فصل A2</option>
                    <option value="B1">فصل B1</option>
                    <option value="B2">فصل B2</option>
                    <option value="C1">فصل C1</option>
                    <option value="C2">فصل C2</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاريخ الامتحان</label>
                  <input
                    type="date"
                    value={createExamForm.examDate}
                    onChange={(e) => setCreateExamForm({ ...createExamForm, examDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الدرجة العظمى</label>
                  <input
                    type="number"
                    min="10"
                    value={createExamForm.maxScore}
                    onChange={(e) => setCreateExamForm({ ...createExamForm, maxScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">حد النجاح والاجتياز</label>
                  <input
                    type="number"
                    min="5"
                    value={createExamForm.passingScore}
                    onChange={(e) => setCreateExamForm({ ...createExamForm, passingScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تعليمات وتوجيهات الامتحان</label>
                <textarea
                  rows="2"
                  placeholder="تعليمات حل الأسئلة، زمن الإجابة، الشروط الفنية..."
                  value={createExamForm.notes}
                  onChange={(e) => setCreateExamForm({ ...createExamForm, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateExamOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'جارٍ الإنشاء...' : 'إنشاء وتجهيز الكشف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Exam Scoring Sheet (رصد الدرجات) */}
      {selectedExamForScoring && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full border border-slate-200 shadow-2xl space-y-5 text-right my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                  {selectedExamForScoring.examType}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">{selectedExamForScoring.title}</h3>
                <p className="text-xs text-slate-400">
                  المادة: {selectedExamForScoring.subject} | الدرجة العظمى: {selectedExamForScoring.maxScore} | حد النجاح: {selectedExamForScoring.passingScore}
                </p>
              </div>
              <button
                onClick={() => setSelectedExamForScoring(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            {loadingScores ? (
              <div className="py-12 text-center text-slate-400 text-xs">جارٍ تحميل كشف درجات الطلاب...</div>
            ) : examScores.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">لا يوجد طلاب مسجلون بهذا الامتحان بعد.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">اسم الطالب</th>
                      <th className="py-2.5 px-3">الكود</th>
                      <th className="py-2.5 px-3">الفصل</th>
                      <th className="py-2.5 px-3 text-center">الدرجة المرصودة</th>
                      <th className="py-2.5 px-3 text-center">النتيجة والتقدير</th>
                      <th className="py-2.5 px-3 text-center">حفظ التقييم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {examScores.map((score, idx) => {
                      const val = scoringInputs[score.studentId] ?? score.score;
                      const isPassing = Number(val) >= selectedExamForScoring.passingScore;

                      return (
                        <tr key={score.id} className="hover:bg-purple-50/20">
                          <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{score.studentName}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{score.studentCode}</td>
                          <td className="py-2.5 px-3 font-bold text-purple-800">{score.classroom}</td>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              min="0"
                              max={selectedExamForScoring.maxScore}
                              value={scoringInputs[score.studentId] ?? score.score}
                              onChange={(e) => setScoringInputs({
                                ...scoringInputs,
                                [score.studentId]: e.target.value
                              })}
                              className="w-20 bg-slate-50 border border-slate-300 rounded-xl px-2 py-1 text-center font-mono font-bold text-sm text-[#5C2C90] focus:outline-none focus:ring-2 focus:ring-[#5C2C90]"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {Number(val) > 0 ? (
                              isPassing ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  اجتياز معتمد ({val} / {selectedExamForScoring.maxScore})
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                  يحتاج تحسين ({val} / {selectedExamForScoring.maxScore})
                                </span>
                              )
                            ) : (
                              <span className="text-[10px] text-slate-400">في انتظار الرصد</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => handleSaveStudentScore(score)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              اعتماد الدرجة
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedExamForScoring(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2 rounded-xl cursor-pointer"
              >
                إغلاق الكشف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Update Remedial Student Score */}
      {editingRemedialStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-right my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-amber-900 flex items-center gap-2">
                <RefreshCw size={18} />
                <span>رصد نتيجة الاختبار التحسيني</span>
              </h3>
              <button onClick={() => setEditingRemedialStudent(null)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateRemedial} className="space-y-3.5 text-xs">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-slate-800 space-y-1">
                <div className="font-extrabold text-sm text-slate-900">{editingRemedialStudent.studentName}</div>
                <div className="text-[11px] text-slate-500">
                  كود: {editingRemedialStudent.studentCode} | فصل: {editingRemedialStudent.classroom}
                </div>
                {editingRemedialStudent.previousScore !== null && (
                  <div className="text-[11px] text-rose-700 font-bold">
                    الدرجة السابقة قبل التحسين: {editingRemedialStudent.previousScore} / 100
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">درجة الاختبار التحسيني الجديدة (من 100) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={remedialUpdateForm.newScore}
                  onChange={(e) => setRemedialUpdateForm({ ...remedialUpdateForm, newScore: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold font-mono text-base text-[#5C2C90] focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الحالة الأكاديمية للطالب *</label>
                <select
                  value={remedialUpdateForm.remedialStatus}
                  onChange={(e) => setRemedialUpdateForm({ ...remedialUpdateForm, remedialStatus: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="اجتاز التحسين بنجاح">اجتاز التحسين بنجاح ✅</option>
                  <option value="قيد الاختبار التحسيني">قيد الاختبار التحسيني ⏳</option>
                  <option value="لم يجتز بعد - فرصة استثنائية">لم يجتز بعد - فرصة استثنائية ⚠️</option>
                  <option value="يحتاج تحسين">يحتاج تحسين 🔴</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات التقييم والتحسن الأكاديمي</label>
                <textarea
                  rows="2"
                  placeholder="ملاحظات توثيق اجتياز الطالب أو المهارات التي تم مراجعتها..."
                  value={remedialUpdateForm.teacherNotes}
                  onChange={(e) => setRemedialUpdateForm({ ...remedialUpdateForm, teacherNotes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingRemedialStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'جارٍ الحفظ...' : 'اعتماد نتيجة التحسين'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE OFFICIAL EXAM SHEET */}
      {printableExam && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full border border-slate-200 shadow-2xl space-y-6 text-right my-auto print:shadow-none print:border-none print:max-w-none">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#5C2C90]">
              <div>
                <h3 className="text-xs font-bold text-slate-600">جمهورية مصر العربية - وزارة التربية والتعليم</h3>
                <h2 className="text-sm font-black text-[#5C2C90]">مدرسة WE للتكنولوجيا التطبيقية — محافظة الشرقية</h2>
                <p className="text-[10px] text-[#E4007C] font-bold">شيت رصد نتائج الامتحانات والتقييمات المعتمدة</p>
              </div>
              <img src="/Purple Code and Signal Crest.png" alt="Crest" className="w-14 h-14 object-contain" />
            </div>

            <div className="text-center py-2 bg-purple-50 rounded-2xl border border-purple-200">
              <h2 className="text-base font-black text-[#5C2C90]">{printableExam.title}</h2>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                نوع الامتحان: {printableExam.examType} | المادة: {printableExam.subject} | النهاية العظمى: {printableExam.maxScore}
              </p>
            </div>

            <div className="text-center py-6 text-slate-400 text-xs">
              يحتوي هذا الشيت على بيان رسمي بدرجات الطلاب المسجلين بالامتحان لاعتماده وإرساله لوحدة الجودة والإدارة.
            </div>

            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-center text-xs gap-6">
              <div>
                <p className="text-slate-500 font-bold mb-6">مسؤول التقييم والامتحانات</p>
                <p className="font-black text-slate-900">أ / محمد عاطف المنشاوي</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold mb-6">يعتمد ،،، مدير المدرسة</p>
                <p className="font-black text-slate-900">د / خالد السعدني</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 print:hidden">
              <button
                onClick={() => window.print()}
                className="bg-[#5C2C90] hover:bg-[#461e70] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={15} />
                <span>طباعة الشيت</span>
              </button>
              <button
                onClick={() => setPrintableExam(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STAFF ASSESSMENT & GRADING DOSSIERS */}
      {activeTab === 'staff_dossiers' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <UserCheck size={18} className="text-[#5C2C90]" />
                <span>ملفات إنجاز وتقييم الكادر التدريسي والأكاديمي ({staffList.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                متابعة حركة التصحيح، ورصد درجات الطلاب، والجدول المدرسي لكافة المعلمين والمهندسين.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
              صلاحية مسؤول التقييم والامتحانات 📋
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffList.map((staff, idx) => {
              const roleInfo = getRoleBadgeInfo(staff);
              const cleanName = staff.fullName ? staff.fullName.replace(/\s*\([^)]*\)\s*$/i, '').trim() : staff.username;

              return (
                <div
                  key={staff.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#5C2C90] font-black text-base flex items-center justify-center shrink-0 shadow-inner">
                          {cleanName ? cleanName[0] : 'ع'}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-slate-900 truncate">{cleanName}</h4>
                          <span className="text-[11px] text-slate-400 font-mono block">@{staff.username}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${roleInfo.color}`}>
                        {roleInfo.label}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">الفصول:</span>
                        <span className="font-bold text-purple-700">{staff.classroom || 'كافة فصول المدرسة'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">التخصص:</span>
                        <span className="font-bold text-slate-700">{staff.specialty || 'تكنولوجيا تطبيقية'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    id={`btn-assessment-staff-dossier-${idx}`}
                    onClick={() => setSelectedProfileStaff(staff)}
                    className="w-full bg-[#5C2C90] hover:bg-[#481e77] text-white py-2.5 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <FileText size={14} />
                    <span>استعراض الملف المهني الشامل 📋</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Executive 360 Staff Profile Modal */}
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
