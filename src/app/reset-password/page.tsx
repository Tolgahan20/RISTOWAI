'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { UrlObject } from 'url';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ArrowLeft } from 'react-feather';
import { ResetPasswordForm } from '@/features/smart-shifts/auth/components/ResetPasswordForm';
import styles from './page.module.css';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [showReveal, setShowReveal] = useState(true);
  const token = searchParams.get('token');

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
              <h1 className={styles.title}>Reimposta password</h1>
              <p className={styles.subtitle}>
                Scegli una nuova password sicura per il tuo account.
              </p>
            </div>

            <ResetPasswordForm token={token} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
