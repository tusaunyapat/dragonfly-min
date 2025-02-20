"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import {
  getCategories,
  selectContact,
  selectSocialMedias,
} from "@/app/shelf/action";
import ManageCategories from "@/components/manage-categories";
import AddProductForm from "@/components/add-product";
import ManageContacts from "@/components/manage-contact";
import ManageSocialMedia from "@/components/manage-social-media";
import { categories, contacts, social_medias } from "@/app/type";

export default function AdminPage() {
  const [categories, setCategories] = useState<categories[]>([]);
  const [contacts, setContacts] = useState<contacts[]>([]);
  const [socialMedia, setSocialMedia] = useState<social_medias[]>([]);
  const [isChange, setIsChange] = useState<boolean>(false);

  useEffect(() => {
    // Initialize Supabase client

    // Function to fetch data
    const fetchData = async () => {
      const [categoriesData, contactsData, socialMediaData] = await Promise.all(
        [getCategories(), selectContact(), selectSocialMedias()]
      );

      setCategories(categoriesData);
      setContacts(contactsData);
      setSocialMedia(socialMediaData);
    };

    // Call fetchData to get the required data
    fetchData();
  }, [isChange]);

  // If no user, redirect to sign-in page

  return (
    <div className="flex-1 w-full flex flex-col gap-12 text-black items-center justify-center h-screen pt-24">
      <ManageCategories categories={categories} setIsChanged={setIsChange} />
      <ManageContacts contacts={contacts} />
      <ManageSocialMedia socialMedias={socialMedia} />
      <AddProductForm categoriesList={categories} />
    </div>
  );
}
