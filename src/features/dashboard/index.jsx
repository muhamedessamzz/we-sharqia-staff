import React from 'react';
import { useDashboardHubData } from './hooks/useDashboardHubData';
import DashboardHero from './components/DashboardHero';
import DashboardMetricsGrid from './components/DashboardMetricsGrid';
import DashboardShortcuts from './components/DashboardShortcuts';
import GradeDistributionCard from './components/GradeDistributionCard';
import HonorRollCard from './components/HonorRollCard';

export default function DashboardView({ user, onNavigateTab }) {
  const {
    loading,
    refresh,
    metrics,
    honorRoll,
    students,
  } = useDashboardHubData();

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Hero Banner */}
      <DashboardHero
        user={user}
        onRefresh={refresh}
        loading={loading}
      />

      {/* 2. Interactive Quick Shortcuts */}
      <DashboardShortcuts
        onNavigateTab={onNavigateTab}
      />

      {/* 3. Numerical KPIs & Real-time Metrics */}
      <DashboardMetricsGrid
        metrics={metrics}
        loading={loading}
        onNavigateTab={onNavigateTab}
      />

      {/* 4. Grade & Technical Tracks Distribution */}
      <GradeDistributionCard
        students={students}
        onNavigateTab={onNavigateTab}
      />

      {/* 5. Honor Roll & Academic Excellence */}
      <HonorRollCard
        honorRoll={honorRoll}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
}
