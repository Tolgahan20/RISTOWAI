'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/dashboard/layout';
import { LoadingState } from '@/components/dashboard/ui';
import {
  useProfile,
  useUpdateProfile,
  useChangePassword,
  useChangeEmail,
  useProfileForm,
  usePasswordForm,
  useEmailForm,
} from '@/features/auth/hooks/profile';
import { User, Lock, Mail, Save, X } from 'react-feather';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const changeEmailMutation = useChangeEmail();

  const [activeSection, setActiveSection] = useState<'profile' | 'password' | 'email'>('profile');

  const profileForm = useProfileForm(profile);
  const passwordForm = usePasswordForm();
  const emailForm = useEmailForm(profile?.email);

  const handleUpdateProfile = async () => {
    if (!profileForm.hasChanges()) return;
    
    await updateProfileMutation.mutateAsync({
      firstName: profileForm.formData.firstName,
      lastName: profileForm.formData.lastName,
    });
  };

  const handleChangePassword = async () => {
    if (!passwordForm.validateForm()) return;
    
    await changePasswordMutation.mutateAsync({
      currentPassword: passwordForm.formData.currentPassword,
      newPassword: passwordForm.formData.newPassword,
    });
    
    passwordForm.resetForm();
  };

  const handleChangeEmail = async () => {
    if (!emailForm.validateForm()) return;
    if (!emailForm.hasChanges()) return;
    
    await changeEmailMutation.mutateAsync({
      email: emailForm.formData.email,
      currentPassword: emailForm.formData.currentPassword,
    });
    
    emailForm.resetForm();
  };

  if (isLoading) {
    return <LoadingState message="Caricamento profilo..." />;
  }

  if (!profile) {
    return (
      <div className={pageLayout.container}>
        <PageHeader title="Profilo" subtitle="Gestisci le tue informazioni personali" />
        <div className={styles.errorState}>Errore nel caricamento del profilo</div>
      </div>
    );
  }

  return (
    <div className={pageLayout.container}>
      <PageHeader title="Profilo" subtitle="Gestisci le tue informazioni personali" />

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeSection === 'profile' ? styles.activeTab : ''}`}
          onClick={() => setActiveSection('profile')}
        >
          <User size={18} />
          <span>Informazioni Personali</span>
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'password' ? styles.activeTab : ''}`}
          onClick={() => setActiveSection('password')}
        >
          <Lock size={18} />
          <span>Cambia Password</span>
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'email' ? styles.activeTab : ''}`}
          onClick={() => setActiveSection('email')}
        >
          <Mail size={18} />
          <span>Cambia Email</span>
        </button>
      </div>

      {/* Profile Section */}
      {activeSection === 'profile' && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Informazioni Personali</h3>
            <p className={styles.sectionDescription}>
              Aggiorna il tuo nome e cognome
            </p>
          </div>

          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.label}>
                Nome
              </label>
              <input
                id="firstName"
                type="text"
                value={profileForm.formData.firstName}
                onChange={(e) => profileForm.updateField('firstName', e.target.value)}
                className={styles.input}
                placeholder="Inserisci il tuo nome"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.label}>
                Cognome
              </label>
              <input
                id="lastName"
                type="text"
                value={profileForm.formData.lastName}
                onChange={(e) => profileForm.updateField('lastName', e.target.value)}
                className={styles.input}
                placeholder="Inserisci il tuo cognome"
              />
            </div>

            <div className={styles.formActions}>
              <button
                onClick={profileForm.resetForm}
                disabled={!profileForm.hasChanges() || updateProfileMutation.isPending}
                className={styles.cancelButton}
              >
                <X size={18} />
                Annulla
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={!profileForm.hasChanges() || updateProfileMutation.isPending}
                className={styles.saveButton}
              >
                <Save size={18} />
                {updateProfileMutation.isPending ? 'Salvataggio...' : 'Salva Modifiche'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Section */}
      {activeSection === 'password' && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Cambia Password</h3>
            <p className={styles.sectionDescription}>
              Aggiorna la tua password per mantenere il tuo account sicuro
            </p>
          </div>

          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword" className={styles.label}>
                Password Attuale
              </label>
              <input
                id="currentPassword"
                type="password"
                value={passwordForm.formData.currentPassword}
                onChange={(e) => passwordForm.updateField('currentPassword', e.target.value)}
                className={`${styles.input} ${passwordForm.errors.currentPassword ? styles.inputError : ''}`}
                placeholder="Inserisci la password attuale"
              />
              {passwordForm.errors.currentPassword && (
                <span className={styles.errorText}>{passwordForm.errors.currentPassword}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword" className={styles.label}>
                Nuova Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={passwordForm.formData.newPassword}
                onChange={(e) => passwordForm.updateField('newPassword', e.target.value)}
                className={`${styles.input} ${passwordForm.errors.newPassword ? styles.inputError : ''}`}
                placeholder="Inserisci la nuova password (min. 8 caratteri)"
              />
              {passwordForm.errors.newPassword && (
                <span className={styles.errorText}>{passwordForm.errors.newPassword}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Conferma Nuova Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={passwordForm.formData.confirmPassword}
                onChange={(e) => passwordForm.updateField('confirmPassword', e.target.value)}
                className={`${styles.input} ${passwordForm.errors.confirmPassword ? styles.inputError : ''}`}
                placeholder="Conferma la nuova password"
              />
              {passwordForm.errors.confirmPassword && (
                <span className={styles.errorText}>{passwordForm.errors.confirmPassword}</span>
              )}
            </div>

            <div className={styles.formActions}>
              <button
                onClick={passwordForm.resetForm}
                disabled={changePasswordMutation.isPending}
                className={styles.cancelButton}
              >
                <X size={18} />
                Annulla
              </button>
              <button
                onClick={handleChangePassword}
                disabled={changePasswordMutation.isPending}
                className={styles.saveButton}
              >
                <Save size={18} />
                {changePasswordMutation.isPending ? 'Cambiamento...' : 'Cambia Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Section */}
      {activeSection === 'email' && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Cambia Email</h3>
            <p className={styles.sectionDescription}>
              Aggiorna il tuo indirizzo email. Riceverai un&apos;email di verifica al nuovo indirizzo.
            </p>
          </div>

          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Nuovo Indirizzo Email
              </label>
              <input
                id="email"
                type="email"
                value={emailForm.formData.email}
                onChange={(e) => emailForm.updateField('email', e.target.value)}
                className={`${styles.input} ${emailForm.errors.email ? styles.inputError : ''}`}
                placeholder="Inserisci il nuovo indirizzo email"
              />
              {emailForm.errors.email && (
                <span className={styles.errorText}>{emailForm.errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="emailPassword" className={styles.label}>
                Password Attuale
              </label>
              <input
                id="emailPassword"
                type="password"
                value={emailForm.formData.currentPassword}
                onChange={(e) => emailForm.updateField('currentPassword', e.target.value)}
                className={`${styles.input} ${emailForm.errors.currentPassword ? styles.inputError : ''}`}
                placeholder="Inserisci la password per conferma"
              />
              {emailForm.errors.currentPassword && (
                <span className={styles.errorText}>{emailForm.errors.currentPassword}</span>
              )}
            </div>

            <div className={styles.formActions}>
              <button
                onClick={emailForm.resetForm}
                disabled={!emailForm.hasChanges() || changeEmailMutation.isPending}
                className={styles.cancelButton}
              >
                <X size={18} />
                Annulla
              </button>
              <button
                onClick={handleChangeEmail}
                disabled={!emailForm.hasChanges() || changeEmailMutation.isPending}
                className={styles.saveButton}
              >
                <Save size={18} />
                {changeEmailMutation.isPending ? 'Cambiamento...' : 'Cambia Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

