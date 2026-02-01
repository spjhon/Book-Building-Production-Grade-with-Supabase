"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Link
      role="button"
      href="/logout"
      prefetch={false}
      className="secondary"
      onClick={(event) => {
        event.preventDefault();
        logout();
      }}
    >
      Logout
    </Link>
  );
}
