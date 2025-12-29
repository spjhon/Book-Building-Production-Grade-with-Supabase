"use client"

import { cn } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type LoginProps = React.ComponentPropsWithoutRef<"div"> & {
  isPasswordLogin?: boolean;
};

export const LoginForm = ({ className, isPasswordLogin, ...props }: LoginProps) => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

console.log("se ha renderizado")



 const supabase = createSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.refresh();
      }
    });
  

  const passwordField = (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label htmlFor="password">Password</Label>
        <Link
          href="/auth/forgot-password"
          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
        >
          Forgot your password?
        </Link>
      </div>
      <Input
        id="password"
        type="password"
        name="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );





  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Esto viene primero");
    const supabase = createSupabaseBrowserClient();
    setIsLoading(true);
    setError(null);

    const valorPromesa = await new Promise(resolve => setTimeout(() => resolve("esto viene de la promesa"), 1000))

    console.log(valorPromesa)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/tickets");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };








  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} action="/auth/login-magic-link/api" method="POST">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {isPasswordLogin && passwordField}
              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full">
                {!isLoading ? ( isPasswordLogin? "Login with Password": "Login with Magic Link"): ""}
                {isLoading? "Entrando": ""}
              </Button>

              {/* Toggle */}
              <p className="mt-4 text-center text-sm">
                {isPasswordLogin ? (
                  <Link href={{ pathname: "/auth/login", query: { magicLink: "yes" } }}>
                    Use Magic Link Instead
                  </Link>
                ) : (
                  <Link href={{ pathname: "/auth/login", query: { magicLink: "no" } }}>
                    Use Password Instead
                  </Link>
                )}
              </p>
            </div>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
