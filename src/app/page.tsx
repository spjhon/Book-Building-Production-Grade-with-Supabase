import { LogoMarquee } from "@/features/LandingPage/LogoMarquee";
import {
  
  ArrowRight,
 
  Github,
  Globe,
  
  Linkedin,
 
  
} from "lucide-react";
import Link from "next/link";




import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/features/LocaleSwitcher/LocaleSwitchers";
import { changeLocaleAction } from "@/lib/server_actions/language";
import { getFeatures } from "./data/dummyData";


export default function Home() {
  const t = useTranslations("LandingPage");

  // Definimos los tenants para iterarlos fácilmente
  const tenants = ["acme", "globex", "initech", "umbrella"];

  // En local usamos nuestro dominio base con el puerto
  // En producción podrías cambiar esto por process.env.NEXT_PUBLIC_ROOT_DOMAIN
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  const features = getFeatures(t);

  const stats = [
    { label: t("stats_label_1"), value: t("stats_value_1") },
    { label: t("stats_label_2"), value: t("stats_value_2") },
    { label: t("stats_label_3"), value: t("stats_value_3") },
    { label: t("stats_label_4"), value: t("stats_value_4") },
  ];

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-4">
            {/* Lado Izquierdo: Logo */}
            <div className="shrink-0 min-w-fit">
              <span className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-600 to-primary-500 bg-clip-text text-transparent whitespace-nowrap">
                SupaSass
              </span>
            </div>

            {/* Lado Derecho: Links comprimibles */}
            <div className="flex items-center gap-3 sm:gap-6 md:gap-8 overflow-hidden">
              <LocaleSwitcher changeLocaleAction={changeLocaleAction} />
              <Link
                prefetch={false}
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap transition-colors"
              >
                {t("nav_features")}
              </Link>

              <Link
                prefetch={false}
                href="https://github.com/spjhon/Book-Building-Production-Grade-with-Supabase"
                className="inline-flex items-center gap-2 text-sm font-medium text-black hover:opacity-70 transition-all whitespace-nowrap"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative mt-40 mb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Next js - Supabase
              <span className="block text-primary-600">DEMO</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              {t("hero_description")}
            </p>
            <div className="mt-10 flex gap-4 justify-center"></div>
          </div>
        </div>
      </section>

      {/* Sección de Selección de Organización */}
      <section className="my-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("tenants_title")}{" "}
              <span className="bg-linear-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                {t("tenants_organization")}
              </span>
            </h2>
            <p className="mt-4 text-gray-500">{t("tenants_description")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tenants.map((tenant) => (
              
                <Link
                  prefetch={true}
                  key={tenant}
                  href={`http://${tenant}.${rootDomain}/auth/login`}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20"
                >
                  {/* Decoración sutil de fondo al hacer hover */}
                  <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />

                  <div className="relative flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Globe className="h-6 w-6" />
                    </div>

                    <h3 className="text-lg font-bold capitalize text-gray-900 group-hover:text-primary transition-colors">
                      {tenant}
                    </h3>

                    <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                      {t("tenants_go_to_portal")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
             
            ))}
          </div>
        </div>
      </section>

      <section className="my-20 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">{t("features_title")}</h2>
            <p className="mt-4 text-xl text-gray-600">
              {t("features_description")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LogoMarquee></LogoMarquee>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("cta_title")}
          </h2>
          <p className="mt-4 text-xl opacity-90">{t("cta_description")}</p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              prefetch={false}
              href="https://www.linkedin.com/in/aristizabaljuan/"
              target="_blank"
              className="px-8 py-4 rounded-xl bg-background text-foreground font-bold hover:bg-secondary transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              {t("cta_linkedin")}
            </Link>

            <Link
              prefetch={false}
              href="https://github.com/spjhon"
              target="_blank"
              className="px-8 py-4 rounded-xl border-2 border-primary-foreground text-primary-foreground font-bold hover:bg-primary-foreground/10 transition-all active:scale-95"
            >
              {t("cta_github")}
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                {t("footer_product")}
              </h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    prefetch={false}
                    href="#features"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {t("footer_features")}
                  </Link>
                </li>
                <li>
                  <Link
                    prefetch={false}
                    href="https://github.com/spjhon/Book-Building-Production-Grade-with-Supabase"
                    className="inline-flex items-center gap-2 text-sm font-medium text-black hover:opacity-70 transition-all whitespace-nowrap"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Recursos</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    prefetch={false}
                    href="https://github.com/spjhon/Book-Building-Production-Grade-with-Supabase"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {t("footer_docs")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              prefetch={false}
              href="https://www.linkedin.com/in/aristizabaljuan/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto inline-flex items-center gap-2 text-sm font-medium text-black hover:opacity-70 transition-all group"
            >
              <Linkedin className="w-4 h-4 text-[#0A66C2] group-hover:scale-110 transition-transform" />
              <span>
                {" "}
                {new Date().getFullYear()} {"Juan Camilo Patiño Aristizabal"}.{" "}
                {t("footer_copyright")}
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
