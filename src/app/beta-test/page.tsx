'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { ArrowLeft } from 'react-feather';
import { DesktopNav, MobileNav } from '@/components/landing-page/layout';
import styles from './page.module.css';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  message: string;
}

const businessTypes = [
  { value: 'restaurant', label: 'Ristorante' },
  { value: 'cafe', label: 'Caffè' },
  { value: 'bar', label: 'Bar' },
  { value: 'pizzeria', label: 'Pizzeria' },
  { value: 'trattoria', label: 'Trattoria' },
  { value: 'osteria', label: 'Osteria' },
  { value: 'bistro', label: 'Bistro' },
  { value: 'fast-food', label: 'Fast Food' },
  { value: 'food-truck', label: 'Food Truck' },
  { value: 'other', label: 'Altro' },
];

export default function BetaTestPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReveal, setShowReveal] = useState(true);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const reveal = revealRef.current;

    if (!content || !reveal) return;

    gsap.set(content, {
      visibility: 'visible',
      opacity: 0,
    });

    const tl = gsap.timeline({
      defaults: { duration: 1.2, ease: 'power4.inOut' },
      onComplete: () => setShowReveal(false),
    });

    tl.to(`.${styles.revealLeft}`, { xPercent: -100, yPercent: -100 }, 0)
      .to(`.${styles.revealRight}`, { xPercent: 100, yPercent: 100 }, 0)
      .to(content, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    return () => {
      tl.kill();
    };
  }, []);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      const firstName = updated.firstName || '[Nome]';
      const lastName = updated.lastName || '[Cognome]';
      const businessName = updated.businessName || '[Nome Locale]';
      const businessType = updated.businessType ? 
        businessTypes.find(bt => bt.value === updated.businessType)?.label || '' : '';
      const email = updated.email || '[email]';
      const phone = updated.phone || '[telefono]';
      
      updated.message = `Ciao, sono ${firstName} ${lastName} del locale "${businessName}"${businessType ? ` (${businessType})` : ''}. La mia email è ${email} e il mio telefono è ${phone}. Mi servirebbe onboarding locale per iniziare a utilizzare Ristowai. Grazie.`;
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    
    if (!accessKey) {
      alert('Configurazione mancante. Contatta l\'amministratore del sito.');
      console.error('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not defined');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'Richiesta Registrazione Beta Test',
          from_name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          business_name: formData.businessName,
          business_type: formData.businessType,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        throw new Error(data.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Errore nell\'invio del modulo. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        {showReveal && (
          <div ref={revealRef} className={styles.pageReveal}>
            <div className={styles.revealLeft}></div>
            <div className={styles.revealRight}></div>
          </div>
        )}
        <div className="nav-fixed">
          <DesktopNav />
          <MobileNav />
        </div>
      <div ref={contentRef} className={styles.pageContent}>
        <section data-section="white">
          <main className={styles.main}>
            <div className={styles.successContainer}>
              <h1 className={styles.successTitle}>Registrazione Completata!</h1>
              <p className={styles.successText}>
                Grazie per la tua registrazione al programma beta. Ti contatteremo presto per iniziare l&apos;onboarding.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className={styles.successButton}
              >
                Torna alla Homepage
              </button>
            </div>
          </main>
        </section>
      </div>
      </>
    );
  }

  return (
    <>
      {showReveal && (
        <div ref={revealRef} className={styles.pageReveal}>
          <div className={styles.revealLeft}></div>
          <div className={styles.revealRight}></div>
        </div>
      )}
      <div className="nav-fixed">
        <DesktopNav />
        <MobileNav />
      </div>
      <div ref={contentRef} className={styles.pageContent}>
        <section data-section="white">
          <main className={styles.main}>
            <div className={styles.container}>
            <div className={styles.header}>
              <button
                onClick={() => window.history.back()}
                className={styles.backButton}
              >
                <ArrowLeft size={16} />
                Torna indietro
              </button>
              <Image
                src="/full_logo_black.svg"
                alt="Ristowai Logo"
                width={200}
                height={60}
                className={styles.logo}
              />
              <h1 className={styles.title}>Registrazione Beta Test</h1>
              <p className={styles.subtitle}>
                Unisciti al programma di beta testing e ottieni accesso anticipato a Ristowai
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName" className={styles.label}>
                    Nome *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    required
                    className={styles.input}
                    placeholder="Il tuo nome"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="lastName" className={styles.label}>
                    Cognome *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    required
                    className={styles.input}
                    placeholder="Il tuo cognome"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    required
                    className={styles.input}
                    placeholder="la-tua-email@esempio.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Numero di Telefono *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    required
                    className={styles.input}
                    placeholder="+39 123 456 7890"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="businessName" className={styles.label}>
                    Nome del Locale *
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => updateFormData('businessName', e.target.value)}
                    required
                    className={styles.input}
                    placeholder="Nome del tuo ristorante/locale"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="businessType" className={styles.label}>
                    Tipo di Attività *
                  </label>
                  <select
                    id="businessType"
                    value={formData.businessType}
                    onChange={(e) => updateFormData('businessType', e.target.value)}
                    required
                    className={styles.select}
                  >
                    <option value="">Seleziona tipo di attività</option>
                    {businessTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  Messaggio
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => updateFormData('message', e.target.value)}
                  className={styles.textarea}
                  rows={4}
                  placeholder="Il messaggio verrà aggiornato automaticamente con i tuoi dati"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Invio in corso...' : 'Registrati al Beta Test'}
              </button>
            </form>
          </div>
          </main>
        </section>
      </div>
    </>
  );
}

