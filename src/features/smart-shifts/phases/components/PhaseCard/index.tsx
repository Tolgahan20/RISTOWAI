'use client';

import React from 'react';
import { Clock, Users, Calendar, Edit2, Trash2, AlertCircle } from 'react-feather';
import type { Phase } from '../../types';
import { PHASE_TYPE_LABELS, DAYS_OF_WEEK } from '../../types';
import styles from './phase-card.module.css';

interface PhaseCardProps {
  phase: Phase;
  onEdit: (phase: Phase) => void;
  onDelete: (phase: Phase) => void;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({ phase, onEdit, onDelete }) => {
  // Handle both number array [0,1,2] and string array ["monday", "tuesday"]
  const activeDays = phase.daysOfWeek && phase.daysOfWeek.length > 0
    ? phase.daysOfWeek
        .map(d => {
          if (typeof d === 'number') {
            return DAYS_OF_WEEK[d]?.short;
          }
          // Map string day names to numbers
          const dayMap: Record<string, number> = {
            sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
            thursday: 4, friday: 5, saturday: 6
          };
          const dayIndex = dayMap[d as string] as number;
          return DAYS_OF_WEEK[dayIndex]?.short;
        })
        .filter(Boolean)
        .join(', ')
    : 'Tutti i giorni';

  // Handle roleRequirements as either objects or strings
  const totalStaffNeeded = Array.isArray(phase.roleRequirements)
    ? phase.roleRequirements.reduce((sum, req) => {
        if (typeof req === 'object' && 'minStaff' in req) {
          return sum + req.minStaff;
        }
        return sum;
      }, 0)
    : 0;

  return (
    <div className={`${styles.card} ${!phase.isActive ? styles.inactive : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{phase.name}</h3>
          <span className={`${styles.typeBadge} ${styles[phase.type.toLowerCase()]}`}>
            {PHASE_TYPE_LABELS[phase.type]}
          </span>
        </div>
        {!phase.isActive && (
          <div className={styles.inactiveBanner}>
            <AlertCircle size={14} />
            <span>Non attiva</span>
          </div>
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <div className={styles.iconWrapper}>
            <Clock size={16} />
          </div>
          <span>{phase.startTime} - {phase.endTime}</span>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.iconWrapper}>
            <Calendar size={16} />
          </div>
          <span>{activeDays}</span>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.iconWrapper}>
            <Users size={16} />
          </div>
          <span>{totalStaffNeeded} staff richiesti</span>
        </div>
      </div>

      {phase.roleRequirements.length > 0 && (
        <div className={styles.roles}>
          <div className={styles.rolesTitle}>Requisiti:</div>
          <div className={styles.rolesList}>
            {phase.roleRequirements.map((req, idx) => {
              // Handle both object format and string format
              if (typeof req === 'string') {
                return (
                  <div key={idx} className={styles.roleItem}>
                    <span className={styles.roleName}>{req}</span>
                  </div>
                );
              }
              return (
                <div key={idx} className={styles.roleItem}>
                  <span className={styles.roleName}>{req.role}</span>
                  <span className={styles.roleCount}>
                    {req.minStaff}{req.maxStaff ? `-${req.maxStaff}` : '+'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {phase.notes && (
        <div className={styles.notes}>
          <span className={styles.notesLabel}>Note:</span>
          <span className={styles.notesText}>{phase.notes}</span>
        </div>
      )}

      <div className={styles.actions}>
        <button
          onClick={() => onEdit(phase)}
          className={`${styles.actionButton} ${styles.editButton}`}
        >
          <Edit2 size={16} />
          Modifica
        </button>
        <button
          onClick={() => onDelete(phase)}
          className={`${styles.actionButton} ${styles.deleteButton}`}
        >
          <Trash2 size={16} />
          Elimina
        </button>
      </div>
    </div>
  );
};

