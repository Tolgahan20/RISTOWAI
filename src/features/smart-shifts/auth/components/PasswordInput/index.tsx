'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'react-feather';
import styles from './password-input.module.css';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  label?: string;
  errorMessage?: string;
  className?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  hasError,
  label,
  errorMessage,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`${styles.input} ${hasError ? styles.inputError : ''}`}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={styles.toggleButton}
          tabIndex={-1}
          disabled={disabled}
          aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
        >
          {showPassword ? (
            <EyeOff size={18} className={styles.icon} />
          ) : (
            <Eye size={18} className={styles.icon} />
          )}
        </button>
      </div>
      {errorMessage && (
        <span className={styles.errorMessage}>{errorMessage}</span>
      )}
    </div>
  );
};

