"use client";

import { ReactNode } from "react";
import { Navbar } from "./NavBar/Navbar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <section>
        <Navbar></Navbar>
      </section>

      <section className="min-h-screen">{children}</section>
    </>
  );
}
