'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { UrlObject } from 'url';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ArrowLeft } from 'react-feather';
import { ForgotPasswordForm } from '@/features/smart-shifts/auth/components/ForgotPasswordForm';
import styles from './page.module.css';

export default function ForgotPasswordPage() {
  const [showReveal, setShowReveal] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setShowReveal(false);
      },
    });

    tl.to(`.${styles.revealLeft}`, {
      x: '-100%',
      duration: 0.8,
      ease: 'power3.inOut',
    })
      .to(
        `.${styles.revealRight}`,
        {
          x: '100%',
          duration: 0.8,
          ease: 'power3.inOut',
        },
        '<'
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      {showReveal && (
        <div className={styles.pageReveal}>
          <div className={styles.revealLeft}></div>
          <div className={styles.revealRight}></div>
        </div>
      )}

      <div className={styles.container} data-section="white">
        <div className={styles.content}>
          <Link href={"/login" as unknown as UrlObject} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Torna al login</span>
          </Link>

          <div className={styles.logoWrapper}>
            <Image
              src="/full_logo_black.svg"
              alt="Ristowai"
              width={140}
              height={54}
              priority
            />
          </div>

          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>Password dimenticata?</h1>
              <p className={styles.subtitle}>
                Inserisci il tuo indirizzo email e ti invieremo un link per reimpostare la password.
              </p>
            </div>

            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </>
  );
}
