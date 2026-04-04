
import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  
  // 1. Prioridad máxima: La cookie que tú seteas en el Server Action
  // 2. Fallback: El idioma por defecto de tu app
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  
  const messages = (await import(`../../messages/${locale}.json`)).default;

  

  return {
    locale,
    messages
  };
});






/** 
import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async () => {
  // Static for now, we'll change this later
  const locale = 'en';
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});

*/