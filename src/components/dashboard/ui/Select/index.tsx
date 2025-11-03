import styles from './select.module.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
}

export function Select({ error, touched, children, className = '', ...props }: SelectProps) {
  return (
    <div className={styles.wrapper}>
      <select
        className={`${styles.select} ${touched && error ? styles.error : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {touched && error && (
        <span className={styles.errorText}>{error}</span>
      )}
    </div>
  );
}

