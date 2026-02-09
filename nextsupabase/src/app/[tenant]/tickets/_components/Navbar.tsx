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
import { LogoutButton } from "@/app/[tenant]/tickets/_components/LogoutButton";

//Props para la barra de navegacion
export interface RouteProps {
  href: string;
  label: string;
}

interface NavbarProps {
  tenant: string;
}

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
          <LogoutButton></LogoutButton>
        </div>
      </div>
    </header>
  );
};


