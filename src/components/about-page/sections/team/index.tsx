'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Globe } from 'react-feather';
import Link from 'next/link';
import styles from './team.module.css';
import { UrlObject } from 'url';

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    name: 'Adriano Coodye',
    title: 'Founder & CEO',
    bio: [
      "Ho lavorato per anni nel mondo della ristorazione, gestendo team, turni e costi in prima persona. Da quell'esperienza è nata un'idea semplice ma potente: usare l'intelligenza artificiale non per complicare, ma per semplificare la vita di chi gestisce ogni giorno un locale.",
      'Con Ristowai voglio portare nelle mani dei ristoratori uno strumento concreto, pratico e intuitivo — capace di migliorare la vita delle persone e rendere la ristorazione più sostenibile, efficiente e umana.',
      "Ristowai è costruito in Italia, con una visione globale: tecnologia al servizio dell'esperienza, e non il contrario.",
    ],
    linkedin: 'https://linkedin.com/in/adrianocoodye',
  },
  {
    name: 'Tolgahan Dayanikli',
    title: 'CTO & Product Lead',
    bio: [
      "Ingegnere del software con una forte specializzazione in architetture scalabili e sistemi AI, mi occupo della progettazione tecnica e dello sviluppo dell'infrastruttura che sostiene Ristowai.",
      'Ho costruito il backend modulare e sicuro della piattaforma, progettato per garantire stabilità, protezione dei dati e integrazione fluida tra tutti i moduli di intelligenza artificiale.',
      "Il mio approccio unisce visione prodotto e rigore ingegneristico: ogni componente è pensato per crescere nel tempo, adattarsi alle esigenze del settore e supportare un'espansione internazionale senza compromessi di performance.",
      'Credo in una tecnologia discreta ma potente — progettata per restare invisibile e lasciare spazio al valore reale: semplificare il lavoro quotidiano dei ristoratori.',
    ],
    linkedin: 'https://linkedin.com/in/tolgahandayanikli',
    website: 'https://tolgahandayanikli.com',
  },
];

export const Team: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const memberRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;

    if (!section || !title) return;

    // Check if mobile
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
      gsap.set([title, ...memberRefs.current], { opacity: 1, y: 0 });
      return;
    }

    // Set initial state
    gsap.set([title, ...memberRefs.current], { opacity: 1, y: 0 });

    // Animate title
    gsap.from(title, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
      },
    });

    // Animate members
    memberRefs.current.forEach((member) => {
      if (member) {
        gsap.from(member, {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: member,
            start: 'top 80%',
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} data-section="white">
      <div className={styles.container}>
        <h2 ref={titleRef} className={styles.title}>Il Team</h2>
        
        <div className={styles.membersGrid}>
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              ref={el => { if (el) memberRefs.current[index] = el; }}
              className={styles.memberCard}
            >
              <div className={styles.memberHeader}>
                <div>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberTitle}>{member.title}</p>
                </div>
                <div className={styles.socialLinks}>
                  <Link 
                    href={member.linkedin as unknown as UrlObject} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <Linkedin size={24} />
                  </Link>
                  {member.website && (
                    <Link 
                      href={member.website as unknown as UrlObject} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <Globe size={24} />
                    </Link>
                  )}
                </div>
              </div>
              
              <div className={styles.memberBio}>
                {member.bio.map((paragraph, i) => (
                  <p key={i} className={styles.bioText}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.note}>
          <p className={styles.noteText}>
            Ristowai beneficia inoltre della consulenza esterna di professionisti specializzati in compliance legale, sicurezza dei dati e regolamentazione del settore alimentare, che hanno fornito contributi chiave e supporto strategico.
          </p>
        </div>
      </div>
    </section>
  );
};

