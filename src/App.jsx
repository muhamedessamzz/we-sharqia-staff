import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthView from './components/AuthView';
import TeacherView from './components/TeacherView';
import AdminView from './components/AdminView';
import QualityView from './components/QualityView';
import SocialWorkerView from './components/SocialWorkerView';
import StudentAffairsView from './components/StudentAffairsView';
import AssessmentView from './components/AssessmentView';
import ManagerView from './components/ManagerView';
import HrView from './components/HrView';
import SportsView from './components/SportsView';
import DashboardView from './features/dashboard';
import NotificationsView from './features/notifications';
import MasterScheduleViewer from './components/schedule/MasterScheduleViewer';
import { 
  Users, Activity, ShieldCheck, HeartHandshake, 
  FolderCheck, Award, Wrench, Menu, X, ChevronLeft,
  ExternalLink, Sparkles, Briefcase, LayoutDashboard, Bell,
  Eye, ArrowRightLeft, Trophy, Scale, Calendar
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    // If there was an old impersonation session in localStorage, immediately revert to the original user
    const impersonated = localStorage.getItem('we_sharkia_impersonated_from');
    if (impersonated) {
      localStorage.removeItem('we_sharkia_impersonated_from');
      try {
        const orig = JSON.parse(impersonated);
        localStorage.setItem('we_sharkia_admin_user', JSON.stringify(orig));
        return orig;
      } catch {
        // fallback
      }
    }
    const saved = localStorage.getItem('we_sharkia_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Read initial active tab from URL hash (e.g., #affairs -> 'affairs')
  const getTabFromHash = () => {
    const hash = window.location.hash.replace('#', '').trim();
    return hash || null;
  };

  const [activeTab, setActiveTab] = useState(() => {
    return getTabFromHash() || 'dashboard';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigate function that creates real browser history steps
  const navigateToTab = (tabId, replace = false) => {
    if (!tabId) return;
    if (tabId === activeTab && window.location.hash === `#${tabId}`) {
      setMobileMenuOpen(false);
      return;
    }

    if (replace) {
      window.history.replaceState({ tab: tabId }, '', `#${tabId}`);
    } else {
      window.history.pushState({ tab: tabId }, '', `#${tabId}`);
    }
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  // Sync tab with browser Back/Forward buttons (popstate & hashchange)
  useEffect(() => {
    const handlePopState = (event) => {
      const hashTab = window.location.hash.replace('#', '').trim();
      const targetTab = event?.state?.tab || hashTab || 'dashboard';
      setActiveTab(targetTab);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    if (currentUser) {
      localStorage.setItem('we_sharkia_admin_user', JSON.stringify(currentUser));
      const currentHash = getTabFromHash();
      if (!currentHash) {
        window.history.replaceState({ tab: 'dashboard' }, '', '#dashboard');
        setActiveTab('dashboard');
      } else {
        setActiveTab(currentHash);
      }
    } else {
      localStorage.removeItem('we_sharkia_admin_user');
      setActiveTab('dashboard');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('we_sharkia_impersonated_from');
    window.location.hash = '';
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <div className="h-screen max-h-screen overflow-hidden flex flex-col justify-between bg-[#F8F5FC] text-[#26163A]">
        {/* Compact Header for Login */}
        <header className="px-4 pt-3 sm:pt-4 w-full max-w-5xl mx-auto shrink-0">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xs rounded-2xl px-4 sm:px-5 h-12 sm:h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/Purple Code and Signal Crest.png"
                alt="شعار مدارس WE للتكنولوجيا التطبيقية"
                className="w-8 h-8 object-contain drop-shadow-xs"
              />
              <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                مدارس WE للتكنولوجيا التطبيقية · فرع الشرقية
              </span>
            </div>
            <a
              href="http://localhost:5173"
              className="flex items-center gap-1.5 text-xs font-bold text-[#5C2C90] hover:text-[#421d69] bg-purple-50 hover:bg-purple-100 border border-purple-200/70 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>بوابة الطلاب وأولياء الأمور</span>
              <span className="text-xs">↗</span>
            </a>
          </div>
        </header>

        {/* Center Auth Card with Zero Scroll */}
        <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <AuthView onLoginSuccess={setCurrentUser} />
        </main>

        {/* Compact Footer */}
        <footer className="py-2.5 text-center text-[11px] text-slate-400 font-medium shrink-0">
          منظومة مدارس WE للتكنولوجيا التطبيقية · الشركة المصرية للاتصالات Telecom Egypt © 2026
        </footer>
      </div>
    );
  }

  const renderDashboard = () => {
    const r = currentUser.role?.toLowerCase();

    // Guard against student/parent accessing admin app
    if (r === 'student' || r === 'parent') {
      return (
        <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border border-slate-200/80 shadow-md space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl">
            🔒
          </div>
          <h3 className="text-xl font-black text-slate-900">أهلًا بك {currentUser.fullName}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            هذه البوابة مخصصة للمعلمين وإدارة المدرسة فقط. بصفتك ({r === 'student' ? 'طالبًا' : 'ولي أمر'})، يمكنك متابعة حسابك عبر بوابة الطلاب وأولياء الأمور.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="http://localhost:5173"
              className="bg-[#5C2C90] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-95 shadow-md shadow-purple-900/20 transition-all inline-block"
            >
              فتح بوابة الطلاب وأولياء الأمور ↗
            </a>
            <button
              onClick={handleLogout}
              className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      );
    }

    const isPlatformAdmin = r === 'admin' || currentUser?.isSuperAdmin;
    const isSchoolManager = r === 'schoolmanager';
    const isSchoolLeadership = isPlatformAdmin || isSchoolManager;
    const isHR = r === 'hr';

    const currentTab = activeTab || 'dashboard';

    // Navigation Items Definition with Permissions
    const navigationItems = [
      {
        id: 'dashboard',
        title: 'لوحة التحكم',
        icon: LayoutDashboard,
      },
      (isPlatformAdmin || isSchoolManager) && {
        id: 'manager',
        title: 'إدارة المدرسة',
        icon: Briefcase,
      },
      (isPlatformAdmin || isSchoolManager || isHR) && {
        id: 'schedule',
        title: 'الجدول المدرسي والإشراف',
        icon: Calendar,
      },
      isPlatformAdmin && {
        id: 'admin',
        title: 'طاقم العمل والمستخدمين',
        icon: ShieldCheck,
      },
      (isPlatformAdmin || isSchoolManager) && {
        id: 'notifications',
        title: 'الإشعارات والتنبيهات',
        icon: Bell,
      },
      (isSchoolLeadership || r === 'studentaffairs') && {
        id: 'affairs',
        title: 'الطلاب والفصول الدراسية',
        icon: FolderCheck,
      },
      (isSchoolLeadership || r === 'teacher' || r === 'technicalengineer') && {
        id: 'teacher',
        title: r === 'technicalengineer' ? 'المعامل والتدريب العملي' : 'الفصول والتدريس',
        icon: Users,
      },
      (isSchoolLeadership || r === 'sportscoach') && {
        id: 'sports',
        title: 'التربية الرياضية والأنشطة',
        icon: Trophy,
      },
      (isSchoolLeadership || r === 'assessmentcoordinator' || r === 'teacher' || r === 'technicalengineer') && {
        id: 'assessment',
        title: 'الامتحانات والدرجات',
        icon: Award,
      },
      (isSchoolLeadership || r === 'hr') && {
        id: 'hr',
        title: 'الموارد البشرية وشؤون العاملين',
        icon: Scale,
      },
      (isSchoolLeadership || r === 'socialworker') && {
        id: 'social',
        title: 'الأخصائي الاجتماعي',
        icon: HeartHandshake,
      },
      (isSchoolLeadership || r === 'qualitycoordinator' || r === 'it') && {
        id: 'quality',
        title: 'تقارير الجودة',
        icon: Activity,
      },
    ].filter(Boolean);

    // Resolve current tab: if user accesses an unauthorized tab (e.g. engineer going to #schedule), redirect to their primary tab
    const allowedTabIds = navigationItems.map(item => item.id);
    const resolvedTab = allowedTabIds.includes(currentTab)
      ? currentTab
      : (allowedTabIds.includes('teacher') && (r === 'teacher' || r === 'technicalengineer')
          ? 'teacher'
          : (allowedTabIds[0] || 'dashboard'));

    const currentItem = navigationItems.find(item => item.id === resolvedTab) || navigationItems[0];

    return (
      <div className="min-h-screen bg-[#F8F5FC] text-[#26163A]">
        {/* 1. Backdrop overlay on mobile */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        {/* 2. Fixed Full-Height Sidebar with Rounded Corners */}
        <aside 
          className={`fixed top-3 bottom-3 right-3 w-64 lg:w-72 h-[calc(100vh-1.5rem)] bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-purple-950/5 z-50 flex flex-col justify-between p-4.5 transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-[120%] lg:translate-x-0'
          }`}
        >
          {/* Top Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 p-1.5 border border-purple-100/80 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src="/Purple Code and Signal Crest.png"
                  alt="شعار مدارس WE"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <span className="font-black text-slate-900 text-sm tracking-tight block truncate">
                  مدارس WE للتكنولوجيا
                </span>
                <span className="text-[11px] font-bold text-slate-400 block -mt-0.5">
                  فرع الشرقية
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links - Distributed across the sidebar height */}
          <nav className="flex-1 py-4 flex flex-col justify-evenly gap-2 overflow-y-auto scrollbar-none">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigateToTab(item.id)}
                  className={`w-full group flex items-center justify-between px-3.5 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-l from-[#5C2C90] to-[#7134b2] text-white shadow-md shadow-purple-900/20 font-bold ring-2 ring-purple-300/40'
                      : 'bg-slate-50/80 hover:bg-purple-50/70 text-slate-700 hover:text-[#5C2C90] border border-slate-200/70 hover:border-purple-200 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive 
                        ? 'bg-white/20 text-white shadow-2xs' 
                        : 'bg-white text-slate-500 border border-slate-200/80 group-hover:bg-purple-100 group-hover:text-[#5C2C90] group-hover:border-purple-200'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-extrabold truncate">
                      {item.title}
                    </span>
                  </div>

                  <div className={`shrink-0 transition-transform ${
                    isActive 
                      ? 'text-white/80 translate-x-0' 
                      : 'text-slate-300 group-hover:text-[#5C2C90] group-hover:-translate-x-1'
                  }`}>
                    <ChevronLeft size={16} />
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Clean Bottom Link to Portal */}
          <div className="pt-2 border-t border-slate-100 shrink-0">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:text-[#5C2C90] bg-purple-50/40 hover:bg-purple-50 border border-purple-100/70 hover:border-purple-200 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 group-hover:bg-[#5C2C90] text-[#5C2C90] group-hover:text-white flex items-center justify-center transition-colors">
                  <ExternalLink size={14} />
                </div>
                <span>بوابة الطلاب وأولياء الأمور</span>
              </div>
              <span className="text-slate-400 group-hover:text-[#5C2C90] text-xs transition-colors">↗</span>
            </a>
          </div>
        </aside>

        {/* 3. Main Viewport Column (Starts NEXT to the sidebar) */}
        <div className="lg:mr-[19.5rem] min-h-screen flex flex-col pt-3 px-3 sm:px-6">
          {/* Navbar sitting at the top beside the sidebar */}
          <Header 
            user={currentUser} 
            onLogout={handleLogout} 
            activeTabItem={currentItem}
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          />

          {/* Dashboard Active View */}
          <main className="flex-1 py-5 w-full">
            {resolvedTab === 'dashboard' && <DashboardView user={currentUser} onNavigateTab={navigateToTab} />}
            {resolvedTab === 'manager' && <ManagerView user={currentUser} />}
            {resolvedTab === 'schedule' && <MasterScheduleViewer user={currentUser} />}
            {resolvedTab === 'teacher' && <TeacherView user={currentUser} />}
            {resolvedTab === 'sports' && <SportsView user={currentUser} />}
            {resolvedTab === 'affairs' && <StudentAffairsView user={currentUser} />}
            {resolvedTab === 'assessment' && <AssessmentView user={currentUser} />}
            {resolvedTab === 'hr' && <HrView user={currentUser} />}
            {resolvedTab === 'social' && <SocialWorkerView user={currentUser} />}
            {resolvedTab === 'quality' && <QualityView user={currentUser} />}
            {resolvedTab === 'admin' && <AdminView user={currentUser} />}
            {resolvedTab === 'notifications' && <NotificationsView user={currentUser} />}
          </main>

          <Footer />
        </div>
      </div>
    );
  };

  return renderDashboard();
}
