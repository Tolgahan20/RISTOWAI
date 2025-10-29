'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Instagram } from 'react-feather';
import { usePathname } from 'next/navigation';
import styles from './footer.module.css';
import { UrlObject } from 'url';

export const Footer = () => {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  const renderLink = (href: string, text: string, isSection = false) => {
    // For section links, adjust based on current page
    const finalHref = isSection && !isHomepage ? `/${href}` : href;
    
    return (
      <div className={styles.linkWrapper}>
        <Link href={finalHref as unknown as UrlObject} className={styles.link} data-text={text}>
          {text}
        </Link>
      </div>
    );
  };

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
              {renderLink('#features', 'Soluzioni', true)}
              {renderLink('#market-stats', 'Mercato Attuale', true)}
              {renderLink('#how-it-works', 'Come funziona', true)}
              {renderLink('#pricing', 'Prezzi', true)}
              {renderLink('#waiting-list', 'Lista d\'attesa', true)}
              {renderLink('#faq', 'FAQ', true)}
            </div>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Azienda</h3>
            <div className={styles.linkList}>
              {renderLink('/about', 'Chi Siamo')}
              {renderLink('/contact', 'Contatti')}
              {renderLink('/beta-test', 'Programma Beta Test')}
            </div>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Legale</h3>
            <div className={styles.linkList}>
              {renderLink('/legal?section=privacy', 'Privacy Policy')}
              {renderLink('/legal?section=terms', 'Terms of Service')}
              {renderLink('/legal?section=cookies', 'Cookie Policy')}
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
