'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import styles from './pagination.module.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        Mostrando {startItem}-{endItem} di {totalItems}
      </div>

      <div className={styles.controls}>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className={styles.select}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} per pagina
            </option>
          ))}
        </select>

        <div className={styles.buttons}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.button}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          <span className={styles.pageInfo}>
            Pagina {currentPage} di {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.button}
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

