import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapSupabaseAuthError(error: string) {
  switch (error) {
    case "AuthSessionMissingError":
      return "No hay datos de usuario"

    default:
      return "No se pudo completar la operación"
  }
}