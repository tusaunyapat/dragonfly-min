import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getCategories } from "./action";
import ManageCategories from "@/components/manage-categories";
import AddProductForm from "@/components/add-product";
import Footer from "@/components/footer";
export default async function Shelf() {
  const supabase = await createClient();

  const categories = await getCategories();
  console.log(categories);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 text-black items-center justify-center h-screen pt-24">
      <ManageCategories categories={categories} />
      <AddProductForm />
      <Footer />
    </div>
  );
}
