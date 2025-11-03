'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/features/smart-shifts/onboarding/hooks/useOnboarding';
import { WelcomeScreen } from '@/features/smart-shifts/onboarding/components/WelcomeScreen';
import { OnboardingWizard } from '@/features/smart-shifts/onboarding/components/OnboardingWizard';
import { tokenService } from '@/features/smart-shifts/auth/services/token.service';
import styles from './page.module.css';

export default function OnboardingPage() {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!tokenService.isAuthenticated()) {
      void router.push('/login' as any);
    }
  }, [router]);

  const handleStart = () => {
    setHasStarted(true);
    setShowWelcome(false);
  };

  // Only show welcome screen initially
  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  // After welcome screen, show the wizard which will handle session fetching
  if (hasStarted) {
    return <OnboardingWizardWrapper />;
  }

  return null;
}

// Separate component that uses useOnboarding hook
function OnboardingWizardWrapper() {
  const router = useRouter();
  const { session, isLoading } = useOnboarding();

  useEffect(() => {
    if (session?.isCompleted) {
      void router.push('/dashboard' as any);
    }
  }, [session, router]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (session) {
    return <OnboardingWizard session={session} />;
  }

  return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
    </div>
  );
}
