'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/layout';
import { VenueSelector as VenueSelectorComponent } from '@/components/dashboard/ui';
import { useVenueSelection } from '@/features/smart-shifts/ai-scheduler/hooks/useVenueSelection';
import { ChevronLeft, ChevronRight, Calendar, Users, DollarSign, AlertCircle, Clock, TrendingUp, Download } from 'react-feather';
import {
  WeeklySummaryCard,
  AnomaliesSection,
  ExtraHoursSection,
} from '@/features/smart-shifts/weekly-admin/components';
import {
  useWeeklyAdminData,
  useResolveAnomaly,
  useApproveExtraHours,
  useLockWeek,
  useUnlockWeek,
  useWeekSelector,
} from '@/features/smart-shifts/weekly-admin/hooks/useWeeklyAdmin';
import { ExtraHoursDisposition } from '@/features/smart-shifts/weekly-admin/types';
import { formatWeekRange } from '@/features/smart-shifts/weekly-admin/utils/weekHelpers';
import { useDashboardKpis } from '@/features/smart-shifts/dashboard/hooks/useDashboardKpis';
import { KpiCard, PhaseCoverageCalendar } from '@/features/smart-shifts/dashboard/components';
import { useFairnessStats } from '@/features/smart-shifts/fair-rotation/hooks/useFairnessStats';
import { FairnessScoreCard, StaffFairnessList } from '@/features/smart-shifts/fair-rotation/components';
import { useCostReportDownload } from '@/features/smart-shifts/reports/hooks/useCostReportDownload';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './page.module.css';

type DashboardTab = 'weekly-admin' | 'fair-rotation';

export default function DashboardPage() {
  const { venues, selectedVenueId, setSelectedVenueId } = useVenueSelection();
  const [activeTab, setActiveTab] = useState<DashboardTab>('weekly-admin');
  const { isDownloading: isDownloadingPdf, downloadPdf } = useCostReportDownload();
  const {
    selectedWeek,
    weekStartDate,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  } = useWeekSelector();

  const [dateRange] = useState(() => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  });

  // Fair Rotation date range (last 30 days by default)
  const [fairRotationDateRange, setFairRotationDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  });

  // Fetch KPI data
  const { data: kpisData, isLoading: kpisLoading } = useDashboardKpis({
    venueId: selectedVenueId || '',
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  // Fetch weekly admin data
  const { data, isLoading, error } = useWeeklyAdminData(
    selectedVenueId || '',
    weekStartDate,
  );

  // Fetch fair rotation data
  const { data: fairnessData, isLoading: fairnessLoading } = useFairnessStats({
    venueId: selectedVenueId || '',
    startDate: fairRotationDateRange.startDate,
    endDate: fairRotationDateRange.endDate,
  });

  // Quick ranges for fair rotation
  const quickRanges = useMemo(() => {
    const today = new Date();
    return [
      {
        label: 'Ultimi 7 giorni',
        getValue: () => {
          const start = new Date(today);
          start.setDate(start.getDate() - 7);
          return {
            startDate: start.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0],
          };
        },
      },
      {
        label: 'Ultimi 30 giorni',
        getValue: () => {
          const start = new Date(today);
          start.setDate(start.getDate() - 30);
          return {
            startDate: start.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0],
          };
        },
      },
      {
        label: 'Questo mese',
        getValue: () => {
          const start = new Date(today.getFullYear(), today.getMonth(), 1);
          return {
            startDate: start.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0],
          };
        },
      },
    ];
  }, []);

  // Mutations
  const resolveAnomaly = useResolveAnomaly();
  const approveExtraHours = useApproveExtraHours();
  const lockWeek = useLockWeek();
  const unlockWeek = useUnlockWeek();

  // Handlers
  const handleResolveAnomaly = (
    timeEventId: string,
    notes: string,
    approvedHours?: number,
  ) => {
    if (!selectedVenueId) return;
    resolveAnomaly.mutate({
      venueId: selectedVenueId,
      timeEventId,
      data: { resolutionNotes: notes, approvedHours },
    });
  };

  const handleApproveExtraHours = (
    staffId: string,
    weekStartDate: string,
    extraHours: number,
    disposition: ExtraHoursDisposition,
    notes?: string,
  ) => {
    if (!selectedVenueId) return;
    approveExtraHours.mutate({
      venueId: selectedVenueId,
      data: { staffId, weekStartDate, extraHours, disposition, notes },
    });
  };

  const handleLockWeek = () => {
    if (!selectedVenueId) return;
    lockWeek.mutate({ venueId: selectedVenueId, data: { weekStartDate } });
  };

  const handleUnlockWeek = () => {
    if (!selectedVenueId) return;
    unlockWeek.mutate({ venueId: selectedVenueId, weekStartDate });
  };

  const handleDownloadCostEstimate = () => {
    if (!selectedVenueId) return;
    downloadPdf(selectedVenueId, dateRange.startDate, dateRange.endDate);
  };

  // Show venue selector if no venue is selected
  if (!selectedVenueId) {
    return (
      <VenueSelectorComponent
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />
    );
  }

  const isCurrentWeek = () => {
    const today = new Date();
    const currentWeekStart = new Date(today);
    const day = currentWeekStart.getDay();
    const diff = currentWeekStart.getDate() - day + (day === 0 ? -6 : 1);
    currentWeekStart.setDate(diff);
    currentWeekStart.setHours(0, 0, 0, 0);
    
    const selected = new Date(selectedWeek);
    selected.setHours(0, 0, 0, 0);
    
    return currentWeekStart.getTime() === selected.getTime();
  };

  return (
    <div className={pageLayout.container}>
      <PageHeader
        title="Dashboard Manager"
        subtitle="Panoramica KPI e amministrazione settimanale"
        showVenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />

      {/* KPI Cards Grid */}
      {kpisData && !kpisLoading && (
        <>
          <div className={styles.kpiGrid}>
            <KpiCard
              title="Copertura Fasi"
              value={`${kpisData.phaseFillRate.overall}%`}
              subtitle="Media 7 giorni"
              icon={<Calendar size={24} />}
              color={
                kpisData.phaseFillRate.overall >= 90
                  ? '#10b981'
                  : kpisData.phaseFillRate.overall >= 70
                    ? '#f59e0b'
                    : '#ef4444'
              }
            />

            <KpiCard
              title="Staff Disponibile"
              value={kpisData.staffStatus.available}
              subtitle={`${kpisData.staffStatus.total} totale`}
              icon={<Users size={24} />}
              color="#3b82f6"
            />

            <KpiCard
              title="Costo Stimato"
              value={`€${kpisData.costEstimate.totalEstimatedCost.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtitle={`${kpisData.costEstimate.totalPlannedHours.toFixed(1)}h pianificate`}
              icon={<DollarSign size={24} />}
              color="#8b5cf6"
            />

            <KpiCard
              title="Anomalie"
              value={kpisData.incidents.pending}
              subtitle={`${kpisData.incidents.resolved} risolte`}
              icon={<AlertCircle size={24} />}
              color={kpisData.incidents.pending > 0 ? '#f59e0b' : '#10b981'}
            />

            <KpiCard
              title="Ore Extra"
              value={kpisData.overtimeHours > 0 ? `${kpisData.overtimeHours}h` : '-'}
              subtitle="Straordinario"
              icon={<Clock size={24} />}
              color="#ec4899"
            />

            <KpiCard
              title="Tempo Risparmiato"
              value={`${kpisData.managerTimeSaved.hoursPerWeek}h`}
              subtitle={`${kpisData.managerTimeSaved.percentageImprovement}% miglioramento`}
              icon={<TrendingUp size={24} />}
              color="#10b981"
              trend={{
                value: kpisData.managerTimeSaved.percentageImprovement,
                isPositive: true,
              }}
            />
          </div>

          {/* Phase Coverage Calendar */}
          <PhaseCoverageCalendar dailyCoverage={kpisData.phaseFillRate.dailyCoverage} />
          
          {/* Cost Estimate PDF Download */}
          <div className={styles.downloadSection}>
            <button
              className={styles.downloadButton}
              onClick={handleDownloadCostEstimate}
              disabled={isDownloadingPdf}
            >
              <Download size={18} />
              {isDownloadingPdf ? 'Generazione PDF...' : 'Scarica Report Costi (PDF)'}
            </button>
          </div>
        </>
      )}

      {/* Tabbed Section */}
      <div className={styles.tabbedSection}>
        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'weekly-admin' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('weekly-admin')}
          >
            Amministrazione Settimanale
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'fair-rotation' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('fair-rotation')}
          >
            Rotazione Equa Weekend
          </button>
        </div>

        {/* Weekly Admin Tab */}
        {activeTab === 'weekly-admin' && (
          <div className={styles.tabContent}>
            <div className={styles.weekSelector}>
        <button
          onClick={goToPreviousWeek}
          className={styles.weekButton}
          aria-label="Settimana Precedente"
        >
          <ChevronLeft size={20} />
        </button>

        <div className={styles.weekDisplay}>
          <Calendar size={18} />
          <span className={styles.weekRange}>{formatWeekRange(weekStartDate)}</span>
        </div>

        <button
          onClick={goToNextWeek}
          className={styles.weekButton}
          aria-label="Settimana Successiva"
        >
          <ChevronRight size={20} />
        </button>

        {!isCurrentWeek() && (
          <button onClick={goToCurrentWeek} className={styles.todayButton}>
            Oggi
          </button>
        )}
        </div>

        <div className={styles.content}>
          {isLoading && (
            <div className={styles.loadingState}>Caricamento dati...</div>
          )}

          {error && (
            <div className={styles.errorState}>
              Errore nel caricamento dei dati. Riprova.
            </div>
          )}

          {data && (
            <>
              <WeeklySummaryCard
                summary={data.summary}
                onLockWeek={handleLockWeek}
                onUnlockWeek={handleUnlockWeek}
                isLockLoading={lockWeek.isPending || unlockWeek.isPending}
              />

              <AnomaliesSection
                anomalies={data.anomalies}
                onResolve={handleResolveAnomaly}
                isResolving={resolveAnomaly.isPending}
              />

              <ExtraHoursSection
                extraHours={data.extraHours}
                onApprove={handleApproveExtraHours}
                isApproving={approveExtraHours.isPending}
              />
            </>
          )}
        </div>
          </div>
        )}

        {/* Fair Rotation Tab */}
        {activeTab === 'fair-rotation' && (
          <div className={styles.tabContent}>
            {/* Date Range Selector */}
            <div className={styles.fairRotationDateRange}>
              <div className={styles.dateInputs}>
                <div className={styles.inputGroup}>
                  <label htmlFor="startDate">Data Inizio</label>
                  <input
                    id="startDate"
                    type="date"
                    value={fairRotationDateRange.startDate}
                    onChange={(e) =>
                      setFairRotationDateRange((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    max={fairRotationDateRange.endDate}
                    className={styles.dateInput}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="endDate">Data Fine</label>
                  <input
                    id="endDate"
                    type="date"
                    value={fairRotationDateRange.endDate}
                    onChange={(e) =>
                      setFairRotationDateRange((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    min={fairRotationDateRange.startDate}
                    max={new Date().toISOString().split('T')[0]}
                    className={styles.dateInput}
                  />
                </div>
              </div>

              <div className={styles.quickRanges}>
                {quickRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => setFairRotationDateRange(range.getValue())}
                    className={styles.quickRangeButton}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {fairnessLoading && (
              <div className={styles.loadingState}>
                Caricamento statistiche...
              </div>
            )}

            {/* Fair Rotation Data */}
            {fairnessData && !fairnessLoading && (
              <div className={styles.fairRotationContent}>
                {/* Overall Fairness Score */}
                <FairnessScoreCard
                  score={fairnessData.overallFairnessScore}
                  averageWeekendShifts={fairnessData.averageWeekendShifts}
                  standardDeviation={fairnessData.standardDeviation}
                  totalWeekendShifts={fairnessData.totalWeekendShifts}
                />

                {/* Recommendation */}
                {fairnessData.recommendation && (
                  <div className={styles.recommendationCard}>
                    <div className={styles.recommendationIcon}>💡</div>
                    <div>
                      <h4 className={styles.recommendationTitle}>
                        Raccomandazione
                      </h4>
                      <p className={styles.recommendationText}>
                        {fairnessData.recommendation}
                      </p>
                    </div>
                  </div>
                )}

                {/* Staff Fairness List */}
                <StaffFairnessList staffFairness={fairnessData.staffFairness} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

