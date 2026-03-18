"use client";


import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";




export function TicketFilters() {

const router = useRouter();
const pathname = usePathname();
const searchParams = useSearchParams();

    const searchInputRef = useRef<HTMLInputElement>(null);


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();


        const search = searchInputRef.current?.value || "";
        alert("Buscar tickets conteniendo: " + search);
        const updatedParams = new URLSearchParams(searchParams);

        updatedParams.set("search", search);
        updatedParams.set("page", "1");
        router.push(pathname + "?" + updatedParams.toString());
    };


  return (

    <form onSubmit={onSubmit}>

      <div style={{alignContent: "center",display: "flex", gap: "15px"}}>

        <input
          type="search"
          ref={searchInputRef}
          id="search"
          name="search"
          placeholder="Buscar Tickets..."
          required
          style={{ margin: 0, maxWidth: "350px" }}
        />

        <button type="submit" role="button" style={{ width: "auto" }}>
          Buscar
        </button>


      </div>

    </form>



  );
}
