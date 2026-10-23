import React, { useState, useEffect } from 'react';
import { 
  Award, Trophy, Activity, Users, Plus, Search, 
  Filter, CheckCircle2, AlertCircle, Edit3, X, 
  Flame, Calendar, Sparkles, Star, ChevronLeft, RefreshCw
} from 'lucide-react';
import { api } from '../api/client';

export default function SportsView({ user }) {
  const [activeTab, setActiveTab] = useState('fitness'); // 'fitness' | 'tournaments'
  const [overview, setOverview] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  // Modals
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);

  // Forms
  const [assessmentForm, setAssessmentForm] = useState({
    studentId: '',
    morningAssemblyStatus: 'حاضر ومنضبط',
    fitnessScore: 90,
    speedScore: 9,
    enduranceScore: 9,
    flexibilityScore: 8,
    preferredSport: 'كرة قدم',
    coachNotes: ''
  });

  const [tournamentForm, setTournamentForm] = useState({
    title: '',
    tournamentType: 'دوري كرة القدم',
    targetStages: 'كافة المراحل (A, B, C)',
    startDate: new Date().toISOString().split('T')[0],
    status: 'جاري التنظيم والتصفيات',
    winningClassroom: '',
    bestPlayerOrScorer: '',
    rulesAndNotes: ''
  });

  const [studentsList, setStudentsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSportsData();
  }, []);

  const loadSportsData = async () => {
    setLoading(true);
    try {
      const [overviewData, assessData, tourData, usersData] = await Promise.allSettled([
        api.getSportsOverview(),
        api.getSportsAssessments(),
        api.getSportsTournaments(),
        api.getUsers()
      ]);

      if (overviewData.status === 'fulfilled') setOverview(overviewData.value);
      if (assessData.status === 'fulfilled') setAssessments(assessData.value || []);
      if (tourData.status === 'fulfilled') setTournaments(tourData.value || []);
      if (usersData.status === 'fulfilled') {
        const stds = (usersData.value || []).filter(u => u.role?.toLowerCase() === 'student');
        setStudentsList(stds);
      }
    } catch (err) {
      console.error('Failed to load sports data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssessment = async (e) => {
    e.preventDefault();
    if (!assessmentForm.studentId) {
      alert('يرجى اختيار الطالب');
      return;
    }
    setSubmitting(true);
    try {
      await api.saveSportsAssessment({
        ...assessmentForm,
        coachId: user?.id || '00000000-0000-0000-0000-000000000000',
        coachName: user?.fullName || 'كابتن حسام حسن (التربية الرياضية)'
      });
      alert('تم حفظ واعتماد التقييم الرياضي والبدني بنجاح ✅');
      setIsAssessmentModalOpen(false);
      setEditingAssessment(null);
      await loadSportsData();
    } catch (err) {
      alert('خطأ: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    if (!tournamentForm.title.trim()) {
      alert('يرجى كتابة اسم الدوري أو البطولة');
      return;
    }
    setSubmitting(true);
    try {
      await api.createSportsTournament(tournamentForm);
      alert('تم إطلاق وتنظيم البطولة الرياضية بنجاح 🏆');
      setIsTournamentModalOpen(false);
      setTournamentForm({
        title: '',
        tournamentType: 'دوري كرة القدم',
        targetStages: 'كافة المراحل (A, B, C)',
        startDate: new Date().toISOString().split('T')[0],
        status: 'جاري التنظيم والتصفيات',
        winningClassroom: '',
        bestPlayerOrScorer: '',
        rulesAndNotes: ''
      });
      await loadSportsData();
    } catch (err) {
      alert('خطأ: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered list
  const filteredAssessments = assessments.filter(a => {
    const matchClass = classFilter === 'all' || a.classroom === classFilter;
    const matchSearch = !searchQuery.trim() || 
      (a.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.studentCode || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12 text-[#1E1035]" dir="rtl">
      {/* Top Banner - Styled with WE Brand Identity (Royal Purple & Telecom Egypt Magenta Glow) */}
      <div className="bg-gradient-to-r from-[#190C2E] via-[#35145E] to-[#5C2C90] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800/40 relative overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_top_right,rgba(228,0,124,0.22),transparent_55%)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 bg-white/10 text-pink-200 border border-white/15 px-3.5 py-1 rounded-full text-xs font-bold backdrop-blur-md">
              <Trophy size={14} className="text-amber-300" />
              <span>إدارة التربية الرياضية واللياقة البدنية · مدارس WE للتكنولوجيا التطبيقية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>منظومة اللياقة البدنية والأنشطة وطابور الصباح</span>
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/90 max-w-2xl leading-relaxed">
              متابعة قياسات اللياقة والتحمل للطلاب، تنظيم الدوريات الرياضية التنافسية، ورصد التزام الطلاب في التمارين الصباحية وطابور المدرسة وفق لوائح مدارس WE.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={() => {
                setEditingAssessment(null);
                setAssessmentForm({
                  studentId: '',
                  morningAssemblyStatus: 'حاضر ومنضبط',
                  fitnessScore: 90,
                  speedScore: 9,
                  enduranceScore: 9,
                  flexibilityScore: 8,
                  preferredSport: 'كرة قدم',
                  coachNotes: ''
                });
                setIsAssessmentModalOpen(true);
              }}
              className="bg-gradient-to-r from-[#E4007C] to-[#C20068] hover:from-[#f00083] hover:to-[#a9005b] text-white text-xs font-black px-5 py-2.5 rounded-2xl shadow-lg shadow-[#E4007C]/30 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={16} />
              <span>تقييم لياقة طالب</span>
            </button>
            <button
              onClick={() => setIsTournamentModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-2xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Trophy size={16} className="text-amber-300" />
              <span>إنشاء بطولة / دوري جديد</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-between text-purple-200 text-xs font-bold mb-1">
              <span>الطلاب المقيمون بدنياً</span>
              <Users size={16} className="text-purple-300" />
            </div>
            <div className="text-2xl font-black text-white">{overview?.totalAssessed || assessments.length}</div>
            <div className="text-[11px] text-purple-200/80 mt-1 font-medium">سجلات اختبارات القدرات الحركية</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-between text-pink-200 text-xs font-bold mb-1">
              <span>المتميزون باللياقة (85%+)</span>
              <Flame size={16} className="text-[#FF4DA8]" />
            </div>
            <div className="text-2xl font-black text-[#FF80C0]">
              {overview?.excellentFitnessCount || 0}
            </div>
            <div className="text-[11px] text-pink-100/80 mt-1 font-medium">مستوى قوة وتحمل فائق ⭐</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-between text-amber-200 text-xs font-bold mb-1">
              <span>البطولات والأنشطة</span>
              <Trophy size={16} className="text-amber-300" />
            </div>
            <div className="text-2xl font-black text-amber-300">
              {tournaments.length}
            </div>
            <div className="text-[11px] text-amber-100/80 mt-1 font-medium">
              {overview?.activeTournamentsCount || 0} منافسات جارية
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-between text-purple-200 text-xs font-bold mb-1">
              <span>الانضباط بطابور الصباح</span>
              <CheckCircle2 size={16} className="text-emerald-300" />
            </div>
            <div className="text-2xl font-black text-white">
              {assessments.length > 0 
                ? `${Math.round((assessments.filter(a => a.morningAssemblyStatus?.includes('حاضر')).length / assessments.length) * 100)}%`
                : '100%'}
            </div>
            <div className="text-[11px] text-purple-200/80 mt-1 font-medium">نسبة الالتزام والانضباط الصباحي</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200/90 pb-3 gap-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('fitness')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'fitness'
                ? 'bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white shadow-md shadow-purple-900/25 font-black'
                : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-[#5C2C90] border border-slate-200/80'
            }`}
          >
            <Activity size={16} />
            <span>🏃‍♂️ تقييمات اللياقة والمهارات الحركية ({assessments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tournaments')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tournaments'
                ? 'bg-gradient-to-r from-[#5C2C90] to-[#E4007C] text-white shadow-md shadow-purple-900/25 font-black'
                : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-[#5C2C90] border border-slate-200/80'
            }`}
          >
            <Trophy size={16} />
            <span>🏆 البطولات والدوريات المدرسية ({tournaments.length})</span>
          </button>
        </div>

        <button
          onClick={loadSportsData}
          className="text-xs font-bold text-slate-600 hover:text-[#5C2C90] bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-2xs"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin text-[#5C2C90]' : ''} />
          <span>تحديث السجلات</span>
        </button>
      </div>

      {/* TAB 1: Fitness & Physical Skills */}
      {activeTab === 'fitness' && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="relative flex-1 max-w-xs">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="بحث باسم الطالب أو الكود..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
              />
            </div>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#5C2C90]"
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

          {/* Fitness Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">اسم الطالب</th>
                    <th className="py-3 px-3">الفصل</th>
                    <th className="py-3 px-3 text-center">طابور الصباح</th>
                    <th className="py-3 px-3 text-center">اللياقة (100)</th>
                    <th className="py-3 px-3 text-center">السرعة</th>
                    <th className="py-3 px-3 text-center">التحمل</th>
                    <th className="py-3 px-3 text-center">المرونة</th>
                    <th className="py-3 px-3">الرياضة المفضلة</th>
                    <th className="py-3 px-3 text-center">تحديث</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssessments.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="py-10 text-center text-slate-400">
                        لا توجد سجلات مطابقة للبحث حالياً
                      </td>
                    </tr>
                  ) : (
                    filteredAssessments.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-purple-50/25 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-400 font-bold">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-extrabold text-slate-900 text-sm">{item.studentName}</div>
                          <span className="text-[10px] text-[#5C2C90] font-mono font-bold">كود: {item.studentCode}</span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-700">فصل {item.classroom}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            item.morningAssemblyStatus.includes('حاضر')
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : item.morningAssemblyStatus.includes('تأخر')
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}>
                            {item.morningAssemblyStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-black text-sm text-[#5C2C90]">
                          {item.fitnessScore}%
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">{item.speedScore} / 10</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">{item.enduranceScore} / 10</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">{item.flexibilityScore} / 10</td>
                        <td className="py-3 px-3">
                          <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                            {item.preferredSport}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => {
                              setEditingAssessment(item);
                              setAssessmentForm({
                                studentId: item.studentId,
                                morningAssemblyStatus: item.morningAssemblyStatus || 'حاضر ومنضبط',
                                fitnessScore: item.fitnessScore || 90,
                                speedScore: item.speedScore || 9,
                                enduranceScore: item.enduranceScore || 9,
                                flexibilityScore: item.flexibilityScore || 8,
                                preferredSport: item.preferredSport || 'كرة قدم',
                                coachNotes: item.coachNotes || ''
                              });
                              setIsAssessmentModalOpen(true);
                            }}
                            className="text-xs font-bold text-[#5C2C90] hover:text-[#411b68] bg-purple-50 hover:bg-purple-100 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                          >
                            <Edit3 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Tournaments & Leagues */}
      {activeTab === 'tournaments' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                <span>سجل الدوريات والبطولات الرياضية المدرسية</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">تنظيم المنافسات بين الفصول وتتويج الفرق والطلاب الفائزين بمدارس WE</p>
            </div>
            <button
              onClick={() => setIsTournamentModalOpen(true)}
              className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:from-[#4a2175] hover:to-[#be0066] text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-md shadow-purple-900/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus size={16} />
              <span>إنشاء دوري جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tournaments.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-purple-200 transition-all space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-amber-500" />
                    <span className="font-bold text-xs text-slate-800">{tour.tournamentType}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#5C2C90] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                    {tour.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-900">{tour.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tour.rulesAndNotes || '—'}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">المراحل المستهدفة:</span>
                    <span className="font-bold text-slate-800">{tour.targetStages}</span>
                  </div>
                  {tour.winningClassroom && (
                    <div className="flex justify-between text-emerald-800 font-bold">
                      <span>الفصل / الفريق الفائز:</span>
                      <span>{tour.winningClassroom} 🏆</span>
                    </div>
                  )}
                  {tour.bestPlayerOrScorer && (
                    <div className="flex justify-between text-[#5C2C90] font-bold">
                      <span>أفضل لاعب / الهداف:</span>
                      <span>{tour.bestPlayerOrScorer} ⭐</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Record Fitness Assessment */}
      {isAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-right my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#5C2C90] flex items-center gap-2">
                <Activity size={18} />
                <span>رصد تقييم اللياقة البدنية والمهارات الحركية</span>
              </h3>
              <button onClick={() => setIsAssessmentModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAssessment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اختيار الطالب *</label>
                <select
                  required
                  disabled={!!editingAssessment}
                  value={assessmentForm.studentId}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, studentId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                >
                  <option value="">اختر الطالب...</option>
                  {studentsList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} (فصل {s.classroom || 'A1'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">انضباط طابور الصباح</label>
                  <select
                    value={assessmentForm.morningAssemblyStatus}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, morningAssemblyStatus: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                  >
                    <option value="حاضر ومنضبط">حاضر ومنضبط في التمارين ✅</option>
                    <option value="تأخر عن التمارين">تأخر عن الطابور ⏳</option>
                    <option value="غائب عن الطابور">غائب عن طابور الصباح ❌</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">اللياقة الإجمالية (من 100)</label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={assessmentForm.fitnessScore}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, fitnessScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">السرعة (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={assessmentForm.speedScore}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, speedScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">التحمل (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={assessmentForm.enduranceScore}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, enduranceScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المرونة (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={assessmentForm.flexibilityScore}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, flexibilityScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الرياضة المفضلة</label>
                <select
                  value={assessmentForm.preferredSport}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, preferredSport: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                >
                  <option value="كرة قدم">كرة قدم ⚽</option>
                  <option value="تنس طاولة">تنس طاولة 🏓</option>
                  <option value="شطرنج">شطرنج ♟️</option>
                  <option value="ألعاب قوى">ألعاب قوى وجري 🏃</option>
                  <option value="كرة سلة">كرة سلة 🏀</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات وتوجيهات الكابتن</label>
                <textarea
                  rows="2"
                  placeholder="ملاحظات توجيهية للطالب..."
                  value={assessmentForm.coachNotes}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, coachNotes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssessmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:from-[#4a2175] hover:to-[#be0066] text-white font-black shadow-md shadow-purple-900/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'جارٍ الحفظ...' : 'اعتماد التقييم الرياضي'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create Tournament */}
      {isTournamentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-right my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#5C2C90] flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                <span>تنظيم دوري أو بطولة رياضية جديدة</span>
              </h3>
              <button onClick={() => setIsTournamentModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم البطولة أو الدوري *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: دوري خماسي كرة القدم لفصول المرحلة الأولى"
                  value={tournamentForm.title}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع المسابقة</label>
                  <select
                    value={tournamentForm.tournamentType}
                    onChange={(e) => setTournamentForm({ ...tournamentForm, tournamentType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                  >
                    <option value="دوري كرة القدم">دوري كرة القدم ⚽</option>
                    <option value="دوري الشطرنج وتنس الطاولة">شطرنج وتنس طاولة 🏓</option>
                    <option value="ماراثون اللياقة والتحمل">ماراثون اللياقة 🏃</option>
                    <option value="دوري كرة السلة">كرة سلة 🏀</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المراحل المشاركة</label>
                  <input
                    type="text"
                    value={tournamentForm.targetStages}
                    onChange={(e) => setTournamentForm({ ...tournamentForm, targetStages: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">شروط وقواعد البطولة</label>
                <textarea
                  rows="2"
                  placeholder="القواعد، مواعيد المباريات، حكام اللقاء..."
                  value={tournamentForm.rulesAndNotes}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, rulesAndNotes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/20 focus:border-[#5C2C90]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTournamentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:from-[#4a2175] hover:to-[#be0066] text-white font-black shadow-md shadow-purple-900/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'جارٍ الإنشاء...' : 'إطلاق البطولة 🏆'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
