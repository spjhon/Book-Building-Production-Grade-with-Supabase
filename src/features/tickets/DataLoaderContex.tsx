"use client"

import { createContext, ReactNode, use } from "react";

export const TicketsContext = createContext<any>(undefined);

interface DataLoaderContext {
  children: ReactNode;
  tenantPromise: Promise<any>;
  
}

export default function DataLoaderContext({tenantPromise, children}: DataLoaderContext) {

const result = use(tenantPromise);




const TicketContextValue = {
  tenantObject: result.data,
} 



  return (
    <TicketsContext.Provider value={{ TicketContextValue }}>
    {children}
    </TicketsContext.Provider>
  )
}
