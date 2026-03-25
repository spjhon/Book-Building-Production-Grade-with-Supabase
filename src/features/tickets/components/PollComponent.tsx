



'use client'

import { refreshData } from '@/lib/server_actions/revalidatePath';
import { usePathname } from 'next/navigation'; // Importa usePathname
import { useEffect } from 'react';

export function BackgroundValidator() {
  const pathname = usePathname(); // Obtenemos la ruta actual

  useEffect(() => {
    // Ahora esto se activará cada vez que la URL cambie
    console.log("Se activó el useEffect porque cambiaste a la página:", pathname);
    refreshData("/tickets/users")
    
    // Aquí podrías poner tu lógica de validación o refresh
    
  }, [pathname]); // Dependemos de pathname, no de router

  return null;
}