'use client';

import React from 'react';
import Link from 'next/link';
import type { UrlObject } from 'url';
import { ArrowRight } from 'react-feather';
import { useLoginForm } from '../../hooks/useLoginForm';
import { SocialAuthButtons } from '../SocialAuthButtons';
import { PasswordInput } from '../PasswordInput';
import styles from './login-form.module.css';

export const LoginForm: React.FC = () => {
  const {
    formData,
    isLoading,
    updateField,
    markFieldTouched,
    handleSubmit,
    getFieldError,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHeader}>
        <h1 className={styles.title}>Bentornato</h1>
        <p className={styles.subtitle}>
          Accedi al tuo account Ristowai
        </p>
      </div>

      <SocialAuthButtons mode="login" />

      <div className={styles.formFields}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            onBlur={() => markFieldTouched('email')}
            className={`${styles.input} ${getFieldError('email') ? styles.inputError : ''}`}
            placeholder="la-tua-email@esempio.com"
            disabled={isLoading}
          />
          {getFieldError('email') && (
            <span className={styles.errorMessage}>{getFieldError('email')}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <div className={styles.labelRow}>
            <label htmlFor="password" className={styles.label}>
              Password *
            </label>
            <Link href={"/forgot-password" as unknown as UrlObject} className={styles.forgotLink}>
              Password dimenticata?
            </Link>
          </div>
          <PasswordInput
            id="password"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            onBlur={() => markFieldTouched('password')}
            placeholder="La tua password"
            disabled={isLoading}
            hasError={!!getFieldError('password')}
            errorMessage={getFieldError('password')}
            className={styles.passwordInput}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={styles.submitButton}
      >
        <span className={styles.buttonText}>
          {isLoading ? 'Accesso in corso...' : 'Accedi'}
        </span>
        {!isLoading && (
          <span className={styles.buttonIcon}>
            <ArrowRight size={20} />
          </span>
        )}
      </button>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Non hai un account?{' '}
          <Link href={"/register" as unknown as UrlObject} className={styles.footerLink}>
            Registrati
          </Link>
        </p>
      </div>
    </form>
  );
};

