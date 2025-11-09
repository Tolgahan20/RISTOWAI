"use client";

import { useState } from "react";
import { Input, Select, Button } from "@/components/dashboard/ui";
import { LoadingState } from "@/components/dashboard/ui";
import { CheckCircle } from "react-feather";
import type { PhaseType, WorkPhasesData } from "../../types";
import { useWorkPhasesStep } from "../../hooks/useWorkPhasesStep";
import { usePhasePresets } from "@/features/smart-shifts/phases/hooks";
import styles from "./work-phases-step.module.css";

interface WorkPhasesStepProps {
  onSave: (data: WorkPhasesData) => Promise<void>;
  isSaving: boolean;
  initialData?: WorkPhasesData | null;
}

export function WorkPhasesStep({
  onSave,
  isSaving,
  initialData,
}: WorkPhasesStepProps) {
  const {
    phases,
    editingPhase,
    setEditingPhase,
    handleAddPhase,
    handleRemovePhase,
    handleSubmit,
  } = useWorkPhasesStep({ onSave, initialData });

  const {
    industries,
    industriesLoading,
    templates,
    templatesLoading,
    selectedIndustry,
    setSelectedIndustry,
  } = usePhasePresets();

  const [showManualEntry, setShowManualEntry] = useState(false);

  // Templates are shown separately, user proceeds with them directly

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Fasi di Lavoro</h1>
        <p className={styles.description}>
          Seleziona il tipo di locale per caricare fasi pre-configurate, oppure
          creale manualmente.
        </p>

        {/* Industry Selection */}
        {!industriesLoading && industries && (
          <div className={styles.industrySection}>
            <label className={styles.industryLabel}>
              Tipo di Locale (Opzionale)
            </label>
            <Select
              value={selectedIndustry || ""}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="">Seleziona un tipo o crea manualmente</option>
              {industries.map((industry) => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Loading Templates */}
        {templatesLoading && (
          <div className={styles.loadingSection}>
            <LoadingState message="Caricamento template..." />
          </div>
        )}

        {/* Industry Templates Preview */}
        {selectedIndustry &&
          templates &&
          templates.length > 0 &&
          !templatesLoading && (
            <div className={styles.templatesPreview}>
              <h3 className={styles.templatesTitle}>
                Fasi suggerite ({templates.length}):
              </h3>
              <p className={styles.templatesDescription}>
                Queste fasi verranno create automaticamente quando procedi. Puoi
                modificarle dopo.
              </p>
              <div className={styles.templatesList}>
                {templates.map((template, index) => (
                  <div key={index} className={styles.templateCard}>
                    <div className={styles.templateHeader}>
                      <CheckCircle size={16} className={styles.checkIcon} />
                      <span className={styles.templateName}>
                        {template.name}
                      </span>
                      <span
                        className={`${styles.templateType} ${
                          template.type === "HARD" ? styles.hard : styles.soft
                        }`}
                      >
                        {template.type === "HARD"
                          ? "Obbligatoria"
                          : "Flessibile"}
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

        {/* Manual Phase Entry */}
        {(!selectedIndustry || showManualEntry) && (
          <>
            <div className={styles.addPhaseSection}>
              <p className={styles.manualLabel}>Aggiungi Fase Manualmente:</p>
              <div className={styles.formRow}>
                <Input
                  type="text"
                  placeholder="Nome fase (es. Pranzo)"
                  value={editingPhase.name || ""}
                  onChange={(e) =>
                    setEditingPhase({ ...editingPhase, name: e.target.value })
                  }
                />
                <Input
                  type="time"
                  placeholder="Inizio"
                  value={editingPhase.startTime || ""}
                  onChange={(e) =>
                    setEditingPhase({
                      ...editingPhase,
                      startTime: e.target.value,
                    })
                  }
                />
                <Input
                  type="time"
                  placeholder="Fine"
                  value={editingPhase.endTime || ""}
                  onChange={(e) =>
                    setEditingPhase({
                      ...editingPhase,
                      endTime: e.target.value,
                    })
                  }
                />
                <Select
                  value={editingPhase.type || "HARD"}
                  onChange={(e) =>
                    setEditingPhase({
                      ...editingPhase,
                      type: e.target.value as PhaseType,
                    })
                  }
                >
                  <option value="HARD">Obbligatoria</option>
                  <option value="SOFT">Flessibile</option>
                </Select>
                <button
                  type="button"
                  onClick={handleAddPhase}
                  className={styles.addButton}
                  disabled={
                    !editingPhase.name ||
                    !editingPhase.startTime ||
                    !editingPhase.endTime
                  }
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Manually Added Phases List */}
            {phases.length > 0 && (
              <div className={styles.phasesList}>
                <p className={styles.phasesLabel}>
                  Fasi manuali aggiunte ({phases.length}):
                </p>
                <div className={styles.phasesGrid}>
                  {phases.map((phase, index) => (
                    <div key={index} className={styles.phaseCard}>
                      <div className={styles.phaseHeader}>
                        <h3 className={styles.phaseName}>{phase.name}</h3>
                        <span
                          className={`${styles.phaseType} ${
                            styles[phase.type.toLowerCase()]
                          }`}
                        >
                          {phase.type === "HARD"
                            ? "Obbligatoria"
                            : "Flessibile"}
                        </span>
                      </div>
                      <div className={styles.phaseTime}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {phase.startTime} - {phase.endTime}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePhase(index)}
                        className={styles.removeButton}
                      >
                        Rimuovi
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {selectedIndustry && !showManualEntry && (
          <button
            type="button"
            onClick={() => setShowManualEntry(true)}
            className={styles.toggleManualButton}
          >
            + Aggiungi altre fasi manualmente
          </button>
        )}

        {/* Submit */}
        <form
          onSubmit={(e) => {
            // Convert templates to WorkPhase format if industry is selected
            const templatePhases =
              selectedIndustry && templates
                ? templates.map((template) => ({
                    name: template.name,
                    startTime: template.startTime,
                    endTime: template.endTime,
                    type: template.type as PhaseType,
                    roleRequirements: template.roleRequirements || [],
                    daysOfWeek: template.daysOfWeek,
                    priority: template.priority,
                  }))
                : undefined;

            handleSubmit(e, templatePhases);
          }}
        >
          <Button
            type="submit"
            disabled={Boolean(
              isSaving ||
                (!selectedIndustry && phases.length === 0) ||
                (selectedIndustry && !templates)
            )}
            size="large"
            fullWidth
          >
            {isSaving ? "Salvataggio..." : "Continua"}
          </Button>
          {!selectedIndustry && phases.length === 0 && (
            <p className={styles.error}>
              Seleziona un tipo di locale o aggiungi almeno una fase manualmente
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
