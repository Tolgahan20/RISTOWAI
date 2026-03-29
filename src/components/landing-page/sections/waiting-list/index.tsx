'use client';

import React, { useEffect, useRef } from 'react';
import styles from './waiting-list.module.css';
import { AlertCircle, BarChart2, Calendar } from 'react-feather';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: 'Impatto della domanda',
    description: 'Le variazioni della domanda clienti influenzano il fabbisogno di personale.',
    icon: BarChart2,
  },
  {
    title: 'Impatto della pianificazione',
    description: 'Le decisioni di scheduling possono aumentare o ridurre il costo del lavoro.',
    icon: Calendar,
  },
  {
    title: 'Impatto dell’esecuzione',
    description: 'Eventi operativi come malattie, sostituzioni e straordinari modificano il piano iniziale.',
    icon: AlertCircle,
  },
];

export const WaitingList = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const formulaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const cardElements = cardsRef.current;
    const formula = formulaRef.current;

    if (!section || !container || !title || !subtitle || cardElements.length === 0 || !formula) return;

    const isMobile = window.innerWidth <= 1024;

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
        },
      },
    });

    if (isMobile) {
      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }

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

    gsap.from(subtitle, {
      y: 36,
      opacity: 0,
      duration: 0.9,
      delay: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: subtitle,
        start: 'top 80%',
      },
    });

    cardElements.forEach((card, index) => {
      gsap.from(card, {
        y: 48,
        opacity: 0,
        duration: 0.8,
        delay: 0.12 * index,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
      });
    });

    gsap.from(formula, {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: formula,
        start: 'top 88%',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section id="labour-intelligence" ref={sectionRef} className={styles.section} data-section="dark">
      <div ref={containerRef} className={styles.container}>
        <div className={styles.innerContainer}>
          <h2 ref={titleRef} className={styles.title}>COMPRENDI PERCHÉ CAMBIA IL COSTO DEL LAVORO</h2>
          <p ref={subtitleRef} className={styles.subtitle}>
            Molti sistemi mostrano soltanto i numeri del lavoro.
            <br />
            Ristowai spiega i fattori operativi che li determinano.
          </p>

          <div className={styles.cardsGrid}>
            {cards.map((card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  ref={(el) => {
                    if (el) {
                      cardsRef.current[index] = el;
                    }
                  }}
                  className={styles.card}
                >
                  <span className={styles.cardIcon}>
                    <Icon size={28} />
                  </span>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDescription}>{card.description}</p>
                </div>
              );
            })}
          </div>

          <div ref={formulaRef} className={styles.formula}>
            <span className={`${styles.formulaPill} ${styles.formulaPillPrimary}`}>Costo del lavoro</span>
            <span className={styles.formulaOperator}>=</span>
            <span className={styles.formulaPill}>Domanda</span>
            <span className={styles.formulaOperator}>+</span>
            <span className={styles.formulaPill}>Pianificazione</span>
            <span className={styles.formulaOperator}>+</span>
            <span className={styles.formulaPill}>Esecuzione</span>
          </div>
        </div>
      </div>
    </section>
  );
};
