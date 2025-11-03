'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { Check, X, Loader } from 'react-feather';
import styles from './page.module.css';
import { UrlObject } from 'url';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setTimeout(() => {
        setStatus('error');
        setMessage('Token di verifica mancante. Controlla il link nella tua email.');
      }, 0);
      return;
    }

    // Call the verification API
    const verifyEmail = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/password/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setStatus('success');
          setMessage('Email verificata con successo! Verrai reindirizzato al login...');
        } else {
          const data = await response.json();
          console.error('Verification error:', data);
          setStatus('error');
          setMessage(data.message || 'Errore durante la verifica dell\'email. Il token potrebbe essere scaduto o non valido.');
        }
      } catch (error) {
        console.error('Network error:', error);
        setStatus('error');
        setMessage('Errore di connessione. Riprova più tardi.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  // Countdown and redirect on success
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      void router.push('/login' as any);
    }
  }, [status, countdown, router]);

  return (
    <div className={styles.container} data-section="white">
      <div className={styles.content}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/full_logo_black.svg"
            alt="Ristowai"
            width={140}
            height={54}
            priority
          />
        </Link>

        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            {status === 'loading' && (
              <Loader className={styles.iconLoading} size={48} />
            )}
            {status === 'success' && (
              <Check className={styles.iconSuccess} size={48} />
            )}
            {status === 'error' && (
              <X className={styles.iconError} size={48} />
            )}
          </div>

          <h1 className={styles.title}>
            {status === 'loading' && 'Verifica in corso...'}
            {status === 'success' && 'Email verificata!'}
            {status === 'error' && 'Verifica fallita'}
          </h1>

          <p className={styles.message}>{message}</p>

          {status === 'success' && (
            <p className={styles.countdown}>
              Reindirizzamento in {countdown} second{countdown !== 1 ? 'i' : 'o'}...
            </p>
          )}

          {status === 'error' && (
            <div className={styles.actions}>
              <Link href="/register" className={styles.button}>
                Registrati di nuovo
              </Link>
              <Link href="/login" className={styles.buttonSecondary}>
                Vai al login
              </Link>
            </div>
          )}

          {status === 'success' && (
            <Link href="/login" className={styles.button}>
              Vai al login ora
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
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

      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </>
  );
}

