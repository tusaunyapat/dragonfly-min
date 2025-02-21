"use client";
import Swal from "sweetalert2";
import { getCategories, updateProduct } from "@/app/shelf/action";
import { categories as CategoryType, products } from "@/app/type";
import { useState, useEffect } from "react";

export default function UpdateProductForm({
  product,
  onUpdate,
  closeModal,
}: {
  product: products;
  onUpdate: () => void;
  closeModal: Function;
}) {
  const [pname, setPname] = useState(product.pname || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [description, setDescription] = useState(product.description || "");
  const [detail, setDetail] = useState(product.detail || "");
  const [price, setPrice] = useState(product.price.toString() || "");
  const [status, setStatus] = useState(product.status || "");
  const [brand, setBrand] = useState(product.brand || "");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>(
    product.images || []
  );
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [cates, setCates] = useState<CategoryType[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const allCategory = await getCategories();
      setCates(allCategory);

      // Initialize selected categories with existing product categories
      const validCategoryIds = new Set(
        allCategory.map((cate) => cate.id.toString())
      );
      setSelectedCategories(
        product.categories.filter((id) => validCategoryIds.has(id.toString()))
      );
    };

    fetchCategories();
  }, [product.categories]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedCategories((prevSelected) => {
      return checked
        ? [...prevSelected, value]
        : prevSelected.filter((id) => id !== value);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleRemoveCurrentImage = (imageUrl: string) => {
    setDeletedImages((prev) => [...prev, imageUrl]);
    setCurrentImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const handleUpdateProduct = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
      customClass: {
        popup: "w-10/12 md:w-3/5 lg:w-2/5", // Apply Tailwind directly
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();

        formData.append("id", product.id.toString());
        formData.append("pname", pname);
        selectedCategories.forEach((category) =>
          formData.append("categories[]", category)
        );
        formData.append("description", description);
        formData.append("detail", detail);
        formData.append("price", price.toString());
        formData.append("status", status);
        formData.append("brand", brand);
        newImages.forEach((image) => formData.append("newImageFile", image));
        deletedImages.forEach((imagePath) =>
          formData.append("delImagePath", imagePath)
        );
        currentImages.forEach((imagePath) =>
          formData.append("currentImagePath", imagePath)
        );

        await updateProduct(formData);
        onUpdate();
        closeModal();

        Swal.fire({
          title: "Updated!",
          text: "Product has been updated.",
          icon: "success",
          customClass: {
            popup: "w-10/12 md:w-3/5 lg:w-2/5", // Adjust the width here
          },
        });
      }
    });
  };

  return (
    <div className="space-y-4 p-0 md:p-4 h-[70vh]">
      <div className="flex flex-col gap-2">
        <label htmlFor="pname" className="block font-bold text-md">
          ชื่อสินค้า
        </label>
        <input
          type="text"
          id="pname"
          value={pname}
          onChange={(e) => setPname(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-bold text-md">Categories</label>

        {cates.map((cate) => (
          <label
            key={cate.id}
            className="cursor-pointer label flex justify-start items-center gap-2 "
          >
            <input
              type="checkbox"
              name="category[]"
              className="checkbox checkbox-warning"
              value={cate.id.toString()}
              checked={selectedCategories.includes(cate.id.toString())}
              onChange={handleCategoryChange}
            />
            <span className="label-text">{cate.cname}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="block font-bold text-md">
          คำอธิบาย
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full h-32"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="detail" className="block font-bold text-md">
          รายละเอียด
        </label>
        <textarea
          id="detail"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className="textarea textarea-bordered w-full h-48"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="price" className="block font-bold text-md">
          ราคา
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="block font-bold text-md">
          สถานะ
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select select-bordered w-full"
          required
        >
          <option value="inactive">Inactive</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="brand" className="block font-bold text-md">
          แบรนด์
        </label>
        <input
          type="text"
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="block font-bold text-md">รูปภาพสินค้าที่มีอยู่</label>
        <div className="flex flex-wrap gap-2">
          {currentImages.map((image, index) => (
            <div key={index} className="relative w-32">
              <img
                src={image}
                alt="Product"
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs"
                onClick={() => handleRemoveCurrentImage(image)}
              >
                ลบ
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="images" className="block">
          รูปภาพสินค้าที่ต้องการเพิ่ม
        </label>
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="file-input file-input-bordered w-full"
        />
        {newImages.length > 0 && (
          <div className="mt-2">
            <ul>
              {newImages.map((image, index) => (
                <li key={index} className="flex items-center gap-2">
                  <img
                    src={URL.createObjectURL(image)} // To display the image preview
                    alt={image.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span>{image.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pb-8">
        <button
          onClick={() => closeModal()}
          type="button"
          className="btn btn-primary  grid-col-1 btn-outline modal-action items-center justify-center"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleUpdateProduct}
          type="button"
          className="btn btn-primary   grid-col-1 modal-action items-center justify-center"
        >
          แก้ไข
        </button>
      </div>
    </div>
  );
}
