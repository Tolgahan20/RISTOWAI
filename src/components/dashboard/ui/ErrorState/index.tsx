import { AlertCircle } from 'react-feather';
import { Button } from '../Button';
import styles from './error-state.module.css';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Errore',
  message,
  onRetry,
  retryLabel = 'Riprova',
}: ErrorStateProps) {
  return (
    <div className={styles.container}>
      <AlertCircle size={48} className={styles.icon} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

