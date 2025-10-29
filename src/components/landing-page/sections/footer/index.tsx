'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Instagram } from 'react-feather';
import styles from './footer.module.css';
import { UrlObject } from 'url';

export const Footer = () => {
  const renderLink = (href: string, text: string) => (
    <div className={styles.linkWrapper}>
      <Link href={href as unknown as UrlObject} className={styles.link} data-text={text}>
        {text}
      </Link>
    </div>
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.logoSection}>
            <Image
              src="/full_logo_white.svg"
              alt="Ristowai"
              width={180}
              height={48}
              className={styles.logo}
            />
            <p className={styles.description}>
              Copilota AI per ristoranti. Realizzato in Italia
            </p>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Link Rapidi</h3>
            <div className={styles.linkList}>
              {renderLink('/solutions', 'Soluzioni')}
              {renderLink('/market', 'Mercato Attuale')}
              {renderLink('/how-it-works', 'Come funziona')}
              {renderLink('/pricing', 'Prezzi')}
              {renderLink('/waiting-list', 'Lista d\'attesa')}
              {renderLink('/faq', 'FAQ')}
            </div>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Azienda</h3>
            <div className={styles.linkList}>
              {renderLink('/about', 'Chi Siamo')}
              {renderLink('/contact', 'Contatti')}
              {renderLink('/beta', 'Programma Beta Test')}
            </div>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Legale</h3>
            <div className={styles.linkList}>
              {renderLink('/privacy', 'Privacy Policy')}
              {renderLink('/terms', 'Terms of Service')}
              {renderLink('/cookies', 'Cookie Policy')}
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Ristowai. All rights reserved.
          </p>
          <div className={styles.socialLinks}>
            <Link href={"https://www.linkedin.com/company/ristowai/" as unknown as UrlObject} className={styles.socialLink} target="_blank">
              <Linkedin size={20} />
            </Link>
            <Link href={"https://www.instagram.com/ristowai/" as unknown as UrlObject} className={styles.socialLink} target="_blank">
              <Instagram size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
