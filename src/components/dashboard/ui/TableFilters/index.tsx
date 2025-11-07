'use client';

import React, { ReactNode } from 'react';
import { Search } from 'react-feather';
import { Button } from '../Button';
import styles from './table-filters.module.css';

export interface FilterField {
  type: 'select' | 'search' | 'custom';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  options?: Array<{ value: string; label: string }>;
  customRender?: () => ReactNode;
  minWidth?: string;
}

export interface TableFiltersProps {
  searchField?: FilterField;
  filters?: FilterField[];
  onClearFilters?: () => void;
  showClearButton?: boolean;
}

export function TableFilters({
  searchField,
  filters = [],
  onClearFilters,
  showClearButton = false,
}: TableFiltersProps) {
  return (
    <div className={styles.container}>
      <div className={styles.filtersRow}>
        {/* Search Field */}
        {searchField && (
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder={searchField.placeholder || 'Cerca...'}
              value={searchField.value}
              onChange={(e) => searchField.onChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchField.onSearch) {
                  searchField.onSearch();
                }
              }}
              className={styles.searchInput}
            />
          </div>
        )}

        {/* Filter Fields */}
        {filters.map((filter, index) => {
          if (filter.type === 'custom' && filter.customRender) {
            return <div key={index}>{filter.customRender()}</div>;
          }

          if (filter.type === 'select') {
            return (
              <div
                key={index}
                className={styles.filterGroup}
                style={{ minWidth: filter.minWidth || '180px' }}
              >
                {filter.label && (
                  <label className={styles.filterLabel}>{filter.label}</label>
                )}
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className={styles.select}
                >
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Clear Filters Button */}
      {showClearButton && onClearFilters && (
        <Button
          onClick={onClearFilters}
          variant="ghost"
          className={styles.clearButton}
        >
          Cancella Filtri
        </Button>
      )}
    </div>
  );
}

