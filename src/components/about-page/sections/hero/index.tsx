'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './hero.module.css';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;

    if (!hero || !line1 || !line2) return;

    // Set initial state
    gsap.set([line1, line2], {
      opacity: 0,
      y: 40,
    });

    // Create animation timeline
    const tl = gsap.timeline({
      delay: 1.5, // Wait for page reveal animation
    });

    // Animate line 1
    tl.to(line1, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    });

    // Animate line 2
    tl.to(
      line2,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.4' // Overlap with previous animation
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} data-section="dark">
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 ref={line1Ref} className={styles.line1}>
            Nata da un&apos;idea ambiziosa:
          </h1>
          <h2 ref={line2Ref} className={styles.line2}>
            Cambiare per <br />sempre
            il modo <br />in cui
            si fa un <br /> buon lavoro.
          </h2>
        </div>
      </div>
    </section>
  );
};

