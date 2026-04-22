"use client";

import { useParams } from "next/navigation";


export default function TenantName() {
  const { tenant } = useParams();

  return <strong>{tenant}</strong>;
}