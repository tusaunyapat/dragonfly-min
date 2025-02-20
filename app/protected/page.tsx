import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Shelf from "@/components/shelf";
import Footer from "@/components/footer";
export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className=" flex flex-col gap-12 text-black items-center justify-center">
      <Shelf />
      <Footer />
    </div>
  );
}
