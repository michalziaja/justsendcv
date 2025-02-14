'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Przekierowanie do /auth
    router.push('/auth');
  }, [router]);

  return null; // Możesz również dodać komunikat ładowania, jeśli chcesz
}
