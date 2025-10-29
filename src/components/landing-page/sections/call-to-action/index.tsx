'use client';
import styles from './call-to-action.module.css';
import { ArrowUpRight } from 'react-feather';
import Link from 'next/link';
import { UrlObject } from 'url';

export const CallToAction = () => {
  return (
    <section className={styles.section} data-section="white">
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <Link href={"/beta-test" as unknown as UrlObject} className={styles.panel}>
            <h2 className={styles.title}>INIZIA<br />GRATIS ORA</h2>
            <p className={styles.description}>
              Inizia oggi la tua prova gratuita di 1 mese
            </p>
            <div className={styles.iconWrapper}>
              <div className={styles.iconInner}>
                <ArrowUpRight className={styles.icon} size={24} />
                <ArrowUpRight className={styles.icon} size={24} />
              </div>
            </div>
          </Link>

          <Link href={"/about" as unknown as UrlObject} className={styles.panel}>
            <h2 className={styles.title}>CHI<br />SIAMO</h2>
            <p className={styles.description}>
              Scopri di più sul nostro percorso nel ridefinire il modo in cui il lavoro viene svolto.
            </p>
            <div className={styles.iconWrapper}>
              <div className={styles.iconInner}>
                <ArrowUpRight className={styles.icon} size={24} />
                <ArrowUpRight className={styles.icon} size={24} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
