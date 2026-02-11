'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/auth/checkAdmin').then(res => {
      if (!res.ok) {
        router.replace('/main/auth/login');
      }
    });
  }, [router]);

  return children;
}
