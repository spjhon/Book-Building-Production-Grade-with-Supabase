
import { LoginForm } from "@/features/auth/components/LoginForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation"


export default async function Login({searchParams, params}: {searchParams: Promise<{magicLink: string}>, params: Promise<{ tenant: string }>}) {

  //1.
  const { tenant } = await params;
  const {magicLink} = await searchParams

  

  //2.
  const wantsMagicLink = magicLink === "yes";

  //3.
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();



  //4.
  if (data?.claims) {
    redirect(`/tickets`)
  }  


  const testimonials = [
        {
            quote: "This template helped us launch our SaaS product in just two weeks. The authentication and multi-tenancy features are rock solid.",
            author: "Sarah Chen",
            role: "CTO, TechStart",
            avatar: "SC"
        },
        {
            quote: "The best part is how well thought out the organization management is. It saved us months of development time.",
            author: "Michael Roberts",
            role: "Founder, DataFlow",
            avatar: "MR"
        },
        {
            quote: "Clean code, great documentation, and excellent support. Exactly what we needed to get our MVP off the ground.",
            author: "Jessica Kim",
            role: "Lead Developer, CloudScale",
            avatar: "JK"
        }
    ];

  //5.
  return (
    
 <div className="flex flex-col lg:flex-row min-h-screen">

    

    



    {/* SECCIÓN LOGIN: Arriba en móvil (flex-col), Izquierda en Desktop (lg:w-1/2) */}
    <div className="w-full lg:w-1/2 flex flex-col justify-center   py-12 px-4 bg-white relative">

        
        <Link
          href="https://tiendadelamujer.com/"
          className="absolute left-8 top-[1.6rem] flex items-center text-sm text-black hover:opacity-70 transition-colors font-medium z-20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Landing Page
        </Link>


        <div className="">
            {/* Texto en negro sólido */}
            <h2 className="text-center text-3xl font-bold tracking-tight text-black">
                {"SupaSass"}
            </h2>
        </div>

        <div className="w-[25rem] self-center my-5">
            {/* El formulario centrado verticalmente gracias al justify-center del padre */}
            <LoginForm isPasswordLogin={!wantsMagicLink} tenant={tenant}></LoginForm>
        </div>

    </div>

    {/* SECCIÓN TESTIMONIOS: Abajo en móvil, Derecha en Desktop (lg:flex) */}
    <div className="flex w-full lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800  justify-center ">
        <div className="w-full flex items-center justify-center p-8 sm:p-12">
            <div className="space-y-6 max-w-lg">
                <h3 className=" text-2xl font-bold mb-8">
                    Trusted by developers worldwide
                </h3>
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-primary-400/30 flex items-center justify-center text-white font-semibold">
                                    {testimonial.avatar}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm  mb-2 font-light leading-relaxed">
                                    &#34;{testimonial.quote}&#34;
                                </p>
                                <div className="mt-3">
                                    <p className="text-sm font-medium ">
                                        {testimonial.author}
                                    </p>
                                    <p className="text-sm text-primary-200">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="mt-8 text-center">
                    <p className="text-primary-100 text-sm">
                        Join thousands of developers building with {"SupaSass"}
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>




  );

}
