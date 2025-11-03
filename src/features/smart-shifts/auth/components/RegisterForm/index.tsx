'use client';

import React from 'react';
import Link from 'next/link';
import type { UrlObject } from 'url';
import { ArrowRight } from 'react-feather';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { SocialAuthButtons } from '../SocialAuthButtons';
import { PasswordInput } from '../PasswordInput';
import styles from './register-form.module.css';

export const RegisterForm: React.FC = () => {
  const {
    formData,
    isLoading,
    isSuccess,
    updateField,
    markFieldTouched,
    handleSubmit,
    getFieldError,
  } = useRegisterForm();

  if (isSuccess) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>Registrazione Completata!</h2>
        <p className={styles.successMessage}>
          Ti abbiamo inviato un&apos;email di verifica. Per favore controlla la tua casella di posta 
          e clicca sul link per attivare il tuo account.
        </p>
        <Link href={"/login" as unknown as UrlObject} className={styles.successLink}>
          Vai al Login
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHeader}>
        <h1 className={styles.title}>Crea il tuo account</h1>
        <p className={styles.subtitle}>
          Inizia la tua prova gratuita di 1 mese
        </p>
      </div>

      <SocialAuthButtons mode="register" />

      <div className={styles.formFields}>
        <div className={styles.nameRow}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName" className={styles.label}>
              Nome *
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              onBlur={() => markFieldTouched('firstName')}
              className={`${styles.input} ${getFieldError('firstName') ? styles.inputError : ''}`}
              placeholder="Mario"
              disabled={isLoading}
            />
            {getFieldError('firstName') && (
              <span className={styles.errorMessage}>{getFieldError('firstName')}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName" className={styles.label}>
              Cognome *
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              onBlur={() => markFieldTouched('lastName')}
              className={`${styles.input} ${getFieldError('lastName') ? styles.inputError : ''}`}
              placeholder="Rossi"
              disabled={isLoading}
            />
            {getFieldError('lastName') && (
              <span className={styles.errorMessage}>{getFieldError('lastName')}</span>
            )}
          </div>
        </div>

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
            placeholder="mario.rossi@esempio.com"
            disabled={isLoading}
          />
          {getFieldError('email') && (
            <span className={styles.errorMessage}>{getFieldError('email')}</span>
          )}
        </div>

        <PasswordInput
          id="password"
          label="Password *"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
          onBlur={() => markFieldTouched('password')}
          placeholder="Minimo 8 caratteri"
          disabled={isLoading}
          hasError={!!getFieldError('password')}
          errorMessage={getFieldError('password')}
        />

        <PasswordInput
          id="confirmPassword"
          label="Conferma Password *"
          value={formData.confirmPassword}
          onChange={(e) => updateField('confirmPassword', e.target.value)}
          onBlur={() => markFieldTouched('confirmPassword')}
          placeholder="Ripeti la password"
          disabled={isLoading}
          hasError={!!getFieldError('confirmPassword')}
          errorMessage={getFieldError('confirmPassword')}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={styles.submitButton}
      >
        <span className={styles.buttonText}>
          {isLoading ? 'Registrazione in corso...' : 'Registrati'}
        </span>
        {!isLoading && (
          <span className={styles.buttonIcon}>
            <ArrowRight size={20} />
          </span>
        )}
      </button>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Hai già un account?{' '}
          <Link href={"/login" as unknown as UrlObject} className={styles.footerLink}>
            Accedi
          </Link>
        </p>
      </div>
    </form>
  );
};

