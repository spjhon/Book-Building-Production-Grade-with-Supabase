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





export function ForgotPasswordForm({
  className,
  //tenant,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {




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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {redirectTo: `${window.location.origin}/auth/update-password`});

      if (error) throw error;
      //4.
      setSuccess(true);

      //5.
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ah ocurrido un error");
    } finally {
      setIsLoading(false);
    }
    
  };

  return (

    //6.
    <div className={cn("flex flex-col gap-6 border border-black rounded-xs", className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reviza tu correo electronico</CardTitle>
            <CardDescription>Instrucciones para el reseteo de la constraseña fueron enviados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Si eres un usuario registrado, va a llegar el link al correo registrado
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Resetea tu contraseña</CardTitle>
            <CardDescription>
              Ingresa el correo electronico registrado
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
                    placeholder="m@ejemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar correo de reseteo"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Ya tiene una cuenta?{" "}
                <Link
                  href={`/auth/login`}
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
