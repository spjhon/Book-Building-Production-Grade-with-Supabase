"use client";

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
import { enviarEmailRecuperacionContrasena } from "@/lib/server_actions/emails";

interface ForgotPasswordFormProps {
  tenant: string;
}

import { useTranslations } from "next-intl";

export function ForgotPasswordForm({ tenant }: ForgotPasswordFormProps) {
  const t = useTranslations("ForgotPasswordForm");

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await enviarEmailRecuperacionContrasena(
        email,
        tenant,
      );

      if (!data || error) {
        throw new Error("Error al crear el link y enviarlo: " + error);
      }

      setSuccess(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Error enviando el link de recuperacin de contraseña";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    //6.
    <div className="flex flex-col gap-6 border border-black rounded-xs">
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {t("forgot_password_success_title")}
            </CardTitle>
            <CardDescription>
              {t("forgot_password_success_description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("forgot_password_success_note")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {t("forgot_password_header_title")}
            </CardTitle>
            <CardDescription>
              {t("forgot_password_header_description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("label_email")}</Label>
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
                  {isLoading ? t("btn_sending") : t("btn_send_reset_email")}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {t("already_have_account")}{" "}
                <Link
                 
                  href={`/auth/login`}
                  className="underline underline-offset-4"
                >
                  {t("login_link")}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// `${window.location.origin}/auth/update-password`}
