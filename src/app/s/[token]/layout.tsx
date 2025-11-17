'use client';

import { useParams } from 'next/navigation';
import { StaffNavbar } from '@/features/smart-shifts/staff-portal/components/StaffNavbar';
import styles from './layout.module.css';

export default function StaffPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const token = params.token as string;

  return (
    <div className={styles.layout}>
      <StaffNavbar token={token} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}

