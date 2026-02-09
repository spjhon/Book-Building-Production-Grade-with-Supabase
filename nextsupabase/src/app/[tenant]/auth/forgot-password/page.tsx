import { ForgotPasswordForm } from "./_components/forgot-password-form";


interface TicketsPageProps {
  params: Promise<{ tenant: string }>;
}


export default async function ForgotPasswordPage({params}: TicketsPageProps) {

const { tenant } = await params;


  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm tenant ={tenant}/>
      </div>
    </div>
  );
}
