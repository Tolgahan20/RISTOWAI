"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Hero } from "@/components/about-page/sections/hero";
import { Vision } from "@/components/about-page/sections/vision";
import { Team } from "@/components/about-page/sections/team";
import { DesktopNav, MobileNav } from "@/components/landing-page/layout";
import { SmoothScroll } from "@/components/landing-page/providers/SmoothScroll";
import styles from "./page.module.css";
import Footer from "@/components/landing-page/sections/footer";

export default function AboutPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const reveal = revealRef.current;

    if (!content || !reveal) return;

    // Initial state
    gsap.set(content, {
      visibility: "visible",
      opacity: 0,
    });

    // Create the reveal animation
    const tl = gsap.timeline({
      defaults: { duration: 1.2, ease: "power4.inOut" },
      onComplete: () => reveal.remove(),
    });

    tl.to(
      `.${styles.revealLeft}`,
      {
        xPercent: -100,
        yPercent: -100,
      },
      0
    )
      .to(
        `.${styles.revealRight}`,
        {
          xPercent: 100,
          yPercent: 100,
        },
        0
      )
      .to(
        content,
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6"
      );

    // Clean up
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <div ref={revealRef} className={styles.pageReveal}>
        <div className={styles.revealLeft}></div>
        <div className={styles.revealRight}></div>
      </div>
      <div className="nav-fixed">
        <DesktopNav />
        <MobileNav />
      </div>
      <SmoothScroll>
        <div ref={contentRef} className={styles.pageContent}>
          <main className={styles.main}>
            <Hero />
            <Vision />
            <Team />
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </>
  );
}

