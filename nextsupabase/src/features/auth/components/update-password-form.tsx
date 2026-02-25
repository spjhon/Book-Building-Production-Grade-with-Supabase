"use client";

import { cn, mapSupabaseAuthError } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";


interface UpdatePasswordFormProps
  extends React.ComponentPropsWithoutRef<"div"> {
  tenant: string;
}




export function UpdatePasswordForm({
  className,
  ...props
}: UpdatePasswordFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


/**
 * Update Password Form (Client Component)
 * --------------------------------------
 * Este componente permite a los usuarios establecer una nueva contraseña una vez que han 
 * accedido al sistema mediante un enlace de recuperación. Es la fase final del flujo de reset.
 * * @param {string} tenant - Identificador de la organización para redirigir al usuario tras el éxito.
 * * Datos:
 * - 'password': Estado local que almacena la nueva cadena de caracteres ingresada.
 * - 'error': Maneja mensajes de fallo, utilizando 'mapSupabaseAuthError' para clarificar el feedback.
 * - 'isLoading': Estado booleano para gestionar el feedback visual durante la petición asíncrona.
 * * Flujo:
 * 1. Inicializa el router de Next.js y el cliente de Supabase para operaciones en el navegador.
 * 2. Captura el evento del formulario, resetea errores previos y activa el estado de carga.
 * 3. Ejecuta 'supabase.auth.updateUser', actualizando la propiedad de contraseña del usuario activo.
 * 4. Tras una actualización exitosa, redirige automáticamente al dashboard de tickets del tenant.
 * 5. Implementa un bloque catch que mapea errores técnicos a mensajes legibles o personalizados.
 * 6. Renderiza una interfaz de tarjeta con campos validados y botones de acción con estado dinámico.
 * * @return JSX.Element - Un formulario seguro para la actualización de credenciales.
 */

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createSupabaseBrowserClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push(`/tickets`);
    } catch (error: unknown) {
      setError(error instanceof Error ? mapSupabaseAuthError(error.name) : "Ha ocurrido un error, yuka");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save new password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
