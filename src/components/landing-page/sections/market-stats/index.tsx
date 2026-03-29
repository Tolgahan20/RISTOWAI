'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Check } from 'react-feather';
import styles from './market-stats.module.css';

gsap.registerPlugin(ScrollTrigger);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);

const formatCompactCurrency = (value: number) =>
  formatCurrency(value).replace(/\s/g, '');

export const MarketStats = () => {
  const [revenuePerStore, setRevenuePerStore] = useState(2650000);
  const [laborRate, setLaborRate] = useState(33.5);
  const [locationCount, setLocationCount] = useState(5);
  const [useHistoricalData, setUseHistoricalData] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const annualLaborCost = revenuePerStore * locationCount * (laborRate / 100);
  const savingsLowRate = useHistoricalData ? 0.075 : 0.06;
  const savingsHighRate = useHistoricalData ? 0.12 : 0.075;
  const annualSavingsLow = annualLaborCost * savingsLowRate;
  const annualSavingsHigh = annualLaborCost * savingsHighRate;
  const annualInvestmentLow = locationCount * 1788;
  const annualInvestmentHigh = locationCount * 3600;
  const roiYearOne = annualSavingsLow / annualInvestmentHigh;

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const title = titleRef.current;
    const calculator = calculatorRef.current;
    const cta = ctaRef.current;

    if (!section || !container || !title || !calculator || !cta) return;

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

    gsap.from([title, calculator, cta], {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.14,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section id="calculator" ref={sectionRef} className={styles.section} data-section="dark">
      <div ref={containerRef} className={styles.container}>
        <div className={styles.innerContainer}>
          <div ref={titleRef} className={styles.header}>
            <h2 className={styles.title}>CALCOLA I TUOI RISPARMI</h2>
            <p className={styles.subtitle}>Scopri quanto Ristowai può far risparmiare alla tua operazione.</p>
          </div>

          <div ref={calculatorRef} className={styles.calculatorGrid}>
            <div className={styles.inputPanel}>
              <h3 className={styles.panelTitle}>La tua operazione oggi</h3>

              <div className={styles.controlGroup}>
                <div className={styles.controlHeader}>
                  <span>Fatturato annuo per punto vendita</span>
                  <strong>{formatCompactCurrency(revenuePerStore)}</strong>
                </div>
                <input
                  className={styles.range}
                  type="range"
                  min={200000}
                  max={3000000}
                  step={50000}
                  value={revenuePerStore}
                  onChange={(event) => setRevenuePerStore(Number(event.target.value))}
                />
                <div className={styles.rangeLabels}>
                  <span>€200K</span>
                  <span>€3M</span>
                </div>
              </div>

              <div className={styles.controlGroup}>
                <div className={styles.controlHeader}>
                  <span>Costo del lavoro attuale (CDL%)</span>
                  <strong>{laborRate.toFixed(1)}%</strong>
                </div>
                <input
                  className={styles.range}
                  type="range"
                  min={20}
                  max={45}
                  step={0.5}
                  value={laborRate}
                  onChange={(event) => setLaborRate(Number(event.target.value))}
                />
                <div className={styles.rangeLabels}>
                  <span>20%</span>
                  <span>45%</span>
                </div>
              </div>

              <div className={styles.controlGroup}>
                <div className={styles.controlHeader}>
                  <span>Numero di punti vendita</span>
                </div>
                <div className={styles.counterRow}>
                  <button
                    type="button"
                    className={styles.counterButton}
                    onClick={() => setLocationCount((current) => Math.max(1, current - 1))}
                  >
                    −
                  </button>
                  <div className={styles.counterValue}>{locationCount}</div>
                  <button
                    type="button"
                    className={styles.counterButton}
                    onClick={() => setLocationCount((current) => Math.min(25, current + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className={styles.checkboxRow}
                onClick={() => setUseHistoricalData((current) => !current)}
              >
                <span className={`${styles.checkbox} ${useHistoricalData ? styles.checkboxChecked : ''}`}>
                  {useHistoricalData && <Check size={16} />}
                </span>
                <span>Utilizziamo dati storici di vendita</span>
              </button>
            </div>

            <div className={styles.resultPanel}>
              <h3 className={styles.resultTitle}>I tuoi risparmi stimati con Ristowai</h3>

              <div className={styles.resultBlock}>
                <span className={styles.resultLabel}>Costo del lavoro annuo attuale</span>
                <div className={styles.resultValueLarge}>
                  {formatCurrency(annualLaborCost)}
                  <span>/ anno</span>
                </div>
              </div>

              <div className={styles.resultBlock}>
                <span className={styles.resultLabel}>Risparmio annuo stimato</span>
                <div className={styles.resultValueAccent}>
                  {formatCurrency(annualSavingsLow)} — {formatCurrency(annualSavingsHigh)}
                  <span>/ anno</span>
                </div>
                <p className={styles.resultNote}>
                  Basato su ottimizzazione pianificazione ed esecuzione
                </p>
              </div>

              <div className={styles.resultBlock}>
                <span className={styles.resultLabel}>Investimento Ristowai</span>
                <div className={styles.resultValueMedium}>
                  {formatCurrency(annualInvestmentLow)} — {formatCurrency(annualInvestmentHigh)}
                  <span>/ anno</span>
                </div>
              </div>

              <div className={styles.resultDivider} />

              <div className={styles.resultBlock}>
                <span className={styles.resultLabel}>Ritorno sull&apos;investimento — anno 1</span>
                <div className={styles.resultValueHighlight}>{roiYearOne.toFixed(1)}x</div>
                <p className={styles.resultNote}>Per ogni €1 investito in Ristowai</p>
              </div>
            </div>
          </div>

          <div ref={ctaRef} className={styles.footer}>
            <p className={styles.disclaimer}>
              Stime basate su risultati documentati in implementazioni di catene di ristorazione. I risparmi effettivi dipendono dalla maturità operativa e dalla disponibilità dei dati.
            </p>
            <button type="button" className={styles.ctaButton}>
              <span>Scopri i tuoi numeri reali</span>
              <ArrowUpRight size={20} />
            </button>
            <p className={styles.caption}>
              Calcoleremo il tuo potenziale di risparmio esatto in una call di 30 minuti.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
