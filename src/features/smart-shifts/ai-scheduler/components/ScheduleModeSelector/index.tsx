'use client';

import { TrendingUp, Shield, DollarSign, Edit, Check, Circle, IconProps } from 'react-feather';
import { ScheduleMode, type ScheduleModeOption } from '../../types';
import styles from './schedule-mode-selector.module.css';

interface ScheduleModeSelectorProps {
  selectedMode: ScheduleMode;
  onSelectMode: (mode: ScheduleMode) => void;
  options: ScheduleModeOption[];
}

const iconMap: Record<string, React.ComponentType<IconProps>> = {
  scale: TrendingUp,
  shield: Shield,
  'dollar-sign': DollarSign,
  edit: Edit,
};

export function ScheduleModeSelector({
  selectedMode,
  onSelectMode,
  options,
}: ScheduleModeSelectorProps) {
  return (
    <div className={styles.grid}>
      {options.map((option) => {
        const IconComponent = iconMap[option.icon] || Circle;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelectMode(option.value)}
            className={`${styles.modeCard} ${
              selectedMode === option.value ? styles.selected : ''
            }`}
          >
            <div className={styles.modeIcon}>
              <IconComponent size={24} />
            </div>
            <div className={styles.modeContent}>
              <div className={styles.modeLabel}>{option.label}</div>
              <div className={styles.modeDescription}>{option.description}</div>
            </div>
            {selectedMode === option.value && (
              <div className={styles.checkmark}>
                <Check size={16} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

