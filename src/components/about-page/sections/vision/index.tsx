'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './vision.module.css';

gsap.registerPlugin(ScrollTrigger);

export const Vision: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const content = contentRef.current;

    if (!section || !container || !content) return;

    // Check if mobile
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
      container.classList.add(styles.expanded);
      gsap.set(content.children, { opacity: 1, y: 0 });
      return;
    }

    // Set initial state
    gsap.set(content.children, { opacity: 1, y: 0 });

    // Container expansion animation
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top center',
        end: 'top top',
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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} data-section="white">
      <div ref={containerRef} className={styles.container}>
        <div className={styles.innerContainer}>
          <div ref={contentRef} className={styles.content}>
            {/* Main Vision */}
            <div className={styles.mainVision}>
              <h3 className={styles.sectionLabel}>La visione</h3>
              <p className={styles.mainText}>
                Ristowai nasce per dare ai ristoratori un alleato intelligente che semplifica la gestione, riduce i costi e restituisce tempo. Crediamo in un&apos;innovazione che rimane umana — dove l&apos;intelligenza artificiale potenzia le persone, non le sostituisce.
              </p>
              <p className={styles.tagline}>AI that empowers, not replaces.</p>
            </div>

            {/* Shared Vision */}
            <div className={styles.sharedVision}>
              <h3 className={styles.sectionLabel}>Visione condivisa</h3>
              <p className={styles.text}>
                Lavoriamo per creare un ecosistema digitale che semplifichi la gestione ristorativa e valorizzi il lavoro umano. Ogni decisione nasce da una convinzione profonda: l&apos;AI deve potenziare le persone, non sostituirle.
              </p>
              <p className={styles.text}>
                Ristowai è il punto di incontro tra intelligenza artificiale, esperienza reale e passione per il settore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

