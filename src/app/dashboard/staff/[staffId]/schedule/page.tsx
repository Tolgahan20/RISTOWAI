'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'react-feather';
import { Button } from '@/components/dashboard/ui/Button';
import { StaffScheduleView } from '@/features/smart-shifts/schedules/components/StaffScheduleView';
import styles from './schedule.module.css';

export default function StaffSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.staffId as string;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="ghost" onClick={() => router.back()} className={styles.backButton}>
          <ArrowLeft size={18} />
          Indietro
        </Button>
        <h1 className={styles.title}>Turni Dipendente</h1>
      </div>

      <StaffScheduleView staffId={staffId} />
    </div>
  );
}

