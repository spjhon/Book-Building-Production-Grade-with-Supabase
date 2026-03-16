


import { Button, buttonVariants } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu"

import {RouteProps} from "./Navbar"
import Link from "next/link"


interface MobileMenuProps {
  routes: RouteProps[];
}


export function MobileMenu({routes}: MobileMenuProps) {
 

  

  return (
    <Drawer>



      <DrawerTrigger asChild className="xl:hidden">
        <Button variant="outline" className="font-bold text-xl" >Menu</Button>
      </DrawerTrigger>


      <DrawerContent className="">
        <div className="mx-auto">

          <DrawerHeader>
            <DrawerTitle>Menu Mobil Ticket App Demo</DrawerTitle>
            <DrawerDescription>Este menu es SSR</DrawerDescription>
          </DrawerHeader>

          {/* mobile */}
          <div className="">
            <NavigationMenu>

              <NavigationMenuList className="">
                <nav className=" flex flex-col gap-10 my-12 w-60">
                  {routes.map((route, i) => (
                    <DrawerClose asChild key={i}>
                      <Link
                        rel="noreferrer noopener"
                        href={route.href}
                        className={`text-[17px] ${buttonVariants({
                          variant: "outline",
                        })}`}
                        >
                        <strong> {route.label}</strong>
                      </Link>
                    </DrawerClose>
                  ))}
                </nav>
              </NavigationMenuList>
              
            </NavigationMenu>
          </div>


          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="default">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>



      
    </Drawer>
  )
}
