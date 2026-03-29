'use client';
import React, { useEffect, useRef } from 'react';

import gsap from 'gsap';
import { Button } from '../../ui/button';
import styles from './hero.module.css';
import { ArrowUpRight } from 'react-feather';

export const Hero: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    entranceTl
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 },
        0,
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6',
      )
      .fromTo(
        actionsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4',
      );

    return () => {
      entranceTl.kill();
    };
  }, []);

  return (
    <section className={styles.hero} data-section="hero">
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 ref={titleRef} className={styles.title}>
            Scopri come le catene della ristorazione governano il costo del lavoro
          </h1>

          <p ref={subtitleRef} className={styles.subtitle}>
            Ristowai aiuta gruppi di ristorazione multi-sede a pianificare i turni, controllare il costo del lavoro e coordinare le decisioni tra punto vendita, area manager e headquarters.
          </p>

          <div ref={actionsRef} className={styles.actions}>
            <Button
              href="/beta-test"
              size="large"
              icon={<ArrowUpRight size={24} />}
            >
              Prenota una demo
            </Button>
            <Button
              href="#how-it-works"
              variant="secondary"
              size="large"
            >
              Scopri come funziona
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
