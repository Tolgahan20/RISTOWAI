'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './faq.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'react-feather';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: 'Devo avere competenze tecniche per usare Ristowai?',
    answer: 'No. Ristowai è progettato per manager e personale del ristorante, non per esperti IT. La configurazione è guidata e puoi anche condividere le informazioni con noi via WhatsApp — noi configureremo tutto per te.'
  },
  {
    question: 'Posso provare Ristowai gratis?',
    answer: 'Sì. Ogni ristorante riceve una prova gratuita di 1 mese con accesso completo a tutte le soluzioni.'
  },
  {
    question: 'Posso scegliere solo alcune soluzioni?',
    answer: 'Sì. Ogni soluzione funziona in modo indipendente. Paghi solo per quello che usi.'
  },
  {
    question: 'Quali risultati posso aspettarmi?',
    answer: 'Beta testers hanno segnalato costi operativi del 20% più bassi e un aumento del margine del 12% in soli 2 mesi.'
  },
  {
    question: 'I miei dati sono sicuri?',
    answer: 'Assolutamente. Tutti i dati sono crittografati, memorizzati in modo sicuro in Europa e mai condivisi con terze parti.'
  },
  {
    question: 'Offrite servizi extra?',
    answer: 'Sì. Su richiesta offriamo anche: Creazione showcase del sito web (€400–800 una volta sola), Consulenza nutrizionista o design del menu (€50–150).'
  },
  {
    question: 'Il personale può usarlo su mobile?',
    answer: 'Sì. Ristowai funziona su desktop, tablet e smartphone — non è necessario installare alcuna app.'
  },
  {
    question: 'Come posso annullare la mia iscrizione?',
    answer: 'Puoi annullare in qualsiasi momento. Nessun contratto a lungo termine, nessun costo nascosto.'
  }
];

export const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const faqRefs = useRef<HTMLDivElement[]>([]);
  const answerRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const title = titleRef.current;
    const grid = gridRef.current;

    if (!section || !container || !title || !grid) return;

    // Container expansion animation
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        onUpdate: (self) => {
          if (self.progress > 0.5) {
            container.classList.add(styles.expanded);
          } else {
            container.classList.remove(styles.expanded);
          }
        }
      }
    });

    // Title animation
    gsap.from(title, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
      },
    });

    // FAQ items animation
    gsap.to(faqRefs.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="faq" ref={sectionRef} className={styles.section} data-section="white">
      <div ref={containerRef} className={styles.container}>
        <div className={styles.innerContainer}>
          <h2 ref={titleRef} className={styles.title}>Domande Frequenti</h2>
          
          <div ref={gridRef} className={styles.faqGrid}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                ref={el => {
                  if (el) faqRefs.current[index] = el;
                }}
                className={styles.faqItem}
              >
                <button 
                  className={styles.questionButton}
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  <h3 className={styles.question}>{faq.question}</h3>
                  <ChevronDown 
                    className={`${styles.icon} ${expandedIndex === index ? styles.expanded : ''}`} 
                    size={24}
                  />
                </button>
                <div 
                  ref={el => { if (el) answerRefs.current[index] = el; }}
                  className={`${styles.answerWrapper} ${expandedIndex === index ? styles.expanded : ''}`}
                >
                  <p className={styles.answer}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
