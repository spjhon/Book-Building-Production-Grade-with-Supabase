import { LoginForm } from "@/features/auth/components/LoginForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "@/features/LocaleSwitcher/LocaleSwitchers";
import { changeLocaleAction } from "@/lib/server_actions/language";

/**
 * This is a server component that handles rendering the login page (the login is in its own separate component).
 * @param param0 The parameters that arrive via the URL
 * @returns The login page.
 */
export default async function Login({
  searchParams,
  params,
}: {
  searchParams: Promise<{ magicLink: string }>;
  params: Promise<{ tenant: string }>;
}) {



  
  const t = await getTranslations("LoginPage");

  //Parameter extraction and search parameters.
  const { tenant } = await params;
  const { magicLink } = await searchParams;

  //If the parameter brings the magic link as true, it is passed to the component to render the appropriate component.
  const wantsMagicLink = magicLink === "yes";

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();

  //If a user already exists, instead of continuing with the login rendering, the redirection to the protected area is performed.
  if (data?.claims) {
    redirect(`/tickets`);
  }

  const testimonials = [
    {
      quote: t("testimonial_1_quote"),
      author: t("testimonial_1_author"),
      role: t("testimonial_1_role"),
      avatar: "01",
    },
    {
      quote: t("testimonial_2_quote"),
      author: t("testimonial_2_author"),
      role: t("testimonial_2_role"),
      avatar: "02",
    },
    {
      quote: t("testimonial_3_quote"),
      author: t("testimonial_3_author"),
      role: t("testimonial_3_role"),
      avatar: "03",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Login area along with the button to return to the landing page */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 bg-white relative">
        <div className=" self-center my-10 flex items-center gap-6 ">
          {/* El Switcher de idioma */}
          <LocaleSwitcher changeLocaleAction={changeLocaleAction} />

          {/* El separador visual (opcional, puedes borrarlo si no te gusta) */}
          <div className="w-px h-4 bg-slate-200" />

          {/* Enlace de regreso */}
          <Link
           
            href="https://tiendadelamujer.com/"
            className="flex items-center text-sm font-medium text-black hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back_to_landing")}
          </Link>
        </div>

        <div className="">
          {/* Texto en negro sólido */}
          <h2 className="text-center text-3xl font-bold tracking-tight text-black">
            {"SupaSass"}
          </h2>
        </div>

        <div className="w-100 self-center my-5">
          <LoginForm
            isPasswordLogin={!wantsMagicLink}
            tenant={tenant}
          ></LoginForm>
        </div>
      </div>

      {/* Second half of the screen, with explanations of how the login works */}
      <div className="flex w-full lg:w-1/2 bg-linear-to-br from-primary-600 to-primary-800  justify-center ">
        <div className="w-full flex items-center justify-center p-8 sm:p-12">
          <div className="space-y-6 max-w-lg">
            <h3 className="text-2xl font-bold mb-8">
              {t("login_system_title")}
            </h3>

            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary-400/30 flex items-center justify-center  font-semibold">
                      {testimonial.avatar}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm  mb-2 font-light leading-relaxed">
                      {testimonial.quote}
                    </p>

                    <div className="mt-3">
                      <p className="text-sm font-medium ">
                        {testimonial.author}
                      </p>

                      <p className="text-sm text-primary-200">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-8 text-center">
              <p className="text-primary-100 text-sm">
                {t("demo_account_notice")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
