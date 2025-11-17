'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User, Save, Briefcase, Calendar } from 'react-feather';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Staff } from '@/features/smart-shifts/staff/types';
import { useNotificationStore } from '@/features/smart-shifts/common/stores/notification';
import styles from './profile.module.css';

export default function ProfilePage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const token = params.token as string;
  const { showNotification } = useNotificationStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Fetch staff data
  const { data: staff, isLoading, isError } = useQuery({
    queryKey: ['staffByToken', token],
    queryFn: async () => {
      const response = await axios.get<Staff>(
        `${process.env.NEXT_PUBLIC_API_URL}/staff/portal/${token}`
      );
      return response.data;
    },
    enabled: !!token,
  });

  // Initialize form data when staff data is loaded
  useEffect(() => {
    if (staff) {
      setFormData({
        firstName: staff.firstName || '',
        lastName: staff.lastName || '',
        email: staff.email || '',
        phone: staff.phone || '',
      });
    }
  }, [staff]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/staff/portal/${token}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffByToken', token] });
      showNotification({ message: 'Profilo aggiornato con successo', type: 'success' });
    },
    onError: () => {
      showNotification({ message: 'Errore durante l\'aggiornamento del profilo', type: 'error' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Caricamento...</p>
        </div>
      </div>
    );
  }

  if (isError || !staff) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h2>Errore</h2>
          <p>Impossibile caricare il profilo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Il Mio Profilo</h1>
        <p className={styles.subtitle}>
          Gestisci le tue informazioni personali
        </p>
      </div>

      <div className={styles.content}>
        {/* Personal Information Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <User size={20} />
            </div>
            <h2 className={styles.cardTitle}>Informazioni Personali</h2>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nome</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={styles.input}
                  placeholder="Il tuo nome"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cognome</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={styles.input}
                  placeholder="Il tuo cognome"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={styles.input}
                  placeholder="tua.email@esempio.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Telefono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={styles.input}
                  placeholder="+39 320 1234567"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className={styles.submitBtn}
            >
              <Save size={18} />
              {updateMutation.isPending ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
          </form>
        </div>

        {/* Contract Information Card (Read-only) */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <Briefcase size={20} />
            </div>
            <h2 className={styles.cardTitle}>Informazioni Contrattuali</h2>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Ruolo</span>
              <span className={styles.infoValue}>{staff.staffRole}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Tipo Contratto</span>
              <span className={styles.infoValue}>
                {staff.contractType.replace('_', ' ')}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Ore Settimanali</span>
              <span className={styles.infoValue}>{staff.weeklyHours}h</span>
            </div>
            {staff.ccnlLevel && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Livello CCNL</span>
                <span className={styles.infoValue}>{staff.ccnlLevel}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contract Dates Card (Read-only) */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <Calendar size={20} />
            </div>
            <h2 className={styles.cardTitle}>Date Contrattuali</h2>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Data Assunzione</span>
              <span className={styles.infoValue}>
                {new Date(staff.hireDate).toLocaleDateString('it-IT', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            {staff.endDate && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Data Fine Contratto</span>
                <span className={styles.infoValue}>
                  {new Date(staff.endDate).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
            {staff.birthDate && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Data di Nascita</span>
                <span className={styles.infoValue}>
                  {new Date(staff.birthDate).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

