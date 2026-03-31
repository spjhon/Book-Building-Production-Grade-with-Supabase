
"use server"
import { Locale } from "next-intl";
import { cookies } from "next/headers";

export async function changeLocaleAction(locale: Locale) {
    
    const store = await cookies();
    store.set('NEXT_LOCALE', locale);
  }