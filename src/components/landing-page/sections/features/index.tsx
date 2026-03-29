'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, EyeOff, Shuffle, TrendingUp } from 'react-feather';
import styles from './features.module.css';

gsap.registerPlugin(ScrollTrigger);

const impactStats = [
  {
    value: '5-15 ore/settimana',
    description: 'Tempo speso nella pianificazione manuale dei turni',
  },
  {
    value: '3-8% di deriva',
    description: 'Aumento del costo del lavoro durante la settimana',
  },
  {
    value: '30-50%',
    description: 'Turni modificati dopo la pubblicazione',
  },
  {
    value: 'Nessuna visibilità',
    description: 'Sui driver del costo del lavoro tra i locali',
  },
];

const operationalIssues = [
  {
    title: 'Caos nella pianificazione dei turni',
    description:
      'I manager modificano continuamente i turni e reagiscono ai cambiamenti dell’ultimo minuto senza un controllo operativo strutturato.',
    icon: Shuffle,
    featured: true,
  },
  {
    title: 'Deriva del costo del lavoro',
    description:
      'I turni sembrano bilanciati a inizio settimana, ma il costo del lavoro diverge man mano che le operazioni evolvono.',
    icon: TrendingUp,
  },
  {
    title: 'Dati senza controllo operativo',
    description:
      'Gli area manager vedono i report ma non hanno strumenti per intervenire tempestivamente.',
    icon: EyeOff,
  },
  {
    title: 'Decisioni frammentate',
    description:
      'Punto vendita, area e headquarters operano su informazioni disconnesse.',
    icon: AlertCircle,
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
            <h2>Gestire più locali significa perdere il controllo del lavoro</h2>
            <p>
              Quando una catena cresce, la pianificazione dei turni diventa frammentata, i costi divergono e le decisioni operative avvengono senza visibilità.
            </p>
          </div>

          <div ref={featuresGridRef} className={styles.featuresGrid}>
            <div className={styles.metricsHeader}>
              <span className={styles.metricsLabel}>
                Impatto operativo tipico nelle catene della ristorazione multi-sede
              </span>
            </div>

            <div className={styles.metricsGrid}>
              {impactStats.map((stat) => (
                <article key={stat.value} className={styles.metricCard}>
                  <h3 className={styles.metricValue}>{stat.value}</h3>
                  <p className={styles.metricDescription}>{stat.description}</p>
                </article>
              ))}
            </div>

            <div className={styles.issueGrid}>
              {operationalIssues.map((issue) => {
                const Icon = issue.icon;

                return (
                  <article
                    key={issue.title}
                    className={`${styles.issueCard} ${issue.featured ? styles.issueCardFeatured : ''}`}
                  >
                    <div className={styles.issueIcon}>
                      <Icon size={20} />
                    </div>
                    <h3 className={styles.issueTitle}>{issue.title}</h3>
                    <p className={styles.issueDescription}>{issue.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
