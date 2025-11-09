'use client';

import React, { useState } from 'react';
import { X, CheckCircle } from 'react-feather';
import { Button } from '@/components/dashboard/ui/Button';
import { Select } from '@/components/dashboard/ui/Select';
import { LoadingState } from '@/components/dashboard/ui';
import { usePhasePresets } from '../../hooks';
import styles from './preset-modal.module.css';

interface PresetModalProps {
  venueId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PresetModal: React.FC<PresetModalProps> = ({
  venueId,
  isOpen,
  onClose,
}) => {
  const {
    industries,
    industriesLoading,
    templates,
    templatesLoading,
    selectedIndustry,
    setSelectedIndustry,
    applyPreset,
    isApplying,
  } = usePhasePresets(venueId);

  const [clearExisting, setClearExisting] = useState(false);

  if (!isOpen) return null;

  const handleApply = async () => {
    if (!selectedIndustry) return;
    await applyPreset(selectedIndustry, clearExisting);
    onClose();
    setSelectedIndustry(null);
    setClearExisting(false);
  };

  const handleClose = () => {
    onClose();
    setSelectedIndustry(null);
    setClearExisting(false);
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Carica Preset Industria</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            Seleziona il tipo di locale per caricare fasi pre-configurate ottimizzate
            per la tua attività.
          </p>

          {industriesLoading ? (
            <LoadingState message="Caricamento tipi di locale..." />
          ) : (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Tipo di Locale</label>
                <Select
                  value={selectedIndustry || ''}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  disabled={isApplying}
                >
                  <option value="">Seleziona un tipo</option>
                  {industries?.map((industry) => (
                    <option key={industry.value} value={industry.value}>
                      {industry.label}
                    </option>
                  ))}
                </Select>
              </div>

              {selectedIndustry && (
                <>
                  {templatesLoading ? (
                    <LoadingState message="Caricamento template..." />
                  ) : (
                    <div className={styles.preview}>
                      <h3 className={styles.previewTitle}>
                        Fasi da creare ({templates?.length || 0}):
                      </h3>
                      <div className={styles.templatesList}>
                        {templates?.map((template, index) => (
                          <div key={index} className={styles.templateCard}>
                            <div className={styles.templateHeader}>
                              <CheckCircle size={16} className={styles.checkIcon} />
                              <span className={styles.templateName}>
                                {template.name}
                              </span>
                              <span
                                className={`${styles.templateType} ${
                                  template.type === 'HARD'
                                    ? styles.hard
                                    : styles.soft
                                }`}
                              >
                                {template.type === 'HARD'
                                  ? 'Obbligatoria'
                                  : 'Flessibile'}
                              </span>
                            </div>
                            <div className={styles.templateTime}>
                              {template.startTime} - {template.endTime}
                            </div>
                            {template.notes && (
                              <div className={styles.templateNotes}>
                                {template.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={styles.checkbox}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={clearExisting}
                        onChange={(e) => setClearExisting(e.target.checked)}
                        disabled={isApplying}
                      />
                      <span>Cancella fasi esistenti prima di applicare il preset</span>
                    </label>
                    {clearExisting && (
                      <p className={styles.warning}>
                        ⚠️ Attenzione: Tutte le fasi esistenti verranno eliminate!
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className={styles.footer}>
          <Button variant="ghost" onClick={handleClose} disabled={isApplying}>
            Annulla
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={!selectedIndustry || isApplying}
          >
            {isApplying ? 'Applicazione...' : 'Applica Preset'}
          </Button>
        </div>
      </div>
    </div>
  );
};

