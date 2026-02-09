// app/auth/page.tsx
import { redirect } from "next/navigation";


interface TicketsPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function AuthIndexPage({params}: TicketsPageProps) {


const { tenant } = await params;

  redirect(`/${tenant}/auth/login`);
}