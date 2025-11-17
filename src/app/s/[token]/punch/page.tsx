'use client';

import { useParams } from 'next/navigation';
import { Clock, LogIn, LogOut, CheckCircle, AlertCircle } from 'react-feather';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNotificationStore } from '@/features/smart-shifts/common/stores/notification';
import styles from './punch.module.css';

interface TodayShift {
  id: string;
  startTime: string;
  endTime: string;
  phaseName: string;
  role: string;
  status: 'NOT_STARTED' | 'CLOCKED_IN' | 'CLOCKED_OUT';
  clockInTime?: string;
  clockOutTime?: string;
}

export default function PunchClockPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const token = params.token as string;
  const { showNotification } = useNotificationStore();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // Fetch today's shifts
  const { data: shiftsData, isLoading } = useQuery({
    queryKey: ['staff', token, 'punch', 'today'],
    queryFn: async () => {
      const response = await axios.get<{ upcomingShifts: TodayShift[] }>(
        `${apiUrl}/staff/portal/${token}/punch/today`
      );
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Clock in mutation
  const clockInMutation = useMutation({
    mutationFn: async (shiftId: string) => {
      const response = await axios.post(
        `${apiUrl}/staff/portal/${token}/punch/clock-in`,
        { shiftId }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', token, 'punch'] });
      showNotification({
        type: 'success',
        message: 'Timbrata entrata registrata',
      });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Errore durante la timbrata'
        : 'Errore durante la timbrata';
      showNotification({
        type: 'error',
        message,
      });
    },
  });

  // Clock out mutation
  const clockOutMutation = useMutation({
    mutationFn: async (shiftId: string) => {
      const response = await axios.post(
        `${apiUrl}/staff/portal/${token}/punch/clock-out`,
        { shiftId }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', token, 'punch'] });
      showNotification({
        type: 'success',
        message: 'Timbrata uscita registrata',
      });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Errore durante la timbrata'
        : 'Errore durante la timbrata';
      showNotification({
        type: 'error',
        message,
      });
    },
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CLOCKED_IN':
        return { text: 'In servizio', className: styles.statusActive, icon: CheckCircle };
      case 'CLOCKED_OUT':
        return { text: 'Completato', className: styles.statusCompleted, icon: CheckCircle };
      default:
        return { text: 'Non iniziato', className: styles.statusPending, icon: AlertCircle };
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Clock className={styles.loadingIcon} />
          <p>Caricamento turni...</p>
        </div>
      </div>
    );
  }

  const shifts = shiftsData?.upcomingShifts || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Clock size={32} />
        </div>
        <div>
          <h1 className={styles.title}>Timbratura</h1>
          <p className={styles.subtitle}>
            {new Date().toLocaleDateString('it-IT', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {shifts.length === 0 ? (
          <div className={styles.emptyState}>
            <Clock size={64} className={styles.emptyIcon} />
            <h2>Nessun Turno Oggi</h2>
            <p>Non hai turni programmati per oggi</p>
          </div>
        ) : (
          <div className={styles.shiftsGrid}>
            {shifts.map((shift) => {
              const statusInfo = getStatusBadge(shift.status);
              const StatusIcon = statusInfo.icon;
              const canClockIn = shift.status === 'NOT_STARTED';
              const canClockOut = shift.status === 'CLOCKED_IN';

              return (
                <div key={shift.id} className={styles.shiftCard}>
                  <div className={styles.shiftHeader}>
                    <div className={styles.shiftInfo}>
                      <h3 className={styles.phaseName}>{shift.phaseName}</h3>
                      <p className={styles.roleLabel}>{shift.role}</p>
                    </div>
                    <div className={`${styles.statusBadge} ${statusInfo.className}`}>
                      <StatusIcon size={16} />
                      <span>{statusInfo.text}</span>
                    </div>
                  </div>

                  <div className={styles.shiftDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Orario Previsto:</span>
                      <span className={styles.detailValue}>
                        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                      </span>
                    </div>

                    {shift.clockInTime && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Entrata:</span>
                        <span className={styles.detailValue}>
                          {formatTime(shift.clockInTime)}
                        </span>
                      </div>
                    )}

                    {shift.clockOutTime && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Uscita:</span>
                        <span className={styles.detailValue}>
                          {formatTime(shift.clockOutTime)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={styles.shiftActions}>
                    {canClockIn && (
                      <button
                        className={`${styles.actionBtn} ${styles.clockInBtn}`}
                        onClick={() => clockInMutation.mutate(shift.id)}
                        disabled={clockInMutation.isPending}
                      >
                        <LogIn size={18} />
                        {clockInMutation.isPending ? 'Registrazione...' : 'Timbra Entrata'}
                      </button>
                    )}

                    {canClockOut && (
                      <button
                        className={`${styles.actionBtn} ${styles.clockOutBtn}`}
                        onClick={() => clockOutMutation.mutate(shift.id)}
                        disabled={clockOutMutation.isPending}
                      >
                        <LogOut size={18} />
                        {clockOutMutation.isPending ? 'Registrazione...' : 'Timbra Uscita'}
                      </button>
                    )}

                    {shift.status === 'CLOCKED_OUT' && (
                      <div className={styles.completedMessage}>
                        <CheckCircle size={18} />
                        <span>Turno completato</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
