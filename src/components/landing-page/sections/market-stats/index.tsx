'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Flag from 'react-world-flags';
import styles from './market-stats.module.css';

gsap.registerPlugin(ScrollTrigger);

const countryToCode = {
  'USA': 'US',
  'UK': 'GB',
  'Spagna': 'ES',
  'Germania': 'DE',
  'Italia': 'IT'
};

const globalStats = [
  {
    country: 'USA',
    percentage: '62%',
    description: 'dei ristoranti usa già AI per turni e forecasting',
    impact: '–18% costi staff'
  },
  {
    country: 'UK',
    percentage: '40%',
    description: 'ottimizza menu e prezzi con AI',
    impact: '+14% margini in 6 mesi'
  },
  {
    country: 'Spagna',
    percentage: '1 su 3',
    description: 'ristoranti usa AI per prenotazioni/marketing',
    impact: '+9% coperti al giorno'
  },
  {
    country: 'Germania',
    percentage: '25%',
    description: 'usa AI per food cost e sprechi',
    impact: '–12% food waste'
  }
];

export const MarketStats = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const gapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const headline = headlineRef.current;
    const comparison = comparisonRef.current;
    const stats = statsRef.current;
    const gap = gapRef.current;

    if (!section || !container || !headline || !comparison || !stats || !gap) return;

    // Check if mobile
    const isMobile = window.innerWidth <= 1024;

    // Container expansion animation (works on both mobile and desktop)
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

    if (isMobile) {
      // On mobile, skip content animations but keep container animation
      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }

    // Desktop content animations
    // Set initial state to prevent flashing
    gsap.set([headline.children, comparison.children, stats.children, gap.children], {
      opacity: 1,
      y: 0
    });

    gsap.from(headline.children, {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headline,
        start: 'top 80%',
      }
    });

    gsap.from(comparison.children, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: comparison,
        start: 'top 80%',
      }
    });

    gsap.from(stats.children, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: stats,
        start: 'top 80%',
      }
    });

    gsap.from(gap.children, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: gap,
        start: 'top 80%',
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="market-stats" ref={sectionRef} className={styles.section} data-section="white">
      <div ref={containerRef} className={styles.container}>
        <div className={styles.innerContainer}>
          <div ref={headlineRef} className={styles.headline}>
            <h2>Il futuro della ristorazione è già iniziato</h2>
            <p>
              Mentre all&apos;estero l&apos;adozione di AI nel foodservice cresce a doppia cifra, 
              in Italia la maggioranza dei locali è ancora ferma a fogli Excel e carta.
            </p>
          </div>

          <div ref={comparisonRef} className={styles.comparison}>
            <div className={styles.comparisonItem}>
              <div className={styles.countryFlag}>
                <Flag code={countryToCode['USA']} height={32} />
              </div>
              <div className={styles.countryName}>USA</div>
              <div className={styles.stat}>62%</div>
              <div className={styles.label}>AI Adoption</div>
              <div className={styles.description}>dei ristoranti usa già AI per turni e forecasting</div>
              <div className={styles.impact}>–18% costi staff</div>
            </div>
            <div className={styles.vs}>VS</div>
            <div className={styles.comparisonItem}>
              <div className={styles.countryFlag}>
                <Flag code={countryToCode['Italia']} height={32} />
              </div>
              <div className={styles.countryName}>Italia</div>
              <div className={styles.stat}>70%</div>
              <div className={styles.label}>Excel/Carta</div>
              <div className={styles.description}>ancora su sistemi tradizionali</div>
              <div className={styles.impact}>90% dice &quot;non ho tempo&quot;</div>
            </div>
          </div>

          <div className={styles.globalSection}>
            <h3>I leader mondiali dell&apos;AI nel foodservice</h3>
            <p>Paesi che stanno già raccogliendo i frutti dell&apos;innovazione</p>
            
            <div ref={statsRef} className={styles.statsGrid}>
              {globalStats.map((stat, index) => (
                <div key={index} className={styles.statCard}>
                  <div className={styles.countryFlag}>
                    <Flag code={countryToCode[stat.country as keyof typeof countryToCode]} height={32} />
                  </div>
                  <div className={styles.countryName}>{stat.country}</div>
                  <div className={styles.percentage}>{stat.percentage}</div>
                  <p>{stat.description}</p>
                  <div className={styles.impact}>{stat.impact}</div>
                </div>
              ))}
            </div>
          </div>

          <div ref={gapRef} className={styles.gapSection}>
            <h3>Il gap che Ristowai colma</h3>
            <div className={styles.gapComparison}>
              <div className={styles.gapItem}>
                <div className={styles.countryFlag}>
                  <Flag code={countryToCode['Italia']} height={32} />
                </div>
                <div className={styles.countryName}>Italia</div>
                <div className={styles.percentage}>70%</div>
                <p>ancora su Excel/carta</p>
              </div>
              <div className={styles.gapDivider}>GAP</div>
              <div className={styles.gapItem}>
                <div className={styles.percentage}>+25%</div>
                <p>CAGR mercato AI foodtech fino al 2030</p>
              </div>
            </div>
            <div className={styles.conclusion}>
              Trasforma il tuo ristorante con l&apos;AI.<br />
              Inizia oggi, vedi i risultati domani.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};