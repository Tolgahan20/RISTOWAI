import { AlertCircle, Briefcase, AlertTriangle, ChevronRight } from 'react-feather';
import styles from './needs-approval.module.css';

interface ApprovalsData {
  contractAlerts: number;
  timeOffRequests: number;
  anomalies: number;
}

interface NeedsApprovalProps {
  approvals: ApprovalsData;
  onViewAlerts: () => void;
}

export const NeedsApproval: React.FC<NeedsApprovalProps> = ({ approvals, onViewAlerts }) => {
  const hasApprovals = approvals.contractAlerts > 0 || approvals.timeOffRequests > 0 || approvals.anomalies > 0;

  if (!hasApprovals) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Richiede Approvazione</h2>
      
      <div className={styles.grid}>
        {approvals.contractAlerts > 0 && (
          <div 
            className={styles.card}
            onClick={onViewAlerts}
            role="button"
            tabIndex={0}
          >
            <div className={styles.icon}>
              <AlertCircle size={24} />
            </div>
            <div className={styles.content}>
              <div className={styles.count}>{approvals.contractAlerts}</div>
              <div className={styles.label}>Avvisi Contratto</div>
            </div>
            <ChevronRight size={20} className={styles.chevron} />
          </div>
        )}

        {approvals.timeOffRequests > 0 && (
          <div className={`${styles.card} ${styles.disabled}`}>
            <div className={styles.icon}>
              <Briefcase size={24} />
            </div>
            <div className={styles.content}>
              <div className={styles.count}>{approvals.timeOffRequests}</div>
              <div className={styles.label}>Richieste Ferie</div>
            </div>
            <ChevronRight size={20} className={styles.chevron} />
          </div>
        )}

        {approvals.anomalies > 0 && (
          <div className={styles.card}>
            <div className={styles.icon}>
              <AlertTriangle size={24} />
            </div>
            <div className={styles.content}>
              <div className={styles.count}>{approvals.anomalies}</div>
              <div className={styles.label}>Anomalie</div>
            </div>
            <ChevronRight size={20} className={styles.chevron} />
          </div>
        )}
      </div>
    </div>
  );
};

