'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Save, RefreshCw } from 'react-feather';
import { useBalancePolicy, useBalancePolicyMutations } from '../../hooks/useTimeBank';
import { LoadingState, ErrorState } from '@/components/dashboard/ui';
import { Button } from '@/components/dashboard/ui/Button';
import { Input } from '@/components/dashboard/ui/Input';
import styles from './balance-policy-form.module.css';

interface BalancePolicyFormProps {
  venueId: string;
}

export const BalancePolicyForm: React.FC<BalancePolicyFormProps> = ({ venueId }) => {
  const { data: policy, isLoading, error, refetch } = useBalancePolicy(venueId);
  const { createPolicy, updatePolicy } = useBalancePolicyMutations();

  const [formData, setFormData] = useState({
    hoursPerDayContract: 6,
    vacationAccrualHoursPerMonth: 14.0,
    rolAccrualHoursPerMonth: 4.0,
    carryoverCapVacationHours: 0,
    carryoverCapRolHours: 0,
    projectionExpiryMonth: 12,
  });

  useEffect(() => {
    if (policy) {
      setTimeout(() => {
        setFormData({
        hoursPerDayContract: policy.hoursPerDayContract,
        vacationAccrualHoursPerMonth: policy.vacationAccrualHoursPerMonth,
        rolAccrualHoursPerMonth: policy.rolAccrualHoursPerMonth,
        carryoverCapVacationHours: policy.carryoverCapVacationHours || 0,
        carryoverCapRolHours: policy.carryoverCapRolHours || 0,
        projectionExpiryMonth: policy.projectionExpiryMonth || 12,
      });
    }, 100);
    }
  }, [policy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      carryoverCapVacationHours: formData.carryoverCapVacationHours || undefined,
      carryoverCapRolHours: formData.carryoverCapRolHours || undefined,
      projectionExpiryMonth: formData.projectionExpiryMonth || undefined,
    };

    try {
      if (policy) {
        await updatePolicy.mutateAsync({ id: policy.id, data });
      } else {
        await createPolicy.mutateAsync({ venueId, ...data });
      }
      refetch();
    } catch (error) {
      console.error('Failed to save policy:', error);
    }
  };

  const updateField = (field: keyof typeof formData, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return <LoadingState message="Caricamento policy..." />;
  }

  if (error) {
    return <ErrorState message="Errore nel caricamento della policy" />;
  }

  const isSubmitting = createPolicy.isPending || updatePolicy.isPending;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Configurazione Banca Ore</h2>
          <p className={styles.subtitle}>
            Imposta parametri per il calcolo visivo dei saldi ferie, ROL e banca ore
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className={styles.refreshButton}
          disabled={isSubmitting}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className={styles.disclaimer}>
        <AlertCircle size={16} />
        <p>
          <strong>Attenzione:</strong> Questi parametri sono puramente informativi per il tracking visivo.
          Non hanno valore legale o contabile. La riconciliazione formale con CCNL sarà disponibile in versione futura.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Configuration */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Parametri Base</h3>

          <div className={styles.field}>
            <label className={styles.label}>
              Ore per giorno contratto
              <span className={styles.required}>*</span>
            </label>
            <Input
              type="number"
              min="1"
              max="12"
              step="0.5"
              value={formData.hoursPerDayContract}
              onChange={(e) => updateField('hoursPerDayContract', parseFloat(e.target.value))}
              required
            />
            <span className={styles.fieldHint}>
              Ore contrattuali per giorno lavorativo (es. 6, 8)
            </span>
          </div>
        </div>

        {/* Accrual Configuration */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Maturazione Mensile</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>
                Ferie (ore/mese)
                <span className={styles.required}>*</span>
              </label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={formData.vacationAccrualHoursPerMonth}
                onChange={(e) => updateField('vacationAccrualHoursPerMonth', parseFloat(e.target.value))}
                required
              />
              <span className={styles.fieldHint}>
                Ore di ferie maturate ogni mese (es. 14.0)
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                ROL (ore/mese)
                <span className={styles.required}>*</span>
              </label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={formData.rolAccrualHoursPerMonth}
                onChange={(e) => updateField('rolAccrualHoursPerMonth', parseFloat(e.target.value))}
                required
              />
              <span className={styles.fieldHint}>
                Ore di ROL maturate ogni mese (es. 4.0)
              </span>
            </div>
          </div>
        </div>

        {/* Carryover Caps */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Limiti di Riporto (Opzionale)</h3>
          <p className={styles.sectionDescription}>
            Imposta limiti massimi per il riporto all&apos;anno successivo. Lascia a 0 per nessun limite.
          </p>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Limite Ferie (ore)</label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={formData.carryoverCapVacationHours}
                onChange={(e) => updateField('carryoverCapVacationHours', parseFloat(e.target.value) || 0)}
              />
              <span className={styles.fieldHint}>
                Ore massime riportabili (es. 80). 0 = nessun limite.
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Limite ROL (ore)</label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={formData.carryoverCapRolHours}
                onChange={(e) => updateField('carryoverCapRolHours', parseFloat(e.target.value) || 0)}
              />
              <span className={styles.fieldHint}>
                Ore massime riportabili (es. 32). 0 = nessun limite.
              </span>
            </div>
          </div>
        </div>

        {/* Projection Settings */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Proiezione Fine Anno</h3>

          <div className={styles.field}>
            <label className={styles.label}>Mese di scadenza</label>
            <Input
              type="number"
              min="1"
              max="12"
              value={formData.projectionExpiryMonth}
              onChange={(e) => updateField('projectionExpiryMonth', parseInt(e.target.value) || 12)}
            />
            <span className={styles.fieldHint}>
              Mese di scadenza per le proiezioni (1-12, default: 12 = Dicembre)
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            <Save size={16} />
            {isSubmitting ? 'Salvataggio...' : policy ? 'Aggiorna Policy' : 'Crea Policy'}
          </Button>
        </div>
      </form>

      {policy && (
        <div className={styles.metadata}>
          <p className={styles.metadataText}>
            Ultima modifica: {new Date(policy.updatedAt).toLocaleString('it-IT')}
          </p>
        </div>
      )}
    </div>
  );
};

