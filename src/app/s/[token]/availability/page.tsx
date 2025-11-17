'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Save, Calendar } from 'react-feather';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Staff, Availability, DayOfWeek, PreferredShift } from '@/features/smart-shifts/staff/types';
import { DAYS_OF_WEEK, DAY_LABELS, PREFERRED_SHIFT_LABELS } from '@/features/smart-shifts/staff/types';
import styles from './availability.module.css';

export default function StaffAvailabilityPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const token = params.token as string;

  const [availabilityState, setAvailabilityState] = useState<Availability | null>(null);
  const [newDayOff, setNewDayOff] = useState({ date: '', reason: '' });

  // Fetch staff data
  const { data: staff, isLoading } = useQuery({
    queryKey: ['staffByToken', token],
    queryFn: async () => {
      const response = await axios.get<Staff>(
        `${process.env.NEXT_PUBLIC_API_URL}/staff/portal/${token}`
      );
      return response.data;
    },
    enabled: !!token,
  });

  // Use staff availability or local state
  const availability = availabilityState ?? staff?.availability ?? {};
  const setAvailability = setAvailabilityState;

  // Update availability mutation
  const updateMutation = useMutation({
    mutationFn: async (newAvailability: Availability) => {
      if (!staff) throw new Error('Staff data not loaded');
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/staff/${staff.venueId}/${staff.id}`,
        { availability: newAvailability }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffByToken', token] });
      alert('Preferenze salvate con successo!');
    },
    onError: () => {
      alert('Errore nel salvare le preferenze. Riprova.');
    },
  });

  const handleDayToggle = (day: DayOfWeek) => {
    setAvailability(prev => {
      const current = prev || {};
      return {
        ...current,
        [day]: {
          ...current[day],
          available: !current[day]?.available,
        },
      };
    });
  };

  const handlePreferredShiftChange = (day: DayOfWeek, shift: PreferredShift) => {
    setAvailability(prev => {
      const current = prev || {};
      return {
        ...current,
        [day]: {
          ...current[day],
          available: true,
          preferredShift: shift,
        },
      };
    });
  };

  const handleReasonChange = (day: DayOfWeek, reason: string) => {
    setAvailability(prev => {
      const current = prev || {};
      return {
        ...current,
        [day]: {
          ...current[day],
          reason,
        },
      };
    });
  };

  const handleAddDayOff = () => {
    if (!newDayOff.date || !newDayOff.reason) {
      alert('Inserisci sia la data che il motivo');
      return;
    }

    const currentDaysOff = availability.specificDaysOff || [];
    setAvailability(prev => {
      const current = prev || {};
      return {
        ...current,
        specificDaysOff: [...currentDaysOff, newDayOff],
      };
    });
    setNewDayOff({ date: '', reason: '' });
  };

  const handleRemoveDayOff = (index: number) => {
    setAvailability(prev => {
      const current = prev || {};
      return {
        ...current,
        specificDaysOff: current.specificDaysOff?.filter((_, i) => i !== index) || [],
      };
    });
  };

  const handleSave = () => {
    updateMutation.mutate(availability);
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Le Tue Preferenze</h1>
        <p className={styles.subtitle}>
          Indica quando preferisci lavorare per aiutare il manager a pianificare i turni.
        </p>
      </div>

      <div className={styles.content}>
        {/* Weekly Availability */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Disponibilità Settimanale</h2>
            <p className={styles.sectionHint}>Seleziona i giorni e gli orari in cui preferisci lavorare</p>
          </div>
          
          <div className={styles.daysGrid}>
            {DAYS_OF_WEEK.map((day) => {
              const dayData = availability[day];
              const isAvailable = dayData?.available !== false;
              
              return (
                <div key={day} className={`${styles.dayCard} ${!isAvailable ? styles.dayCardDisabled : ''}`}>
                  <div className={styles.dayCardHeader}>
                    <label className={styles.toggleLabel}>
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={() => handleDayToggle(day)}
                        className={styles.toggleInput}
                      />
                      <span className={styles.toggleSwitch}></span>
                      <span className={styles.dayName}>{DAY_LABELS[day]}</span>
                    </label>
                  </div>

                  {isAvailable && (
                    <div className={styles.dayCardBody}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Orario preferito</label>
                        <select
                          value={dayData?.preferredShift || 'any'}
                          onChange={(e) =>
                            handlePreferredShiftChange(day, e.target.value as PreferredShift)
                          }
                          className={styles.select}
                        >
                          {(Object.keys(PREFERRED_SHIFT_LABELS) as PreferredShift[]).map((shift) => (
                            <option key={shift} value={shift}>
                              {PREFERRED_SHIFT_LABELS[shift]}
                            </option>
                          ))}
                        </select>
                      </div>

                      {dayData?.preferredShift && dayData.preferredShift !== 'any' && (
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Motivo (opzionale)</label>
                          <input
                            type="text"
                            value={dayData?.reason || ''}
                            onChange={(e) => handleReasonChange(day, e.target.value)}
                            placeholder="es. lezioni università"
                            className={styles.input}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Specific Days Off */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Giorni Non Disponibile</h2>
            <p className={styles.sectionHint}>Date specifiche in cui non puoi lavorare</p>
          </div>

          <div className={styles.addCard}>
            <div className={styles.addForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Data</label>
                <input
                  type="date"
                  value={newDayOff.date}
                  onChange={(e) => setNewDayOff({ ...newDayOff, date: e.target.value })}
                  className={styles.input}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Motivo</label>
                <input
                  type="text"
                  value={newDayOff.reason}
                  onChange={(e) => setNewDayOff({ ...newDayOff, reason: e.target.value })}
                  placeholder="Esame, visita medica..."
                  className={styles.input}
                />
              </div>
              <button onClick={handleAddDayOff} className={styles.addBtn}>
                <Calendar size={18} />
                Aggiungi
              </button>
            </div>
          </div>

          {availability.specificDaysOff && availability.specificDaysOff.length > 0 && (
            <div className={styles.daysOffList}>
              {availability.specificDaysOff.map((dayOff, index) => (
                <div key={index} className={styles.dayOffCard}>
                  <div className={styles.dayOffIcon}>
                    <Calendar size={20} />
                  </div>
                  <div className={styles.dayOffContent}>
                    <div className={styles.dayOffDate}>
                      {new Date(dayOff.date).toLocaleDateString('it-IT', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <div className={styles.dayOffReason}>{dayOff.reason}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveDayOff(index)}
                    className={styles.removeBtn}
                    title="Rimuovi"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Save Button */}
      <div className={styles.fixedFooter}>
        <div className={styles.footerContent}>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className={styles.saveBtn}
          >
            <Save size={18} />
            {updateMutation.isPending ? 'Salvataggio...' : 'Salva Preferenze'}
          </button>
        </div>
      </div>
    </div>
  );
}

