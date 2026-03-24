// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function refreshData(path: string) {
  // Aquí podrías validar permisos si quisieras
  revalidatePath(path)
}