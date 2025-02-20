"use server";

import { createClient } from "@/utils/supabase/server";
import { create } from "domain";
import { AwardIcon } from "lucide-react";
import { revalidatePath } from "next/cache";

export const getCategories = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    throw new Error("Failed to fetch boardgame types");
    console.log(error);
  }

  return data;
};

export const addNewCategory = async (formData: FormData) => {
  const cname = formData.get("cname")?.toString();
  if (!cname) {
    throw new Error("Category name is required"); // Ensure an ID is provided
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .insert([{ cname: cname }]);

  revalidatePath("/");
  return;
};

export const updateCategoryName = async (formData: FormData) => {
  const cname = formData.get("cname")?.toString();
  const id = formData.get("id")?.toString();
  if (!cname) {
    throw new Error("Category new name is required");
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .update({ cname: cname }) // Set the new category name
    .match({ id: id }); // Specify which category to update using its id

  if (error) {
    console.error("Error updating category:", error);
    return;
  }

  revalidatePath("/");
  return;
};

export const deleteCategory = async (formData: FormData) => {
  const id = formData.get("id");
  if (!id) {
    throw new Error("Category ID is required"); // Ensure an ID is provided
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id); // Assuming the column name for the category ID is 'id'

  if (error) {
    throw new Error(error.message); // Handle any error from the delete operation
  }

  console.log("Category deleted:", data);
  return data;
};

export const addNewProduct = async (formData: FormData) => {
  console.log("From action");
  const imageUrls: string[] = []; // Array to store uploaded image URLs
  const supabase = await createClient();

  // Check if the images are being retrieved correctly
  const imageFiles = formData.getAll("image_file") as File[];
  console.log("Image Files:", imageFiles);

  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    const filePath = `product_images/${Date.now()}_${imageFile.name}`; // Generate a unique file path

    try {
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.log("Upload file error.", uploadError);
        return;
      }

      console.log("Upload success.");

      const publicPictureURL = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath).data.publicUrl;
      imageUrls.push(publicPictureURL); // Store the image URL in the imageUrls array
    } catch (uploadError) {
      console.log("Error uploading file", uploadError);
      return;
    }
  }

  const pname = formData.get("pname")?.toString();
  const categories = formData.getAll("categories[]");
  const description = formData.get("description")?.toString();
  const detail = formData.get("detail")?.toString();
  const price = parseFloat(formData.get("price") as string).toFixed(2);
  const status = formData.get("status")?.toString();
  const brand = formData.get("brand")?.toString();

  const { data, error } = await supabase.from("products").insert([
    {
      pname: pname,
      categories: categories,
      description: description,
      detail: detail,
      price: price,
      status: status,
      brand: brand,
      images: imageUrls,
    },
  ]);

  if (error) {
    console.error("Error inserting product:", error);
    return;
  }

  console.log("Product added successfully:", data);
  revalidatePath("/"); // Revalidate the path as necessary
  return;
};

export const getProducts = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    throw new Error("Failed to fetch boardgame types");
    console.log(error);
  }

  return data;
};

export const updateProduct = async (formData: FormData) => {
  const supabase = await createClient();
  const delImagePath = formData.getAll("delImagePath") as string[];
  const currentImagePath = formData.getAll("currentImagePath") as string[];
  const updateImageUrls: string[] = currentImagePath.filter(
    (path) => !delImagePath.includes(path)
  );

  const imageFiles = formData.getAll("newImageFile") as File[];
  console.log("Image Files:", imageFiles);

  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    const filePath = `product_images/${Date.now()}_${imageFile.name}`; // Generate a unique file path

    try {
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.log("Upload file error.", uploadError);
        return;
      }

      console.log("Upload success.");

      const publicPictureURL = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath).data.publicUrl;
      updateImageUrls.push(publicPictureURL); // Store the image URL in the imageUrls array
    } catch (uploadError) {
      console.log("Error uploading file", uploadError);
      return;
    }
  }
  const id = formData.get("id")?.toString();
  const pname = formData.get("pname")?.toString();
  const categories = formData.getAll("categories[]");
  const description = formData.get("description")?.toString();
  const detail = formData.get("detail")?.toString();
  const price = parseFloat(formData.get("price") as string).toFixed(2);
  const status = formData.get("status")?.toString();
  const brand = formData.get("brand")?.toString();

  const { data, error } = await supabase
    .from("products")
    .update([
      {
        pname: pname,
        categories: categories,
        description: description,
        detail: detail,
        price: price,
        status: status,
        brand: brand,
        images: updateImageUrls,
      },
    ])
    .eq("id", id);

  if (error) {
    console.error("Error inserting product:", error);
    return;
  }

  console.log("Product added successfully:", data);
  revalidatePath("/"); // Revalidate the path as necessary
  return;
};

export const deleteProduct = async (formData: FormData) => {
  const id = formData.get("id");
  if (!id) {
    throw new Error("Product ID is required"); // Ensure an ID is provided
  }
  const supabase = await createClient();

  const { data, error } = await supabase.from("products").delete().eq("id", id); // Assuming the column name for the category ID is 'id'

  if (error) {
    throw new Error(error.message); // Handle any error from the delete operation
  }

  console.log("Category deleted:", data);
  return data;
};

export const selectContact = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("contacts").select("*");
  if (error) {
    throw new Error("Failed to fetch boardgame types");
    console.log(error);
  }

  return data;
};

export const addNewContact = async (formData: FormData) => {
  const name = formData.get("name")?.toString();
  const phone = formData.get("phone")?.toString();
  const other = formData.get("other")?.toString();
  if (!name) {
    throw new Error("Category name is required"); // Ensure an ID is provided
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contacts")
    .insert([{ name: name, phone: phone, other: other }]);

  revalidatePath("/");
  return;
};

export const deleteContact = async (formData: FormData) => {
  const id = formData.get("id");
  if (!id) {
    throw new Error("Contact ID is required"); // Ensure an ID is provided
  }
  const supabase = await createClient();

  const { data, error } = await supabase.from("contacts").delete().eq("id", id); // Assuming the column name for the category ID is 'id'

  if (error) {
    throw new Error(error.message); // Handle any error from the delete operation
  }

  console.log("Contact deleted:", data);
  return data;
};

export const updateContact = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const other = formData.get("other") as string;

  if (!id) {
    throw new Error("Contact ID is required");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contacts")
    .update([
      {
        name: name,
        phone: phone,
        other: other,
      },
    ])
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  console.log("Contact updated:", data);
  return data;
};

export const selectSocialMedias = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("social_medias").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const addNewSocialMedia = async (formData: FormData) => {
  const platform = formData.get("platform")?.toString();
  const url = formData.get("url")?.toString();
  if (!platform) {
    throw new Error("social media name is required"); // Ensure an ID is provided
  }

  if (!url) {
    throw new Error("social media url is required"); // Ensure an ID is provided
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("social_medias")
    .insert([{ platform: platform, url: url }]);

  revalidatePath("/");
  return;
};

export const updateSocialMedia = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const platform = formData.get("platform") as string;
  const url = formData.get("url") as string;

  if (!id) {
    throw new Error("Social Media ID is required");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("social_medias")
    .update([{ platform: platform, url: url }])
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  console.log("Social Media updated:", data);
  return data;
};

export const deleteSocialMedia = async (formData: FormData) => {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Social Media ID is required");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("social_medias")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  console.log("Social Media deleted:", data);
  return data;
};
