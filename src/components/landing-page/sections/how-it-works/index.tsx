'use client';

import React, { useEffect, useRef } from 'react';
import styles from './how-it-works.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'react-feather';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '1',
    title: 'Crea il tuo account',
    description: 'Registrati in meno di 1 minuto, senza carta di credito.'
  },
  {
    number: '2',
    title: 'Inserisci i dati del locale',
    description: 'Compila il preform guidato (<30 min).',
    note: 'Oppure lascia fare a noi: Chiedi Onboarding'
  },
  {
    number: '3',
    title: 'Attiva la soluzione AI',
    description: 'Scegli il modulo che ti serve e inizia subito.'
  }
];

export const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const title = titleRef.current;
    const progress = progressRef.current;
    const cards = cardsRef.current;

    if (!section || !container || !title || !progress || cards.length === 0) return;

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

    // Title animation
    gsap.from(title, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
      }
    });

    // Progress line animation
    gsap.from(progress, {
      scaleX: 0,
      duration: 1.5,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: progress,
        start: 'top 70%',
      }
    });

    // Progress points animation
    gsap.from(progress.children, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: 'back.out(1.7)',
      delay: 0.5,
      scrollTrigger: {
        trigger: progress,
        start: 'top 70%',
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
    <section id="how-it-works" ref={sectionRef} className={styles.section} data-section="white">
      <div ref={containerRef} className={styles.container}>
        <div className={styles.innerContainer}>
          <div ref={titleRef} className={styles.titleContainer}>
            <h2 className={styles.title}>Registrati, Gestisci e Opera</h2>
            <p className={styles.subtitle}>Ti accompagniamo dal primo passo fino a oltre</p>
          </div>
          
          <div className={styles.stepsContainer}>
            <div ref={progressRef} className={styles.progressLine}>
              {steps.map((_, index) => (
                <div key={index} className={styles.progressPoint} />
              ))}
            </div>
            
            <div className={styles.steps}>
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div 
                    ref={el => {
                      if (el) {
                        cardsRef.current[index] = el;
                      }
                    }}
                    className={styles.stepCard}
                  >
                    <div className={styles.stepHeader}>
                      <span className={styles.stepNumber}>{step.number}</span>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                    </div>
                    <p className={styles.stepDescription}>{step.description}</p>
                    {step.note && (
                      <a 
                        href="mailto:info@ristowai.com?subject=Richiesta%20Onboarding%20Locale&body=Ciao%2C%20sono%20%5BNome%20Locale%5D%20e%20mi%20servirebbe%20onboarding%20locale.%20Grazie."
                        className={styles.stepNote}
                      >
                        {step.note}
                      </a>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={styles.arrowContainer}>
                      <ChevronDown size={32} className={styles.arrow} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};