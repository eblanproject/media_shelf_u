import RegistrationForm from "@/components/auth/RegistrationForm";
import MsuLogo from "@/components/MsuLogo";

export default function RegisterPage() {
  return (
    <section className="flex min-h-dvh items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <MsuLogo />
        </div>
        <RegistrationForm />
      </div>
    </section>
  );
}
