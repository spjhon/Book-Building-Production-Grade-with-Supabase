import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"





/**
 * Utility Functions (Shared Helpers)
 * ---------------------------------
 * Conjunto de funciones auxiliares diseñadas para optimizar la gestión de estilos 
 * dinámicos y la estandarización de mensajes de error de autenticación.
 *
 * * * * Datos:
 * - 'clsx': Utilidad para construir condicionalmente cadenas de clases de CSS.
 * - 'twMerge': Herramienta que resuelve conflictos de clases de Tailwind CSS (prioriza la última declarada).
 * - 'error': Identificador técnico del error retornado por el SDK de Supabase Auth.
 * * * * Flujo:
 * 1. Función 'cn': Recibe múltiples argumentos de clase, los limpia con 'clsx' y los fusiona con 'twMerge' 
 * para garantizar que no haya estilos duplicados o contradictorios en el DOM.
 * 2. Función 'mapSupabaseAuthError': Actúa como un traductor de excepciones técnicas a lenguaje humano.
 * 3. Evalúa mediante un 'switch' casos específicos como 'AuthSessionMissingError' para retornar mensajes amigables.
 * 4. Proporciona una respuesta por defecto para errores no mapeados, manteniendo la consistencia en la interfaz.
 * * * * @return {string} - Retorna una cadena de clases optimizada o un mensaje de error legible.
 */


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