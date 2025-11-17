'use client';

import { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'react-feather';
import {
  useContractAlerts,
  useAcknowledgeAlert,
  useResolveAlert,
} from '../../hooks/useContractAlerts';
import { AlertStatus, AlertSeverity } from '@/types/contract-alerts';
import { useNotificationStore } from '../../../common/stores/notification';
import styles from './contract-alerts-panel.module.css';

interface ContractAlertsPanelProps {
  venueId: string;
  onClose?: () => void;
}

/**
 * Panel component to display and manage contract alerts
 */
export const ContractAlertsPanel: React.FC<ContractAlertsPanelProps> = ({
  venueId,
  onClose,
}) => {
  const [statusFilter, setStatusFilter] = useState<AlertStatus | undefined>(
    AlertStatus.PENDING,
  );

  const { data: alerts, isLoading } = useContractAlerts(venueId, statusFilter);
  const acknowledgeMutation = useAcknowledgeAlert();
  const resolveMutation = useResolveAlert();
  const showNotification = useNotificationStore((state) => state.showNotification);

  const handleAcknowledge = async (alertId: string) => {
    try {
      await acknowledgeMutation.mutateAsync(alertId);
      showNotification({
        message: 'Avviso preso in carico',
        type: 'success',
      });
    } catch {
      showNotification({
        message: 'Errore durante l\'aggiornamento dell\'avviso',
        type: 'error',
      });
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await resolveMutation.mutateAsync(alertId);
      showNotification({
        message: 'Avviso risolto',
        type: 'success',
      });
    } catch {
      showNotification({
        message: 'Errore durante la risoluzione dell\'avviso',
        type: 'error',
      });
    }
  };

  const getSeverityClass = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return styles.critical;
      case AlertSeverity.WARNING:
        return styles.warning;
      case AlertSeverity.INFO:
        return styles.info;
      default:
        return '';
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return <AlertCircle size={20} />;
      case AlertSeverity.WARNING:
        return <AlertTriangle size={20} />;
      case AlertSeverity.INFO:
        return <Info size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Avvisi Contratti</h2>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        )}
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterButton} ${!statusFilter ? styles.active : ''}`}
          onClick={() => setStatusFilter(undefined)}
        >
          Tutti
        </button>
        <button
          className={`${styles.filterButton} ${statusFilter === AlertStatus.PENDING ? styles.active : ''}`}
          onClick={() => setStatusFilter(AlertStatus.PENDING)}
        >
          In Sospeso
        </button>
        <button
          className={`${styles.filterButton} ${statusFilter === AlertStatus.ACKNOWLEDGED ? styles.active : ''}`}
          onClick={() => setStatusFilter(AlertStatus.ACKNOWLEDGED)}
        >
          Presi in Carico
        </button>
        <button
          className={`${styles.filterButton} ${statusFilter === AlertStatus.RESOLVED ? styles.active : ''}`}
          onClick={() => setStatusFilter(AlertStatus.RESOLVED)}
        >
          Risolti
        </button>
      </div>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loading}>Caricamento...</div>
        ) : alerts && alerts.length > 0 ? (
          <div className={styles.alertsList}>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`${styles.alertCard} ${getSeverityClass(alert.severity)}`}
              >
                <div className={styles.alertHeader}>
                  <span className={styles.alertIcon}>
                    {getSeverityIcon(alert.severity)}
                  </span>
                  <div className={styles.alertInfo}>
                    <h3 className={styles.alertStaff}>
                      {alert.staff
                        ? `${alert.staff.firstName} ${alert.staff.lastName}`
                        : 'Staff Sconosciuto'}
                    </h3>
                    <span className={styles.alertRole}>
                      {alert.staff?.staffRole || 'Ruolo non specificato'}
                    </span>
                  </div>
                  <div className={styles.alertDays}>
                    {alert.daysUntilExpiry === 0 ? (
                      <span className={styles.daysToday}>Oggi</span>
                    ) : alert.daysUntilExpiry === 1 ? (
                      <span className={styles.daysTomorrow}>Domani</span>
                    ) : (
                      <span className={styles.daysCount}>
                        {alert.daysUntilExpiry} giorni
                      </span>
                    )}
                  </div>
                </div>

                <p className={styles.alertMessage}>{alert.message}</p>

                <div className={styles.alertFooter}>
                  <span className={styles.alertDate}>
                    Scadenza: {new Date(alert.contractEndDate).toLocaleDateString('it-IT')}
                  </span>
                  <div className={styles.alertActions}>
                    {alert.status === AlertStatus.PENDING && (
                      <>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleAcknowledge(alert.id)}
                          disabled={acknowledgeMutation.isPending}
                        >
                          Prendi in Carico
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.resolveButton}`}
                          onClick={() => handleResolve(alert.id)}
                          disabled={resolveMutation.isPending}
                        >
                          Risolvi
                        </button>
                      </>
                    )}
                    {alert.status === AlertStatus.ACKNOWLEDGED && (
                      <button
                        className={`${styles.actionButton} ${styles.resolveButton}`}
                        onClick={() => handleResolve(alert.id)}
                        disabled={resolveMutation.isPending}
                      >
                        Risolvi
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>Nessun avviso contratto</p>
          </div>
        )}
      </div>
    </div>
  );
};

