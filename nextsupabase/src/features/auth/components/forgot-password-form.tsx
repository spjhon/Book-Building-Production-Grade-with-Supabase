"use client";

import { cn } from "@/lib/utils";
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
import Link from "next/link";
import { useState } from "react";


interface ForgotPasswordFormProps
  extends React.ComponentPropsWithoutRef<"div"> {
  tenant: string;
}

/**
 * ForgotPasswordForm (Client Component)
 * ------------------------------------
 * Este componente gestiona la solicitud de recuperación de contraseña. Permite a los usuarios 
 * ingresar su correo electrónico para recibir un enlace de restablecimiento vinculado al tenant.
 * * @param {string} tenant - El identificador del tenant para construir la URL de redirección.
 * * Datos:
 * - Estados locales para manejar el 'email', mensajes de 'error', estado de 'success' y carga ('isLoading').
 * - Utiliza el método 'resetPasswordForEmail' de Supabase Auth.
 * * Flujo:
 * 1. Captura el envío del formulario y previene el comportamiento por defecto.
 * 2. Inicializa el cliente de Supabase y gestiona los estados de carga y error previos.
 * 3. Ejecuta la petición de recuperación definiendo una 'redirectTo' dinámica basada en el tenant actual.
 * 4. Maneja el éxito de la operación activando la vista de confirmación (estado success).
 * 5. Captura y despliega errores en caso de fallos en la comunicación con el backend.
 * 6. Renderiza condicionalmente el formulario o el mensaje de éxito basado en el estado del proceso.
 * * @return JSX.Element - Un formulario de recuperación o un mensaje de instrucciones enviado.
 */


export function ForgotPasswordForm({
  className,
  tenant,
  ...props
}: ForgotPasswordFormProps) {




  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    //1.
    e.preventDefault();

    //2.
    const supabase = createSupabaseBrowserClient();
    setIsLoading(true);
    setError(null);

    try {
      // 3. The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;
      //4.
      setSuccess(true);

      //5.
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
    
  };

  return (

    //6.
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
              Type in your email and we&apos;ll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset email"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href={`/${tenant}/auth/login`}
                  className="underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
