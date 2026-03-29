'use client';

import React, { useEffect, useRef } from 'react';
import styles from './faq.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  {
    value: '10–20%',
    description: 'Riduzione del lavoro manuale nella pianificazione turni',
  },
  {
    value: '2–5%',
    description: 'Maggiore stabilità del costo del lavoro',
  },
  {
    value: 'Più veloce',
    description: 'Individuazione dei problemi operativi',
  },
  {
    value: 'Allineato',
    description: 'Decisioni sul lavoro tra punto vendita, area e headquarters',
  },
];

export const FAQ = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const title = titleRef.current;
    const grid = gridRef.current;

    if (!section || !container || !title || !grid || cardRefs.current.length === 0) return;
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
      gsap.set([title, ...cardRefs.current], {
        opacity: 1,
        y: 0,
        clearProps: 'transform',
      });
      return;
    }

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

    gsap.from(cardRefs.current, {
      y: 32,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section id="faq" ref={sectionRef} className={styles.section} data-section="white">
      <div ref={containerRef} className={styles.container}>
        <div className={styles.innerContainer}>
          <div className={styles.impactPanel}>
            <h2 ref={titleRef} className={styles.title}>CHIAREZZA OPERATIVA GENERA IMPATTO MISURABILE</h2>

            <div ref={gridRef} className={styles.metricsGrid}>
              {metrics.map((metric, index) => (
                <div
                  key={metric.value}
                  ref={(el) => {
                    if (el) {
                      cardRefs.current[index] = el;
                    }
                  }}
                  className={styles.metricCard}
                >
                  <div className={styles.metricValue}>{metric.value}</div>
                  <p className={styles.metricDescription}>{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
