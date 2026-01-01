'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './features.module.css';
import { FeatureCard } from './FeatureCard';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: 'Turni AI',
    description: 'Turni pronti in pochi secondi, senza errori e sempre in regola.',
    animation: 'smart_shifts' as const,
    features: [
      '<30 sec Output',
      'Punch Clock',
      'Ricalcolo imprevisto',
      'Banche Ore',
      'Alert legali',
      'Export Payroll'
    ]
  },
  {
    title: 'FoodBrain',
    description: 'Menu ottimizzato: più margini, meno sprechi.',
    animation: 'food_brain' as const,
    features: [
      'Analisi % Target',
      'Analisi Full Menu',
      'Esperimenti Piatti/Drink',
      'Suggerimenti Pricing'
    ]
  },
  {
    title: 'Staff Pro+',
    description: 'Tutto lo staff organizzato e conforme, senza carta e confusione.',
    animation: 'staff_pro' as const,
    features: [
      'HACCP digitale',
      'Export per ASL',
      'Analisi Emotivo Staff (Burnout-free)',
      'Canali Comunicazioni',
      'Checklist & Manutenzioni',
      'Regolamenti & Dress Code'
    ]
  },
];

export const Features: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const featuresGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const headline = headlineRef.current;
    const featuresGrid = featuresGridRef.current;

    if (!section || !container || !headline || !featuresGrid) return;

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

    // Headline animation
    gsap.to(headline, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headline,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    // Features grid animation
    gsap.to(featuresGrid, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: featuresGrid,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="features" ref={sectionRef} className={styles.section} data-section="features">
      <div ref={containerRef} className={styles.container}>
        <div className={styles.innerContainer}>
          <div ref={headlineRef} className={styles.headline}>
            <h2>STIAMO RIVOLUZIONANDO<br />IL MODO DI FARE<br />RISTORAZIONE.</h2>
          </div>

          <div ref={featuresGridRef} className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};