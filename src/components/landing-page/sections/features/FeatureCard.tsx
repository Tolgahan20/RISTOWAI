'use client';

import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import styles from './feature-card.module.css';

// Import animations directly
import smartShiftsAnimation from '../../../../../public/animations/smart_shifts.json';
import foodBrainAnimation from '../../../../../public/animations/food_brain.json';
import staffProAnimation from '../../../../../public/animations/staff_pro.json';
import hrSmartAnimation from '../../../../../public/animations/hr_smart.json';
import marketingReviewsAnimation from '../../../../../public/animations/marketing_reviews.json';
import managerDashboardAnimation from '../../../../../public/animations/manager_dashboard.json';

const animationMap = {
  'smart_shifts': smartShiftsAnimation,
  'food_brain': foodBrainAnimation,
  'staff_pro': staffProAnimation,
  'hr_smart': hrSmartAnimation,
  'marketing_reviews': marketingReviewsAnimation,
  'manager_dashboard': managerDashboardAnimation,
};

interface FeatureCardProps {
  title: string;
  description: string;
  animation: keyof typeof animationMap;
  features: string[];
  index: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  animation,
  features,
  index
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (lottieRef.current) {
        lottieRef.current.destroy();
      }
    };
  }, []);

  return (
    <div ref={cardRef} className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <ul className={styles.featureList}>
          {features.map((feature, i) => (
            <li key={i} className={styles.featureItem}>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.animationWrapper}>
        <div className={styles.animationContainer}>
          <div className={styles.animation}>
            <Lottie
              lottieRef={lottieRef}
              animationData={animationMap[animation]}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid slice'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};