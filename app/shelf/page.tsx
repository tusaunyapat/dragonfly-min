import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getCategories, selectContact, selectSocialMedias } from "./action";
import ManageCategories from "@/components/manage-categories";
import AddProductForm from "@/components/add-product";
import Footer from "@/components/footer";
import ManageContacts from "@/components/manage-contact";
import ManageSocialMedia from "@/components/manage-social-media";
export default async function Shelf() {
  const supabase = await createClient();

  const categories = await getCategories();
  console.log(categories);

  const contacts = await selectContact();
  const socialMedia = await selectSocialMedias();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 text-black items-center justify-center h-screen pt-24">
      <ManageCategories categories={categories} />
      <ManageContacts contacts={contacts} />
      <ManageSocialMedia socialMedias={socialMedia} />
      <AddProductForm />
      <Footer />
    </div>
  );
}
