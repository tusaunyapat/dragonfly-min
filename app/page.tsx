import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Shelf from "@/components/shelf";
import AuthButton from "@/components/header-auth";
import Footer from "@/components/footer";
export default async function Home() {
  return (
    <div className=" mt-16">
      <main className="w-full flex flex-col items-center justify-center">
        {/* <AuthButton /> */}
        <Hero />
        <Shelf />
        <Footer />
      </main>
    </div>
  );
}
