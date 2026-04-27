import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("Not-Found");

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background px-4 text-center">
      {/* El "404" usando el color primary de shadcn */}
      <h1 className="text-[8rem] md:text-[10rem] font-extrabold leading-none text-primary tracking-tighter">
        404
      </h1>

      <h2 className="mt-4 text-2xl md:text-3xl font-bold text-foreground">
        {t("notfound_title")}
      </h2>

      <p className="mt-4 mb-8 max-w-[500px] text-lg text-muted-foreground">
        {t("notfound_description")}
      </p>

      {/* Botón original de shadcn */}
      <Button asChild size="lg" className="font-bold">
        <Link href="http://127.0.0.1:3000" >
          {t("notfound_button")}
        </Link>
      </Button>

      {/* Decoración sutil de fondo (opcional) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-20"></div>
    </div>
  );
}
