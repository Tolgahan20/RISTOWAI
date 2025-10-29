'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ArrowLeft } from 'react-feather';
import Image from 'next/image';
import '@/components/landing-page/landing-globals.css';
import styles from './page.module.css';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  contactReason: string;
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

const contactReasons = [
  { value: 'general-inquiry', label: 'Informazioni Generali' },
  { value: 'demo-request', label: 'Richiesta Demo' },
  { value: 'pricing-inquiry', label: 'Informazioni sui Prezzi' },
  { value: 'technical-support', label: 'Supporto Tecnico' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'press-inquiry', label: 'Richiesta Stampa' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Altro' },
];

const defaultMessage = 'Ciao, sono [Nome] [Cognome] del locale "[Nome Locale]" ([Tipo Attività]). La mia email è [email] e il mio telefono è [telefono]. Il motivo del contatto è [Motivo Contatto]. [Messaggio personalizzato]. Grazie.';

function ContactPageContent() {
  const router = useRouter();
  const [showReveal, setShowReveal] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    contactReason: '',
    message: defaultMessage,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const content = contentRef.current;
    const reveal = revealRef.current;

    if (!content || !reveal) return;

    gsap.set(content, {
      visibility: "visible",
      opacity: 0,
    });

    const tl = gsap.timeline({
      defaults: { duration: 1.2, ease: "power4.inOut" },
      onComplete: () => setShowReveal(false),
    });

    tl.to(
      `.${styles.revealLeft}`,
      {
        xPercent: -100,
        yPercent: -100,
      },
      0
    )
      .to(
        `.${styles.revealRight}`,
        {
          xPercent: 100,
          yPercent: 100,
        },
        0
      )
      .to(
        content,
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6"
      );

    return () => {
      tl.kill();
    };
  }, []);

  const updateFormData = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field !== 'message') {
        const firstName = updated.firstName || '[Nome]';
        const lastName = updated.lastName || '[Cognome]';
        const businessName = updated.businessName || '[Nome Locale]';
        const businessType = updated.businessType ? 
          businessTypes.find(bt => bt.value === updated.businessType)?.label || '' : '';
        const email = updated.email || '[email]';
        const phone = updated.phone || '[telefono]';
        const contactReason = updated.contactReason ? 
          contactReasons.find(cr => cr.value === updated.contactReason)?.label || '' : '[Motivo Contatto]';
        
        if (updated.message === defaultMessage || updated.message.includes('[Nome]') || updated.message.includes('[Messaggio personalizzato]')) {
          updated.message = `Ciao, sono ${firstName} ${lastName} del locale "${businessName}"${businessType ? ` (${businessType})` : ''}. La mia email è ${email} e il mio telefono è ${phone}. Il motivo del contatto è ${contactReason}. [Messaggio personalizzato]. Grazie.`;
        }
      }
      
      return updated;
    });
  };

  const handleMessageChange = (value: string) => {
    setFormData(prev => ({ ...prev, message: value }));
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
          subject: 'Richiesta Contatto',
          from_name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          business_name: formData.businessName,
          business_type: formData.businessType,
          contact_reason: formData.contactReason,
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
        <div className={styles.container}>
          <div className={styles.successMessage}>
            <h1 className={styles.successTitle}>Messaggio Inviato!</h1>
            <p className={styles.successText}>
              Grazie per averci contattato. Ti risponderemo presto!
            </p>
            <button 
              onClick={() => router.push('/')}
              className={styles.submitButton}
            >
              Torna alla Homepage
            </button>
          </div>
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

      <div ref={contentRef} className={styles.pageContent}>
        <div className={styles.container}>
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <div className={styles.backButtonContainer}>
                <button
                  onClick={() => router.push('/')}
                  className={styles.backButton}
                >
                  <ArrowLeft size={16} />
                  Torna indietro
                </button>
              </div>
              <div className={styles.logoContainer}>
                <Image
                  src="/full_logo_black.svg"
                  alt="Ristowai Logo"
                  width={200}
                  height={60}
                  className={styles.logo}
                />
              </div>
              <h1 className={styles.title}>Contattaci</h1>
              <p className={styles.subtitle}>
                Hai domande? Siamo qui per aiutarti. Compila il modulo e ti risponderemo presto.
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

                <div className={styles.formGroup}>
                  <label htmlFor="contactReason" className={styles.label}>
                    Motivo del Contatto *
                  </label>
                  <select
                    id="contactReason"
                    value={formData.contactReason}
                    onChange={(e) => updateFormData('contactReason', e.target.value)}
                    required
                    className={styles.select}
                  >
                    <option value="">Seleziona motivo del contatto</option>
                    {contactReasons.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  Messaggio *
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  className={styles.textarea}
                  rows={6}
                  placeholder="Scrivi il tuo messaggio qui..."
                  required
                />
                <p className={styles.messageHint}>
                  Puoi modificare o cancellare il testo predefinito e scrivere il tuo messaggio personalizzato.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#fff' }} />}>
      <ContactPageContent />
    </Suspense>
  );
}

