"use client";
import Swal from "sweetalert2";
import { getCategories } from "@/app/shelf/action";
import { categories } from "@/app/type";
import { useState, useEffect } from "react";
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
      setImages(filesArray); // Now you can iterate over the array
    }
  };
  const resetForm = () => {
    setPname("");
    setCategories([]);
    setDescription("");
    setDetail("");
    setPrice("");
    setStatus("");
    setBrand("");
    setImages([]);
    setCates([]);
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
      title: "Add Product",
      text: "The product has been added!",
      icon: "success",
    });
    resetForm();
  };

  return (
    <div className="space-y-4 p-4 ">
      <div>
        <label htmlFor="pname" className="block">
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

      <div>
        <label className="block">หมวดหมู่</label>
        {cates.map((cate) => (
          <label key={cate.id}>
            <input
              type="checkbox"
              value={cate.id.toString()}
              checked={categories.includes(cate.id.toString())}
              onChange={handleCategoryChange}
            />
            {cate.cname}
          </label>
        ))}
      </div>

      <div>
        <label htmlFor="description" className="block">
          คำอธิบาย
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="detail" className="block">
          รายละเอียด
        </label>
        <textarea
          id="detail"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className="textarea textarea-bordered w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block">
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

      <div>
        <label htmlFor="status" className="block">
          สถานะ
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select select-bordered w-full"
          required
        >
          <option value="">Select Status</option>
          <option value="inactive">เก็บไว้ในคลัง</option>
          <option value="active">แสดง</option>
          <option value="draft">ร่าง</option>
          {/* Add other statuses as needed */}
        </select>
      </div>

      <div>
        <label htmlFor="brand" className="block">
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

      <div>
        <label htmlFor="images" className="block">
          รูปภาพสินค้้า
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
        <div className="mt-2">
          {images.length > 0 && (
            <ul>
              {images.map((image, index) => (
                <li key={index}>{image.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button
        onClick={handleAddProduct}
        type="button"
        className="btn btn-primary w-full"
      >
        เพิ่มสินค้า
      </button>
    </div>
  );
}
