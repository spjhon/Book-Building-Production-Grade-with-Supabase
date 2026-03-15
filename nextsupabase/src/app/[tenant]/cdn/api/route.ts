import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildUrl, getHostnameAndPort } from "@/utils/url-helpers";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";



export async function GET(request: NextRequest) {
    

  const { searchParams } = new URL(request.url);
  const imagePath = searchParams.get("image");

  

  const supabaseServer = await createSupabaseServerClient()
  const [hostname] = getHostnameAndPort(request);
  const tenant = hostname;


  
  if (!imagePath){
      return NextResponse.redirect(buildUrl(`/error?type=No hay imagen que procesar`, tenant, request), { status: 303 });
  }

  

  const {data: immageUntransformed, error: errorTransformingTheImage } = await supabaseServer.storage
  .from("comments-attachments")
  .download(imagePath, {})

  if (errorTransformingTheImage){
      return NextResponse.redirect(buildUrl(`/error?type=${errorTransformingTheImage.message ?? "Error al tranformar la imagen"}`, tenant, request), { status: 303 });
  }


  const buffer = await sharp(await immageUntransformed.arrayBuffer())
  .resize(100, 100, { fit: 'contain' })
  .jpeg({ quality: 70 })
  .toBuffer();


  return new Response(new Uint8Array(buffer), {headers: {"Content-Type": "image/jpeg",}});

}




  

