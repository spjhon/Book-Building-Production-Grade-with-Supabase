"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

export function LogoutButton() {

const t = useTranslations("LogoutButton");

  const router = useRouter();
  const handleLogout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();;

    
    router.push(`/tickets`);
   
  };

  return (
    <form
      method="POST"
      action={`/auth/logout/api`}
      onSubmit={handleLogout}
    >
      <button type="submit" className="secondary">
  {t("btn_logout")}
</button>
    </form>
  );
}
