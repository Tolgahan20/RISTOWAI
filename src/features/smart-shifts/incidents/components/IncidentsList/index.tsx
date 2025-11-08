'use client';

import React, { useState } from 'react';
import { Incident, IncidentStatus, IncidentType, IncidentSeverity, PaginatedIncidentsQuery } from '../../types';
import { IncidentCard } from '../IncidentCard';
import { Filter, Search, AlertCircle } from 'react-feather';
import { getIncidentTypeLabel, getIncidentSeverityLabel, getIncidentStatusLabel } from '../../utils/incidentHelpers';
import styles from './incidents-list.module.css';

interface IncidentsListProps {
  incidents: Incident[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: Partial<PaginatedIncidentsQuery>) => void;
  onResolve?: (incident: Incident) => void;
  onClose?: (incident: Incident) => void;
  onEdit?: (incident: Incident) => void;
  onDelete?: (incident: Incident) => void;
  isLoading?: boolean;
}

export const IncidentsList: React.FC<IncidentsListProps> = ({
  incidents,
  total,
  page,
  limit,
  onPageChange,
  onFilterChange,
  onResolve,
  onClose,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus | ''>('');
  const [selectedType, setSelectedType] = useState<IncidentType | ''>('');
  const [selectedSeverity, setSelectedSeverity] = useState<IncidentSeverity | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onFilterChange({
      status: selectedStatus || undefined,
      incidentType: selectedType || undefined,
      severity: selectedSeverity || undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedType('');
    setSelectedSeverity('');
    onFilterChange({});
  };

  const totalPages = Math.ceil(total / limit);
  const hasActiveFilters = searchTerm || selectedStatus || selectedType || selectedSeverity;

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        <div className={styles.searchGroup}>
          <div className={styles.searchInput}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Cerca incidenti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className={styles.input}
            />
          </div>
          <button onClick={handleSearch} className={styles.searchButton}>
            Cerca
          </button>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`${styles.filterButton} ${showFilters ? styles.filterButtonActive : ''}`}
        >
          <Filter size={18} />
          Filtri
          {hasActiveFilters && <span className={styles.filterBadge}></span>}
        </button>
      </div>

      {showFilters && (
        <div className={styles.filterPanel}>
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label htmlFor="status" className={styles.filterLabel}>
                Stato
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as IncidentStatus | '')}
                className={styles.select}
              >
                <option value="">Tutti</option>
                {Object.values(IncidentStatus).map((status) => (
                  <option key={status} value={status}>
                    {getIncidentStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="type" className={styles.filterLabel}>
                Tipo
              </label>
              <select
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as IncidentType | '')}
                className={styles.select}
              >
                <option value="">Tutti</option>
                {Object.values(IncidentType).map((type) => (
                  <option key={type} value={type}>
                    {getIncidentTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="severity" className={styles.filterLabel}>
                Severità
              </label>
              <select
                id="severity"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value as IncidentSeverity | '')}
                className={styles.select}
              >
                <option value="">Tutte</option>
                {Object.values(IncidentSeverity).map((severity) => (
                  <option key={severity} value={severity}>
                    {getIncidentSeverityLabel(severity)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.filterActions}>
            <button onClick={handleClearFilters} className={styles.clearButton}>
              Cancella Filtri
            </button>
            <button onClick={handleSearch} className={styles.applyButton}>
              Applica Filtri
            </button>
          </div>
        </div>
      )}

      <div className={styles.resultsInfo}>
        <span className={styles.resultsCount}>
          {total} {total === 1 ? 'incidente' : 'incidenti'}
        </span>
      </div>

      {incidents.length === 0 && !isLoading && (
        <div className={styles.emptyState}>
          <AlertCircle size={48} />
          <h3>Nessun Incidente</h3>
          <p>Non ci sono incidenti registrati per i filtri selezionati.</p>
        </div>
      )}

      <div className={styles.list}>
        {incidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            onResolve={onResolve}
            onClose={onClose}
            onEdit={onEdit}
            onDelete={onDelete}
            isActionLoading={isLoading}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || isLoading}
            className={styles.paginationButton}
          >
            Precedente
          </button>

          <div className={styles.pageInfo}>
            Pagina {page} di {totalPages}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className={styles.paginationButton}
          >
            Successiva
          </button>
        </div>
      )}
    </div>
  );
};

