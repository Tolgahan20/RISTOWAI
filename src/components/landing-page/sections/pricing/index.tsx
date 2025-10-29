'use client';

import React, { useEffect, useRef } from 'react';
import styles from './pricing.module.css';
import { ArrowUpRight } from 'react-feather';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const pricingPlans = [
  {
    title: 'Moduli Singoli',
    priceRange: '€18–35',
    period: 'al mese',
    description: 'Scegli solo le soluzioni che ti servono.',
    features: [
      'Turni AI, Staff Pro+, HR Smart, Marketing & Reviews → €18–22',
      'FoodBrain → €25–35',
      'Accesso al Dashboard Manager con qualsiasi soluzione'
    ],
    buttonText: 'Scegli la tua soluzione',
    buttonStyle: 'secondary'
  },
  {
    title: 'Bundle',
    priceRange: '€100–139',
    period: 'al mese',
    description: 'Migliore valore per i ristoranti che vogliono un controllo totale.',
    features: [
      'Founder Edition (0–50 utenti) → €100/mese',
      'Early Growth (51–100 utenti) → €119/mese',
      'Standard (101+ utenti) → €139/mese',
      'Prezzo bloccato per sempre'
    ],
    buttonText: 'Ottieni il bundle',
    buttonStyle: 'primary',
    popular: true
  },
  {
    title: 'Servizi Extra',
    priceRange: '€39–800',
    period: 'variabile',
    description: 'Servizi aggiuntivi per completare la tua soluzione.',
    features: [
      'POS AI Insight → €39/mese',
      'Sito vetrina → €400–800 una tantum',
      'Nutrizione & Healthy Menu → €50–150 una tantum'
    ],
    buttonText: 'Scopri i servizi',
    buttonStyle: 'secondary'
  }
];

export const Pricing = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current;

    if (!section || !title || cards.length === 0) return;

    // Check if mobile
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
      // On mobile, skip animations
      return;
    }

    // Desktop animations
    // Set initial state to prevent flashing
    gsap.set([title.children, ...cards], {
      opacity: 1,
      y: 0
    });

    // Title animation
    gsap.from(title.children, {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
      }
    });

    // Cards animation
    cards.forEach((card, index) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: 0.2 * index,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className={styles.section} data-section="white">
      <div className={styles.container}>
        <div ref={titleRef} className={styles.titleContainer}>
          <h2 className={styles.title}>I Nostri Piani</h2>
          <p className={styles.subtitle}>
            Tutti i piani includono le nostre funzionalità principali. Hai bisogno di qualcosa di personalizzato? Contatta il nostro team vendite
          </p>
        </div>

        <div className={styles.grid}>
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              ref={el => {
                if (el) {
                  cardsRef.current[index] = el;
                }
              }}
              className={`${styles.card} ${plan.popular ? styles.popular : ''}`}
            >
              {plan.popular && (
                <span className={styles.popularBadge}>Most Popular</span>
              )}
              <h3 className={styles.cardTitle}>{plan.title}</h3>
              <div className={styles.priceRange}>{plan.priceRange}</div>
              <div className={styles.period}>{plan.period}</div>
              <p className={styles.description}>{plan.description}</p>
              <ul className={styles.featuresList}>
                {plan.features.map((feature, featureIndex) => {
                  const parts = feature.split('→');
                  return (
                    <li key={featureIndex} className={styles.featureItem}>
                      <span className={styles.featureName}>{parts[0].trim()}</span>
                      {parts.length > 1 && (
                        <span className={styles.featurePrice}>→ {parts[1].trim()}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <button 
                className={`${styles.button} ${
                  plan.buttonStyle === 'primary' ? styles.primaryButton : styles.secondaryButton
                }`}
              >
                <div className={styles.buttonInner}>
                  <span className={styles.buttonText} data-hover={plan.buttonText}>
                    {plan.buttonText}
                  </span>
                </div>
                <ArrowUpRight className={styles.buttonIcon} size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
