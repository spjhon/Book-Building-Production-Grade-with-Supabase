
import { UpdatePasswordForm } from "../../../../features/auth/components/update-password-form";

export const dynamic = 'force-static' 

export default function UpdatePasswordFormPage() {

  
  return (
   
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm/>
      </div>
    </div>
  );
}
