import { useState } from 'react';
import { Calendar, Users, DollarSign, Clock, ChevronDown, ChevronUp } from 'react-feather';
import styles from './week-overview.module.css';

interface WeekSummary {
  coverageAvg: number;
  staffAvailable: number;
  staffTotal: number;
  costEstimate: number;
  hoursPlanned: number;
}

interface WeekDay {
  date: string;
  dayName: string;
  dayNumber: number;
  coverage: number;
  phasesCount: number;
}

interface WeekOverviewProps {
  summary: WeekSummary;
  weekDetails: WeekDay[];
}

export const WeekOverview: React.FC<WeekOverviewProps> = ({ summary, weekDetails }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getCoverageStatus = (coverage: number) => {
    if (coverage >= 90) return 'good';
    if (coverage >= 70) return 'warning';
    return 'bad';
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Questa Settimana</h2>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={`${styles.card} ${styles[getCoverageStatus(summary.coverageAvg)]}`}>
          <div className={styles.icon}>
            <Calendar size={20} />
          </div>
          <div className={styles.content}>
            <div className={styles.label}>Copertura</div>
            <div className={styles.value}>{summary.coverageAvg}%</div>
          </div>
        </div>

        <div className={`${styles.card} ${styles.neutral}`}>
          <div className={styles.icon}>
            <Users size={20} />
          </div>
          <div className={styles.content}>
            <div className={styles.label}>Staff Disponibile</div>
            <div className={styles.value}>{summary.staffAvailable}/{summary.staffTotal}</div>
          </div>
        </div>

        <div className={`${styles.card} ${styles.neutral}`}>
          <div className={styles.icon}>
            <DollarSign size={20} />
          </div>
          <div className={styles.content}>
            <div className={styles.label}>Costo Stimato</div>
            <div className={styles.value}>€{(summary.costEstimate / 1000).toFixed(1)}k</div>
          </div>
        </div>

        <div className={`${styles.card} ${styles.neutral}`}>
          <div className={styles.icon}>
            <Clock size={20} />
          </div>
          <div className={styles.content}>
            <div className={styles.label}>Ore Pianificate</div>
            <div className={styles.value}>{summary.hoursPlanned}h</div>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <button 
        className={styles.expandBtn}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Nascondi Dettagli' : 'Vedi Dettagli Giornalieri'}
        {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {showDetails && (
        <div className={styles.detailsGrid}>
          {weekDetails.map((day) => (
            <div 
              key={day.date}
              className={`${styles.dayCard} ${styles[getCoverageStatus(day.coverage)]}`}
            >
              <div className={styles.dayHeader}>
                <div className={styles.dayName}>{day.dayName}</div>
                <div className={styles.dayNumber}>{day.dayNumber}</div>
              </div>
              <div className={styles.dayCoverage}>{day.coverage}%</div>
              <div className={styles.dayPhases}>{day.phasesCount} fasi</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

