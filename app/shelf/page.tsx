import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminPage from "@/components/admin-page";
import Footer from "@/components/footer";
export default async function ShelfPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-col">
      <AdminPage />
      <Footer />
    </div>
  );
}
