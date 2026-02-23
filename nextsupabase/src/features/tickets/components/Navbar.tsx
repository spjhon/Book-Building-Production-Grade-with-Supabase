"use client";

//Importacion de los componentes de shadcn
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Megaphone } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

import { usePathname } from "next/navigation";
import { LogoutButton } from "@/features/tickets/components/LogoutButton";

//Props para la barra de navegacion
export interface RouteProps {
  href: string;
  label: string;
}

interface NavbarProps {
  tenant: string;
}


/**
 * Navbar Component (Client Component)
 * ----------------------------------
 * Proporciona la interfaz de navegación principal de la aplicación, adaptando los enlaces 
 * dinámicamente según el tenant activo y resaltando la ruta actual.
 *
 * * * @param {string} tenant - Identificador de la organización para construir las rutas de navegación.
 * * * Datos:
 * - 'routeList': Matriz de objetos que define las rutas disponibles (Tickets, New Ticket, Users).
 * - 'isActive': Lógica booleana que compara el 'pathname' actual con la ruta del enlace.
 * - Utiliza componentes de 'shadcn/ui' (NavigationMenu) y 'lucide-react' (Megaphone).
 * * * Flujo:
 * 1. Obtiene la ruta actual del navegador mediante el hook 'usePathname'.
 * 2. Construye dinámicamente la lista de rutas inyectando el ID del tenant en cada URL.
 * 3. Renderiza un encabezado con efecto de desenfoque (backdrop-blur) y posicionamiento fijo (sticky).
 * 4. Itera sobre la lista de rutas para generar enlaces, aplicando variantes de botón 
 * (default vs outline) según el estado de activación.
 * 5. Posiciona el menú de navegación de forma absoluta y centrada en pantallas de escritorio.
 * 6. Integra el 'LogoutButton' y elementos de utilidad en el extremo derecho de la barra.
 * * * @return JSX.Element - Una barra de navegación persistente, responsiva y contextualizada.
 */



export const Navbar = ({tenant}: NavbarProps) => {

  const pathname = usePathname();
  
  

  const routeList: RouteProps[] = [
    {
      href: `/${tenant}/tickets`,
      label: "Ticket List",
    },
    {
      href: `/${tenant}/tickets/new`,
      label: "New Ticket",
    },
    {
      href: `/${tenant}/tickets/users`,
      label: "Users",
    },
  ];


  return (
    <header className="bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0 sticky border-b top-0 z-40 dark:border-b-slate-700 dark:bg-background">
      <div className="container flex flex-row justify-between items-center mx-auto relative">
        <Link
          rel="noreferrer noopener"
          href={`/${tenant}`}
          className="ml-2 font-bold text-xl"
        >
          {"Tenant de acuerdo al libro"}
        </Link>

        <NavigationMenu className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <NavigationMenuList className="">
            {/* desktop */}
            <nav className="hidden xl:flex gap-6">
              {routeList.map((route, i) => {
                const isActive = pathname === route.href;

                return (
                  <Link
                    href={route.href}
                    key={i}
                    className={`${buttonVariants({
                      variant: isActive ? "default" : "outline",
                    })} text-[17px] font-bold!`}
                  >
                    {route.label}
                  </Link>
                );
              })}
            </nav>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden xl:flex gap-2">
          <Megaphone></Megaphone>
          <LogoutButton tenant = {tenant}></LogoutButton>
        </div>
      </div>
    </header>
  );
};


