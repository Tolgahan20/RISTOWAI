'use client';

import React, { useEffect, useRef } from 'react';
import { Briefcase, Calendar, Coffee, Shield, ShoppingBag, Zap } from 'react-feather';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './built-for.module.css';

gsap.registerPlugin(ScrollTrigger);

const segments = [
  { icon: ShoppingBag, label: 'Gruppi di ristorazione' },
  { icon: Coffee, label: 'Catene food' },
  { icon: Briefcase, label: 'Hotel e hospitality' },
  { icon: Zap, label: 'Brand fast-casual' },
];

const chips = [
  { icon: Briefcase, label: 'Progettato per operazioni multi-sede' },
  { icon: Calendar, label: 'Costruito attorno ai cicli operativi settimanali' },
  { icon: Shield, label: 'Focalizzato sulla governance del costo del lavoro' },
];

export const BuiltFor = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const marquee = marqueeRef.current;
    const chips = chipsRef.current;

    if (!section || !title || !marquee || !chips) return;
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
      gsap.set([title, marquee, chips], {
        opacity: 1,
        y: 0,
        clearProps: 'transform',
      });
      return;
    }

    gsap.from([title, marquee, chips], {
      y: 32,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const marqueeItems = [...segments, ...segments];

  return (
    <section ref={sectionRef} className={styles.section} data-section="white">
      <div className={styles.container}>
        <div ref={titleRef} className={styles.header}>
          <h2 className={styles.title}>COSTRUITO PER LE CATENE DELLA RISTORAZIONE</h2>
          <p className={styles.subtitle}>
            Ristowai è progettato attorno ai reali flussi operativi utilizzati da store manager, area manager e team headquarters in ambienti di ristorazione multi-sede.
          </p>
        </div>

        <div ref={marqueeRef} className={styles.marquee}>
          <div className={styles.track}>
            {marqueeItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <article key={`${item.label}-${index}`} className={styles.card}>
                  <span className={styles.cardIcon}>
                    <Icon size={30} />
                  </span>
                  <span className={styles.cardLabel}>{item.label}</span>
                </article>
              );
            })}
          </div>
        </div>

        <div ref={chipsRef} className={styles.chips}>
          {chips.map((chip) => {
            const Icon = chip.icon;

            return (
              <div key={chip.label} className={styles.chip}>
                <Icon size={18} />
                <span>{chip.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
