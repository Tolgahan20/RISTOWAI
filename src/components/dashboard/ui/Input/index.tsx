import styles from './input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  touched?: boolean;
}

export function Input({ error, touched, className = '', ...props }: InputProps) {
  return (
    <div className={styles.wrapper}>
      <input
        className={`${styles.input} ${touched && error ? styles.error : ''} ${className}`}
        {...props}
      />
      {touched && error && (
        <span className={styles.errorText}>{error}</span>
      )}
    </div>
  );
}

