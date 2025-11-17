'use client';

import { AlertTriangle } from 'react-feather';
import { usePendingAlertsCount } from '../../hooks/useContractAlerts';
import styles from './contract-alert-badge.module.css';

interface ContractAlertBadgeProps {
  venueId: string;
  onClick?: () => void;
}

/**
 * Badge component showing pending contract alerts count
 */
export const ContractAlertBadge: React.FC<ContractAlertBadgeProps> = ({
  venueId,
  onClick,
}) => {
  const { data: count, isLoading } = usePendingAlertsCount(venueId);

  if (isLoading || !count || count === 0) {
    return null;
  }

  return (
    <button
      className={styles.badge}
      onClick={onClick}
      title={`${count} contratto${count > 1 ? 'i' : ''} in scadenza`}
    >
      <AlertTriangle size={18} className={styles.icon} />
      <span className={styles.count}>{count}</span>
    </button>
  );
};

