import { useMemo } from 'react';
import { useDashboardKpis } from './useDashboardKpis';
import { useContractAlerts, usePendingAlertsCount } from '../../contract-alerts/hooks/useContractAlerts';
import { AlertStatus } from '@/types/contract-alerts';

interface UseDashboardDataParams {
  venueId: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export const useDashboardData = ({ venueId, dateRange }: UseDashboardDataParams) => {
  // Fetch all data
  const { data: kpisData, isLoading: kpisLoading } = useDashboardKpis({
    venueId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { data: alerts = [] } = useContractAlerts(venueId, AlertStatus.PENDING);
  const { data: alertsCount = 0 } = usePendingAlertsCount(venueId);

  // Compute derived data
  const todayEmergencies = useMemo(() => {
    if (!kpisData) return null;

    const todayDate = new Date().toISOString().split('T')[0];
    const todayCoverage = kpisData.phaseFillRate.dailyCoverage.find(d => d.date === todayDate);
    
    const uncoveredPhases = todayCoverage?.phases.filter(p => 
      p.status === 'uncovered' && p.requiredStaff > 0
    ) || [];
    
    const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'PENDING');
    
    return {
      uncoveredPhases,
      criticalAlerts,
      hasEmergencies: uncoveredPhases.length > 0 || criticalAlerts.length > 0,
    };
  }, [kpisData, alerts]);

  const weekSummary = useMemo(() => {
    if (!kpisData) return null;

    const weekCoverageAvg = Math.round(
      kpisData.phaseFillRate.dailyCoverage
        .slice(0, 7)
        .reduce((sum, day) => sum + day.overallCoveragePercentage, 0) / 7
    );

    return {
      coverageAvg: weekCoverageAvg,
      staffAvailable: kpisData.staffStatus.available,
      staffTotal: kpisData.staffStatus.total,
      costEstimate: kpisData.costEstimate.totalEstimatedCost,
      hoursPlanned: kpisData.costEstimate.totalPlannedHours,
    };
  }, [kpisData]);

  const weekDetails = useMemo(() => {
    if (!kpisData) return [];
    
    return kpisData.phaseFillRate.dailyCoverage.slice(0, 7).map(day => {
      const date = new Date(day.date);
      return {
        date: day.date,
        dayName: date.toLocaleDateString('it-IT', { weekday: 'short' }),
        dayNumber: date.getDate(),
        coverage: day.overallCoveragePercentage,
        phasesCount: day.phases.filter(p => p.requiredStaff > 0).length,
      };
    });
  }, [kpisData]);

  const approvals = useMemo(() => {
    if (!kpisData) return null;

    return {
      contractAlerts: alertsCount,
      timeOffRequests: 0, // Placeholder for future
      anomalies: kpisData.incidents.pending,
    };
  }, [kpisData, alertsCount]);

  const additionalMetrics = useMemo(() => {
    if (!kpisData) return null;

    return {
      overtimeHours: kpisData.overtimeHours,
      timeSaved: kpisData.managerTimeSaved.hoursPerWeek,
      timeSavedPercentage: kpisData.managerTimeSaved.percentageImprovement,
      staffOnShift: kpisData.staffStatus.onShift,
      incidentsResolved: kpisData.incidents.resolved,
    };
  }, [kpisData]);

  return {
    isLoading: kpisLoading,
    todayEmergencies,
    weekSummary,
    weekDetails,
    approvals,
    additionalMetrics,
    rawData: kpisData,
  };
};

