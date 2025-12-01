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

type LoginProps = React.ComponentPropsWithoutRef<"div"> & {
  isPasswordLogin?: boolean;
};

export const Login = ({ className, isPasswordLogin, ...props }: LoginProps) => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("hola");
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
          <form onSubmit={handleLogin}>
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

              {isPasswordLogin && passwordField}

              <Button type="submit" className="w-full">
                {isPasswordLogin
                  ? "Login with Password"
                  : "Login with Magic Link"}
              </Button>
              {/* Toggle */}
              <p className="mt-4 text-center text-sm">
                {isPasswordLogin ? (
                  <Link href={{ pathname: "/", query: { magicLink: "yes" } }}>
                    Use Magic Link Instead
                  </Link>
                ) : (
                  <Link href={{ pathname: "/", query: { magicLink: "no" } }}>
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
