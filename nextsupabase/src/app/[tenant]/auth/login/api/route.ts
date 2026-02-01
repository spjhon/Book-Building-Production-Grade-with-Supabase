import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function POST(request: Request) {
  // Step 1:
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  // Step 2:

console.log("Se ha ejecutado la ruta API login con la constraseña:" + password)

if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.redirect(
      new URL("/error?type=invalid-form", request.url),
      { status: 302 }
    );
  }

 
  


  const supabase = createSupabaseServerClient();
  // Step 3:
  const { data, error } = await (await supabase).auth.signInWithPassword({email, password,});
  // Step 4:
  const userData = data?.user;
  if (error || !userData) {
    return NextResponse.redirect(
      new URL("/error?type=login-failed", request.url),
      { status: 302 }
    );
  }
  return NextResponse.redirect(new URL("/tickets", request.url), {
    status: 302,
  });
}

/**
import { NextResponse } from "next/server";
export async function POST(request: Request) {
return NextResponse.json({ message: "Hello from Route Handler" });
}
*/
