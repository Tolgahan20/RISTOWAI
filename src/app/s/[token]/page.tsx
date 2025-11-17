'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StaffPortalPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  useEffect(() => {
    // Auto-redirect to schedule page
    if (token) {
      router.push(`/s/${token}/schedule`);
    }
  }, [token, router]);

  return null; // Auto-redirects to schedule
}

