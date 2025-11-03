'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import styles from './page.module.css';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.welcome}>Benvenuto su Ristowai! 🎉</p>
        
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Turni Oggi</h3>
            <p className={styles.number}>12</p>
          </div>
          <div className={styles.card}>
            <h3>Staff Attivo</h3>
            <p className={styles.number}>8</p>
          </div>
          <div className={styles.card}>
            <h3>Presenze</h3>
            <p className={styles.number}>6/8</p>
          </div>
          <div className={styles.card}>
            <h3>Richieste</h3>
            <p className={styles.number}>3</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
