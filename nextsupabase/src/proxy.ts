import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

export async function proxy(request: NextRequest) {

  //esto es solo un ejemplo de como este proxy (middleware), intercepta todas las request.
    console.log("🔥 [PROXY] Request recibida:", request.nextUrl.pathname)

  const res = await updateSession(request)

  console.log("🔥 [PROXY] Respuesta enviada para:", request.nextUrl.pathname)

  return res
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
