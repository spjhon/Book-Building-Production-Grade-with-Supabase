import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 1. Base y Títulos
  metadataBase: new URL('https://tiendadelamujer.com'), // Reemplaza con tu dominio real
  title: {
    default: "Demo SaaS | Multi-tenant Service Management",
    template: "%s | TicketFlow SaaS" 
  },
  description: "Next-generation B2B SaaS for service orders and ticket management, powered by Next.js and Supabase.",
  
  // 2. Configuración de Robots (SEO)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // 3. Keywords estratégicos (Stack & Features)
  keywords: [
    // Tech Stack
    'Next.js 16', 'React 19', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'TypeScript', 'Shadcn UI',
    // Supabase Specifics
    'Supabase Auth', 'Supabase Storage', 'Postgres Realtime', 'Edge Functions', 'RLS Security', 'Database Partitioning',
    // App Features
    'B2B SaaS', 'Multi-tenancy', 'Service Tickets', 'Work Orders', 'Role-Based Access Control', 'RBAC',
    // Infrastructure
    'Server Actions', 'Optimistic Updates', 'TanStack Query', 'Resend Email', 'Coolify', 'VPS Hosting',

    'Front-End Developer', 'Web Development', 'Next.js', 'React', 'JavaScript', 
      'TypeScript', 'HTML', 'CSS', 'SCSS', 'Tailwind CSS', 'Responsive Design', 
      'Web Design', 'User Interface', 'UI/UX', 'SEO', 'JavaScript Frameworks', 
      'Single Page Applications', 'Progressive Web Apps', 'API Integration', 
      'Git', 'Version Control', 'Web Performance', 'Accessibility', 'Cross-Browser Compatibility', 
      'Web Animations', 'CSS Grid', 'Flexbox', 'Mobile-First Design', 'Node.js', 'SSR', 
      'Static Site Generation', 'JAMstack', 'Webpack', 'Babel', 'ES6', 'Code Optimization', 
      'JavaScript Libraries', 'NPM', 'REST APIs', 'JSON', 'GraphQL', 'WebSockets', 
      'Figma', 'Adobe XD', 'Vercel', 'GitHub', 'Web Developer Tools', 'Testing', 'Cypress', 
      'Jest', 'Portfolio', 
      '@headlessui/react', 'clsx', 'eslint', 'eslint-plugin-import', 'eslint-plugin-react', 
      'eslint-plugin-tailwindcss', 'next-intl', 'next-themes', 'react-dom', 
      'react-intersection-observer', 'sharp', '@types/node', '@types/react', 
      '@types/react-dom', 'eslint-config-molindo', 'eslint-config-next', 'postcss', 
      'tailwindcss', 'typescript', 'Next.js 14', 'React 18', 'Intersection Observer', 
      'Headless UI', 'ESLint', 'PostCSS', 'Sharp Image Processing'
  ],

  // 4. Autoría y Generación
  authors: [{ name: 'Camilo' }, { name: 'Camilo Dev', url: 'https://camiloportfolio-nosc.onrender.com' }],
  creator: 'Camilo Aristizabal',
  publisher: 'Camilo Dev',
  generator: 'Next.js',
  applicationName: 'TicketFlow Manager',
  referrer: 'origin-when-cross-origin',

  // 5. Detección de Formatos
  formatDetection: {
    email: true,
    address: false, // Mejor desactivar si no es un e-commerce físico
    telephone: true,
  },

  // 6. OpenGraph (Para redes sociales como LinkedIn)
  openGraph: {
    title: 'TicketFlow SaaS - Professional Service Management',
    description: 'Scalable multi-tenant architecture with real-time updates and secure database isolation.',
    url: 'https://tiendadelamujer.com',
    siteName: 'TicketFlow SaaS',
    images: [
      {
        url: 'https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/4/supabase-icon-kpjasdqlnu8exakst6f44r.png/supabase-icon-5uqgeeqeknngv9las8zeef.png?_a=DATAiZAAZAA0', // Placeholder
        width: 1200,
        height: 630,
        alt: 'TicketFlow SaaS Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // 7. Twitter (X)
  twitter: {
    card: 'summary_large_image',
    title: 'TicketFlow SaaS | Built with Next.js & Supabase',
    description: 'Manage service orders with real-time database partitioning.',
    creator: '@CamiloAristizabal',
    images: ['https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/4/supabase-icon-kpjasdqlnu8exakst6f44r.png/supabase-icon-5uqgeeqeknngv9las8zeef.png?_a=DATAiZAAZAA0'], // Placeholder
  },

  // 8. Otros
  category: 'Technology',
  classification: 'SaaS Application',
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-[2592px] border border-gray-400 mx-auto`}
      >
        <NextIntlClientProvider>
          {children}
          <Toaster />
        </NextIntlClientProvider>
       
      </body>
    </html>
  );
}
