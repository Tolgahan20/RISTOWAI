'use client';

import React from 'react';
import Link from 'next/link';
import type { UrlObject } from 'url';
import { ArrowRight } from 'react-feather';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import styles from './forgot-password-form.module.css';

export const ForgotPasswordForm: React.FC = () => {
  const {
    formData,
    updateEmail,
    markTouched,
    handleSubmit,
    getEmailError,
    isLoading,
    isSuccess,
    resend,
  } = useForgotPassword();

  if (isSuccess) {
    return (
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>Email inviata!</h2>
        <p className={styles.successText}>
          Abbiamo inviato un link per reimpostare la password a <strong>{formData.email}</strong>.
          Controlla la tua casella di posta e segui le istruzioni.
        </p>
        <p className={styles.successHint}>
          Non hai ricevuto l&apos;email? Controlla la cartella spam o{' '}
          <button
            type="button"
            onClick={resend}
            className={styles.resendLink}
            disabled={isLoading}
          >
            invia di nuovo
          </button>
        </p>
        <Link href="/login" className={styles.backToLoginButton} as={"/login" as unknown as UrlObject}>
          Torna al login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email *
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateEmail(e.target.value)}
          onBlur={markTouched}
          className={`${styles.input} ${getEmailError() ? styles.inputError : ''}`}
          placeholder="la-tua-email@esempio.com"
          disabled={isLoading}
          autoFocus
        />
        {getEmailError() && (
          <span className={styles.errorMessage}>{getEmailError()}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={styles.submitButton}
      >
        <span className={styles.buttonText}>
          {isLoading ? 'Invio in corso...' : 'Invia link di reset'}
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

