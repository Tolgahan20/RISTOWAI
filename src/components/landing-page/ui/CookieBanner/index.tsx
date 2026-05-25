'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UrlObject } from 'url';
import styles from './cookie-banner.module.css';

const COOKIE_CONSENT_KEY = 'ristowai_cookie_consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className={styles.overlay} />
      <div className={styles.banner}>
        <div className={styles.container}>
          <p className={styles.text}>
            Questo sito utilizza cookie tecnici necessari al funzionamento e cookie analitici per migliorare la tua esperienza.
            Puoi consultare la nostra{' '}
            <Link href={'/legal?section=cookies' as unknown as UrlObject}>Cookie Policy</Link>{' '}
            e la{' '}
            <Link href={'/legal?section=privacy' as unknown as UrlObject}>Privacy Policy</Link>{' '}
            per maggiori informazioni.
          </p>
          <div className={styles.actions}>
            <button className={styles.acceptButton} onClick={handleAccept}>
              Accetta
            </button>
            <button className={styles.rejectButton} onClick={handleReject}>
              Rifiuta
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
