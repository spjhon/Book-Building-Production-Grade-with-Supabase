
//Importacion de los componentes de shadcn
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";


import { Megaphone } from "lucide-react";


//Importacion de iconos de radix y lucide
import { buttonVariants } from "@/components/ui/button";
import { MobileMenu } from './MobileMenu';
import Link from "next/link";
import { LogoutButton } from "../LogoutButton";
import TenantName from "../TenantName";





//Props para la barra de navegacion
export interface RouteProps {
  href: "/tickets" | "/tickets/new" | "/tickets/users";
  label: string;
}



export const Navbar = () => {

 console.log("se esta actualizando el componente navbar")

  const routeList: RouteProps[] = [
    {
    href: "/tickets",
    label: "Tickets",
  },
  {
    href: "/tickets/new",
    label: "Nuevo Ticket",
  },
  {
    href: "/tickets/users",
    label: "Usuarios",
  },
  
  
];
  
  return (
    <header className="bg-clip-padding backdrop-filter py-4 backdrop-blur-md bg-opacity-0 sticky border-b top-0 z-40 dark:border-b-slate-700 dark:bg-background">
      <div className="flex flex-row justify-between items-center mx-auto max-w-2/3">

        <Link
          prefetch={true}
          rel="noreferrer noopener"
          href="/"
          className="font-bold text-xl"
        >
          <TenantName></TenantName>
        </Link>

        <NavigationMenu className="hidden xl:flex">
          <NavigationMenuList className="">
            {/* desktop */}
            <nav className="hidden xl:flex gap-6">
              {routeList.map((route, i) => {
                

                return (
                  <Link
                    prefetch={true}
                    href={route.href}
                    key={i}
                    className={`${buttonVariants({
                      variant:  "outline",
                    })} text-[17px] font-bold!`}
                  >
                    {route.label}
                  </Link>
                );
              })}
            </nav>
          </NavigationMenuList>
        </NavigationMenu>

        
            
        <div className="hidden xl:flex">
            
              <Megaphone></Megaphone>
              <LogoutButton ></LogoutButton>
            
        </div>

        <div className="xl:hidden">
        <MobileMenu routes = {routeList} />
        </div>
        
        <div className="xl:hidden ">
          <Megaphone></Megaphone>
        <LogoutButton  ></LogoutButton>
        </div>

      </div>
    </header>
  );
};