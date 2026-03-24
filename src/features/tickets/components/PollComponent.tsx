








'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';

export function BackgroundValidator() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Chequea cada 20 segundos
    const interval = setInterval(() => {
      startTransition(() => {
        router.refresh(); 
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  return null; // Componente invisible
}
  