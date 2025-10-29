'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Button } from '../../ui/button';
import styles from './hero.module.css';
import { ArrowUpRight } from 'react-feather';

export const Hero: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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
        buttonRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4',
      )
      .fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1 },
        '-=0.6',
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
            L&apos;AI che trasforma la tua ristorazione in un business più intelligente
          </h1>

          <p ref={subtitleRef} className={styles.subtitle}>
            Riduci i costi fino al 20%, aumenta i margini del +12% e risparmia tempo prezioso — senza cambiare i sistemi che già usi.
          </p>

          <Button
            ref={buttonRef}
            href="/demo"
            size="large"
            icon={<ArrowUpRight size={24} />}
          >
            Inizia Ora
          </Button>
        </div>

        <div ref={imageRef} className={styles.imageWrapper}>
          <Image
            src="/images/full_no_bg.png"
            alt="Enterprise AI Platform"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>
      </div>
    </section>
  );
};