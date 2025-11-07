'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, Check, X, XCircle } from 'react-feather';
import { DataTable, TableFilters, Pagination, EmptyState, LoadingState, ErrorState } from '@/components/dashboard/ui';
import { ConfirmModal } from '@/components/dashboard/ui/ConfirmModal';
import { useRequestsList } from '../../hooks';
import { RequestStatus, RequestType, RequestPriority } from '../../types';
import { REQUEST_MESSAGES } from '../../../common/constants/messages';
import type { Request } from '../../types';
import type { Column } from '@/components/dashboard/ui/DataTable';
import type { FilterField } from '@/components/dashboard/ui/TableFilters';
import styles from './requests-list.module.css';

interface RequestsListProps {
  venueId: string;
  staffList: Array<{ id: string; name: string }>;
  onOpenModal: (request?: Request) => void;
}

const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: 'In Attesa',
  [RequestStatus.APPROVED]: 'Approvata',
  [RequestStatus.REJECTED]: 'Rifiutata',
  [RequestStatus.CANCELLED]: 'Annullata',
};

const REQUEST_STATUS_COLORS: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: '#F59E0B',
  [RequestStatus.APPROVED]: '#10B981',
  [RequestStatus.REJECTED]: '#EF4444',
  [RequestStatus.CANCELLED]: '#6B7280',
};

const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  [RequestType.TIME_OFF]: 'Permesso',
  [RequestType.SHIFT_SWAP]: 'Scambio Turno',
  [RequestType.SCHEDULE_CHANGE]: 'Modifica Orario',
  [RequestType.EXTRA_SHIFT]: 'Turno Extra',
  [RequestType.EARLY_LEAVE]: 'Uscita Anticipata',
  [RequestType.LATE_ARRIVAL]: 'Entrata Posticipata',
};

const PRIORITY_LABELS: Record<RequestPriority, string> = {
  [RequestPriority.LOW]: 'Bassa',
  [RequestPriority.NORMAL]: 'Normale',
  [RequestPriority.HIGH]: 'Alta',
  [RequestPriority.URGENT]: 'Urgente',
};

export const RequestsList: React.FC<RequestsListProps> = ({
  venueId,
  staffList,
  onOpenModal,
}) => {
  const {
    requests,
    isLoading,
    error,
    searchInput,
    selectedStaff,
    selectedStatus,
    selectedType,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    handleSearch,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handlePageSizeChange,
    actions,
  } = useRequestsList({ venueId });

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'delete' | 'approve' | 'reject' | 'cancel' | null;
    requestId: string | null;
  }>({ isOpen: false, action: null, requestId: null });

  const [reviewNotes, setReviewNotes] = useState('');

  if (isLoading) return <LoadingState message="Caricamento richieste..." />;
  if (error) return <ErrorState message={REQUEST_MESSAGES.load.error} />;

  const handleConfirmAction = () => {
    if (!confirmModal.requestId) return;

    switch (confirmModal.action) {
      case 'delete':
        actions.handleDelete(confirmModal.requestId);
        break;
      case 'approve':
        actions.handleApprove(confirmModal.requestId, { reviewerNotes: reviewNotes });
        break;
      case 'reject':
        actions.handleReject(confirmModal.requestId, { reviewerNotes: reviewNotes });
        break;
      case 'cancel':
        actions.handleCancel(confirmModal.requestId);
        break;
    }

    setConfirmModal({ isOpen: false, action: null, requestId: null });
    setReviewNotes('');
  };

  const openConfirmModal = (action: 'delete' | 'approve' | 'reject' | 'cancel', requestId: string) => {
    setConfirmModal({ isOpen: true, action, requestId });
  };

  const columns: Column<Request>[] = [
    {
      key: 'staffName',
      label: 'Dipendente',
      render: (request) => (
        <div className={styles.staffCell}>{request.staffName}</div>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (request) => (
        <span className={styles.typeCell}>
          {REQUEST_TYPE_LABELS[request.type]}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Stato',
      render: (request) => (
        <span
          className={styles.statusBadge}
          style={{ backgroundColor: REQUEST_STATUS_COLORS[request.status] }}
        >
          {REQUEST_STATUS_LABELS[request.status]}
        </span>
      ),
    },
    {
      key: 'priority',
      label: 'Priorità',
      render: (request) => (
        <span className={styles.priorityCell}>
          {PRIORITY_LABELS[request.priority]}
        </span>
      ),
    },
    {
      key: 'startDate',
      label: 'Periodo',
      render: (request) => (
        <div className={styles.dateCell}>
          {new Date(request.startDate).toLocaleDateString('it-IT')} -{' '}
          {new Date(request.endDate).toLocaleDateString('it-IT')}
        </div>
      ),
    },
    {
      key: 'durationDays',
      label: 'Giorni',
      render: (request) => (
        <div className={styles.daysCell}>{request.durationDays}</div>
      ),
    },
    {
      key: 'actions',
      label: 'Azioni',
      render: (request) => (
        <div className={styles.actions}>
          {request.status === RequestStatus.PENDING && (
            <>
              <button
                onClick={() => openConfirmModal('approve', request.id)}
                className={styles.actionButton}
                title="Approva"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => openConfirmModal('reject', request.id)}
                className={styles.actionButton}
                title="Rifiuta"
              >
                <X size={16} />
              </button>
            </>
          )}
          <button
            onClick={() => onOpenModal(request)}
            className={styles.actionButton}
            title="Modifica"
            disabled={request.status !== RequestStatus.PENDING}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => openConfirmModal('cancel', request.id)}
            className={styles.actionButton}
            title="Annulla"
            disabled={request.status !== RequestStatus.PENDING}
          >
            <XCircle size={16} />
          </button>
          <button
            onClick={() => openConfirmModal('delete', request.id)}
            className={styles.actionButton}
            title="Elimina"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const filters: FilterField[] = [
    {
      type: 'select',
      label: 'Dipendente',
      value: selectedStaff,
      onChange: (value) => handleFilterChange('staff', value),
      options: [
        { value: '', label: 'Tutti' },
        ...staffList.map((staff) => ({ value: staff.id, label: staff.name })),
      ],
    },
    {
      type: 'select',
      label: 'Stato',
      value: selectedStatus,
      onChange: (value) => handleFilterChange('status', value),
      options: [
        { value: '', label: 'Tutti' },
        ...Object.entries(REQUEST_STATUS_LABELS).map(([value, label]) => ({
          value,
          label,
        })),
      ],
    },
    {
      type: 'select',
      label: 'Tipo',
      value: selectedType,
      onChange: (value) => handleFilterChange('type', value),
      options: [
        { value: '', label: 'Tutti' },
        ...Object.entries(REQUEST_TYPE_LABELS).map(([value, label]) => ({
          value,
          label,
        })),
      ],
    },
  ];

  const hasActiveFilters = searchInput || selectedStaff || selectedStatus || selectedType;

  return (
    <>
      <div className={styles.container}>
        <TableFilters
          searchField={{
            type: 'search',
            label: 'Cerca',
            value: searchInput,
            onChange: (value) => handleSearch(value),
            placeholder: 'Cerca per dipendente, motivo...',
            onSearch: () => {},
          }}
          filters={filters}
          onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
        />

        {requests.length === 0 ? (
          <EmptyState
            title={REQUEST_MESSAGES.empty.title}
            description={REQUEST_MESSAGES.empty.description}
            action={
              hasActiveFilters
                ? {
                    label: 'Cancella Filtri',
                    onClick: handleClearFilters,
                  }
                : undefined
            }
          />
        ) : (
          <>
            <DataTable 
              columns={columns} 
              data={requests}
              keyExtractor={(request) => request.id}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>

      {confirmModal.isOpen && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={
            confirmModal.action === 'delete'
              ? 'Conferma Eliminazione'
              : confirmModal.action === 'approve'
                ? 'Conferma Approvazione'
                : confirmModal.action === 'reject'
                  ? 'Conferma Rifiuto'
                  : 'Conferma Annullamento'
          }
          message={
            confirmModal.action === 'delete'
              ? REQUEST_MESSAGES.delete.confirm
              : confirmModal.action === 'approve'
                ? REQUEST_MESSAGES.approve.confirm
                : confirmModal.action === 'reject'
                  ? REQUEST_MESSAGES.reject.confirm
                  : REQUEST_MESSAGES.cancel.confirm
          }
          confirmText={
            confirmModal.action === 'delete'
              ? 'Elimina'
              : confirmModal.action === 'approve'
                ? 'Approva'
                : confirmModal.action === 'reject'
                  ? 'Rifiuta'
                  : 'Annulla'
          }
          onConfirm={handleConfirmAction}
          onClose={() => {
            setConfirmModal({ isOpen: false, action: null, requestId: null });
            setReviewNotes('');
          }}
        />
      )}
    </>
  );
};

