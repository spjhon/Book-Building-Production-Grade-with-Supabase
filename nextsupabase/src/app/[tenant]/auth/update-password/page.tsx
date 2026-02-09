import { UpdatePasswordForm } from "./_components/update-password-form";

interface UpdatePasswordFormPageProps {
  params: Promise<{ tenant: string }>;
}


export default async function UpdatePasswordFormPage({params}: UpdatePasswordFormPageProps) {

const { tenant } = await params;


  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm tenant = {tenant}/>
      </div>
    </div>
  );
}
