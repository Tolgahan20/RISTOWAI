'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenService } from '@/features/smart-shifts/auth/services/token.service';
import { DashboardLayout } from '@/components/dashboard/layout';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check authentication on mount and redirect if not authenticated
    if (!tokenService.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  // If not authenticated, don't render anything (will redirect)
  if (!tokenService.isAuthenticated()) {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

