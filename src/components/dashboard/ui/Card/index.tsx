import styles from './card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({ children, className = '', padding = 'medium' }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[padding]} ${className}`}>
      {children}
    </div>
  );
}

