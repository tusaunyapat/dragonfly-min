"use client";
import Swal from "sweetalert2";
import { getCategories } from "@/app/shelf/action";
import { categories } from "@/app/type";
import { useState, useEffect, useRef } from "react";
import { addNewProduct } from "@/app/shelf/action";
export default function AddProductForm() {
  const [pname, setPname] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [price, setPrice] = useState<string>("");
  const [status, setStatus] = useState("");
  const [brand, setBrand] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [cates, setCates] = useState<categories[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const allCategory = await getCategories();
      setCates(allCategory);
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setCategories((prev) =>
      checked ? [...prev, value] : prev.filter((category) => category !== value)
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files); // Convert FileList to an array
      setImages((prev) => [...prev, ...filesArray]); // Append new images
    }
  };

  // Reference for file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resetForm = () => {
    setPname("");
    setCategories([]);
    setDescription("");
    setDetail("");
    setPrice("");
    setStatus("");
    setBrand("");
    setImages([]);

    // Reset file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddProduct = async () => {
    console.log(pname, price, detail);
    const formData = new FormData();
    formData.append("pname", pname);
    categories.forEach((category) => formData.append("categories[]", category));
    formData.append("description", description);
    formData.append("detail", detail);
    formData.append("price", price.toString());
    formData.append("status", status);
    formData.append("brand", brand);
    images.forEach((image) => formData.append("image_file", image));

    console.log("Click add product", formData);
    // Call your addProduct function here
    await addNewProduct(formData);

    Swal.fire({
      title: "The Internet?",
      text: "That thing is still around?",
      icon: "question",
    });
    resetForm();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-10/12">
      {/* Title */}
      <h2 className="text-2xl font-bold text-left mb-6">เพิ่มสินค้าใหม่</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="pname" className="block font-semibold">
              Product Name
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

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-semibold">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full h-48"
              required
            />
          </div>

          {/* Detail */}
          <div>
            <label htmlFor="detail" className="block font-semibold">
              Detail
            </label>
            <textarea
              id="detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="textarea textarea-bordered w-full h-48"
              required
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Categories */}
          <div>
            <label className="block font-semibold">Categories</label>
            <div className="flex flex-wrap gap-4">
              {cates.map((cate) => (
                <label key={cate.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={cate.id.toString()}
                    checked={categories.includes(cate.id.toString())}
                    onChange={handleCategoryChange}
                    className="checkbox checkbox-warning"
                  />
                  <span>{cate.cname}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block font-semibold">
              Price
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

          {/* Status */}
          <div>
            <label htmlFor="status" className="block font-semibold">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Status</option>
              <option value="inactive">inactive</option>
              <option value="active">active</option>
              <option value="draft">draft</option>
            </select>
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block font-semibold">
              Brand
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

          {/* Product Images */}
          <div>
            <label htmlFor="images" className="block font-semibold">
              Product Images
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
              required
            />
            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
                <p className="text-sm font-semibold mb-2">Selected Images:</p>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`preview-${index}`}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-Width Add Button */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          onClick={resetForm}
          type="button"
          className="btn btn-primary btn-outline w-full col-span-1"
        >
          Cancel
        </button>
        <button
          onClick={handleAddProduct}
          type="button"
          className="btn btn-primary w-full col-span-1"
        >
          Add Product
        </button>
      </div>
    </div>
  );
}
