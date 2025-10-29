'use client';

import React, { useEffect, useRef } from 'react';
import styles from './waiting-list.module.css';
import { ArrowUpRight } from 'react-feather';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const WaitingList = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const disclaimerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const stats = statsRef.current;
    const number = numberRef.current;
    const note = noteRef.current;
    const button = buttonRef.current;
    const disclaimer = disclaimerRef.current;

    if (!section || !container || !title || !subtitle || !stats || !number || !note || !button || !disclaimer) return;

    // Check if mobile
    const isMobile = window.innerWidth <= 1024;

    // Container expansion animation (works on both mobile and desktop)
    const containerTl = gsap.timeline({
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
    gsap.set([title, subtitle, stats, number, note, button, disclaimer], {
      opacity: 1,
      y: 0,
      scale: 1
    });

    // Content animations
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

    gsap.from(subtitle, {
      y: 40,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: subtitle,
        start: 'top 80%',
      },
    });

    // Number counter animation
    gsap.to(number, {
      textContent: 327,
      duration: 2,
      ease: 'power1.out',
      snap: { textContent: 1 },
      onUpdate: function() {
        if (number) {
          number.innerHTML = Math.ceil(parseFloat(number.textContent || '0')).toString();
        }
      },
      scrollTrigger: {
        trigger: number,
        start: 'top 80%',
      },
    });

    // Stats container animation
    gsap.from(stats, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: stats,
        start: 'top 80%',
      },
    });

    // Bottom content animations
    const bottomElements = [note, button, disclaimer];
    bottomElements.forEach((el, index) => {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.1 * index,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="waiting-list" ref={sectionRef} className={styles.section} data-section="dark">
      <div ref={containerRef} className={styles.container}>
        <div className={styles.innerContainer}>
          <h2 ref={titleRef} className={styles.title}>Lista d'attesa</h2>
          <p ref={subtitleRef} className={styles.subtitle}>
            Unisciti ai primi locali che trasformeranno la loro gestione con l'AI
          </p>

          <div ref={statsRef} className={styles.statsContainer}>
            <div ref={numberRef} className={styles.statsNumber}>327</div>
            <div className={styles.statsLabel}>locali già in lista</div>
          </div>

          <p ref={noteRef} className={styles.note}>
            Posti limitati: entra ora per non perdere l'accesso anticipato.
          </p>

          <button ref={buttonRef} className={styles.button}>
            <div className={styles.buttonInner}>
              <span className={styles.buttonText} data-hover="Unisciti alla lista">
                Unisciti alla lista
              </span>
            </div>
            <ArrowUpRight className={styles.buttonIcon} size={20} />
          </button>

          <p ref={disclaimerRef} className={styles.disclaimer}>
            Il tuo posto in lista è riservato. Nessun pagamento richiesto. Verrai ricontattato dal nostro team.
          </p>
        </div>
      </div>
    </section>
  );
};
