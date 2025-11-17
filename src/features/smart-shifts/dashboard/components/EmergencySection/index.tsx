import { AlertTriangle, CheckCircle } from 'react-feather';
import { useRouter } from 'next/navigation';
import styles from './emergency-section.module.css';

interface UncoveredPhase {
  phaseName: string;
  requiredStaff: number;
}

interface CriticalAlert {
  id: string;
  message: string;
  staff?: {
    firstName: string;
    lastName: string;
  };
}

interface EmergencySectionProps {
  uncoveredPhases: UncoveredPhase[];
  criticalAlerts: CriticalAlert[];
  hasEmergencies: boolean;
  onViewAlerts: () => void;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({
  uncoveredPhases,
  criticalAlerts,
  hasEmergencies,
  onViewAlerts,
}) => {
  const router = useRouter();

  if (!hasEmergencies) {
    return (
      <div className={styles.allClear}>
        <CheckCircle size={24} className={styles.allClearIcon} />
        <div className={styles.allClearText}>
          <h3>Tutto Sotto Controllo</h3>
          <p>Nessuna emergenza oggi</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.emergency}>
      <div className={styles.header}>
        <AlertTriangle size={20} className={styles.icon} />
        <h3>Attenzione Richiesta</h3>
      </div>

      <div className={styles.issues}>
        {uncoveredPhases.length > 0 && (
          <div className={styles.issue}>
            <span className={styles.issueLabel}>
              {uncoveredPhases.length} {uncoveredPhases.length === 1 ? 'turno scoperto' : 'turni scoperti'} oggi
            </span>
            <button 
              className={styles.actionBtn}
              onClick={() => router.push('/dashboard/smart-shifts/ai-scheduler')}
            >
              Genera Turni
            </button>
          </div>
        )}

        {criticalAlerts.length > 0 && (
          <div className={styles.issue}>
            <span className={styles.issueLabel}>
              {criticalAlerts.length} {criticalAlerts.length === 1 ? 'contratto' : 'contratti'} in scadenza
            </span>
            <button 
              className={styles.actionBtn}
              onClick={onViewAlerts}
            >
              Gestisci
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

