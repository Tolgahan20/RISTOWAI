"use client";

import { useEffect, useRef, useState } from "react";
import { Hero } from "@/components/landing-page/sections/hero";
import { Features } from "@/components/landing-page/sections/features";
import { MarketStats } from "@/components/landing-page/sections/market-stats";
import { HowItWorks } from "@/components/landing-page/sections/how-it-works";
import { Pricing } from "@/components/landing-page/sections/pricing";
import { WaitingList } from "@/components/landing-page/sections/waiting-list";
import { FAQ } from "@/components/landing-page/sections/faq";
import { CallToAction } from "@/components/landing-page/sections/call-to-action";
import { Footer } from "@/components/landing-page/sections/footer";
import { DesktopNav, MobileNav } from "@/components/landing-page/layout";
import { SmoothScroll } from "@/components/landing-page/providers/SmoothScroll";
import gsap from "gsap";
import styles from "./page.module.css";

export default function Home() {
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [showReveal, setShowReveal] = useState(true);

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
      onComplete: () => setShowReveal(false),
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
      {showReveal && (
        <div ref={revealRef} className={styles.pageReveal}>
          <div className={styles.revealLeft}></div>
          <div className={styles.revealRight}></div>
        </div>
      )}
      <div className="nav-fixed">
        <DesktopNav />
        <MobileNav />
      </div>
      <SmoothScroll>
        <div ref={contentRef} className={styles.pageContent}>
          <main className={styles.main}>
            <Hero />
            <Features />
            <div className={styles.marketStats}>
              <MarketStats />
            </div>
            <HowItWorks />
            <Pricing />
            <div className={styles.waitingList}>
              <WaitingList />
            </div>
            <div className={styles.marketStats}>
              <FAQ />
            </div>
            <CallToAction />
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </>
  );
}
