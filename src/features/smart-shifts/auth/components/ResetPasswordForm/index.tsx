'use client';

import React from 'react';
import Link from 'next/link';
import type { UrlObject } from 'url';
import { ArrowRight } from 'react-feather';
import { useResetPassword } from '../../hooks/useResetPassword';
import { PasswordInput } from '../PasswordInput';
import styles from './reset-password-form.module.css';

interface ResetPasswordFormProps {
  token: string | null;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const {
    formData,
    updatePassword,
    updateConfirmPassword,
    markPasswordTouched,
    markConfirmTouched,
    handleSubmit,
    getPasswordError,
    getConfirmError,
    isLoading,
  } = useResetPassword(token);

  if (!token) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2 className={styles.errorTitle}>Token mancante</h2>
        <p className={styles.errorText}>
          Il link di reset è incompleto. Richiedi un nuovo link dalla pagina di recupero password.
        </p>
        <Link href="/forgot-password" className={styles.errorButton} as={"/forgot-password" as unknown as UrlObject}>
          Recupera password
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Nuova password *
        </label>
        <PasswordInput
          id="password"
          value={formData.password}
          onChange={(e) => updatePassword(e.target.value)}
          onBlur={markPasswordTouched}
          placeholder="Minimo 8 caratteri"
          disabled={isLoading}
          hasError={!!getPasswordError()}
          errorMessage={getPasswordError()}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Conferma password *
        </label>
        <PasswordInput
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => updateConfirmPassword(e.target.value)}
          onBlur={markConfirmTouched}
          placeholder="Ripeti la password"
          disabled={isLoading}
          hasError={!!getConfirmError()}
          errorMessage={getConfirmError()}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={styles.submitButton}
      >
        <span className={styles.buttonText}>
          {isLoading ? 'Reimpostazione in corso...' : 'Reimposta password'}
        </span>
        {!isLoading && (
          <span className={styles.buttonIcon}>
            <ArrowRight size={20} />
          </span>
        )}
      </button>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Ricordi la password?{' '}
          <Link href="/login" className={styles.footerLink} as={"/login" as unknown as UrlObject}>
            Accedi
          </Link>
        </p>
      </div>
    </form>
  );
};

