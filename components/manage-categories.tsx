"use client";
import Swal from "sweetalert2";
import { categories } from "@/app/type";
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import {
  addNewCategory,
  deleteCategory,
  getCategories,
  updateCategoryName,
} from "@/app/shelf/action";

export default function ManageCategories({
  categories,
  setIsChanged,
}: {
  categories: categories[];
  setIsChanged: Function;
}) {
  const [cname, setCname] = useState<string>("");
  const [category, setCategory] = useState<categories[]>(categories);
  const [isChange, setIsChange] = useState(false);
  const [updateCname, setUpdateCname] = useState<string>("");
  const [collapseState, setCollapseState] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesFromServer = await getCategories();
      setCategory(categoriesFromServer);
    };

    fetchCategories();
  }, [isChange]);

  const handleAddNewCategory = () => {
    const formData = new FormData();
    setIsChange(true);
    setIsChanged(true);

    formData.append("cname", cname);

    Swal.fire({
      title: "Are you sure?",
      text: "You can delete it later!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
      customClass: {
        popup: "w-10/12 md:w-3/5 lg:w-2/5", // Apply Tailwind directly
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await addNewCategory(formData);
        setCname("");
        setIsChange(false);
        setIsChanged(false);
        Swal.fire({
          title: "Added!",
          text: "Your category has been added.",
          icon: "success",
          customClass: {
            popup: "w-10/12 md:w-3/5 lg:w-2/5", // Adjust the width here
          },
        });
      }
    });
  };

  const handleClickupdate = (id: string) => {
    if (collapseState[id]) {
      // Check if the collapse is open
      handleUpdateCategoryName(id); // Perform update
    }
    handleCollapseToggle(id);
  };

  const handleDeleteCategory = (id: string) => {
    const formData = new FormData();
    setIsChange(true);
    setIsChanged(true);

    formData.append("id", id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "w-10/12 md:w-3/5 lg:w-2/5", // Apply Tailwind directly
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCategory(formData);
        setCname("");
        setIsChange(false);
        setIsChanged(false);
        Swal.fire({
          title: "Deleted!",
          text: "Your category has been deleted.",
          icon: "success",
          customClass: {
            popup: "w-10/12 md:w-3/5 lg:w-2/5", // Adjust the width here
          },
        });
      }
    });
  };

  const handleUpdateCategoryName = (id: string) => {
    console.log("call update", id);
    const formData = new FormData();
    setIsChange(true);

    formData.append("cname", updateCname);
    formData.append("id", id);

    Swal.fire({
      title: "Are you sure?",
      text: "You can update it later!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
      customClass: {
        popup: "w-10/12 md:w-3/5 lg:w-2/5", // Apply Tailwind directly
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateCategoryName(formData);
        setUpdateCname("");
        setIsChange(false);
        setCollapseState((prev) => ({ ...prev, [id]: false })); // Close the collapse after update
        Swal.fire({
          title: "Updated!",
          text: "Your category name has been updated.",
          icon: "success",
          customClass: {
            popup: "w-10/12 md:w-3/5 lg:w-2/5", // Adjust the width here
          },
        });
      }
    });
  };

  const handleCollapseToggle = (id: string) => {
    setCollapseState((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the collapse state for the specific category
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10  w-10/12">
      {/* Left Side: Category List */}
      <div className="rounded-lg shadow-md p-4">
        <p className="text-sm lg:text-xl font-bold mb-4">หมวดหมู่ที่มีอยู่</p>

        {/* Grid Layout for Categories */}
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-4">
          {category.map((category, index) => (
            <div key={category.id} className="  bg-white  w-full relative ">
              {/* Inline Text and Buttons */}
              <div className="grid grid-cols-4 items-center gap-1 join bg-slate-200">
                {/* Category Name */}
                <h3 className="text-xs lg:text-lg font-semibold col-span-2 px-2 join-item">
                  {category.cname}
                </h3>

                {/* Buttons */}
                <div className="flex items-center col-span-2 justify-end join join-item">
                  <button
                    className="col-span-1 btn btn-error btn-sm border-none  join-item bg-opacity-20"
                    onClick={() => handleDeleteCategory(category.id.toString())}
                  >
                    <RxCross1 />
                  </button>
                  <button
                    className="col-span-1 btn btn-warning btn-sm border-none  join-item bg-opacity-20"
                    onClick={() => handleClickupdate(category.id.toString())}
                  >
                    <MdModeEdit />
                  </button>
                </div>
              </div>

              {/* Overlay Input for Editing */}
              {collapseState[category.id.toString()] && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 lg:w-96">
                    <h2 className="text-md lg:text-xl font-bold mb-3">
                      แก้ไขหมวดหมู่
                    </h2>
                    <input
                      type="text"
                      name="updateCname"
                      value={updateCname}
                      placeholder={category.cname}
                      onChange={(e) => setUpdateCname(e.target.value)}
                      className="input input-bordered input-warning w-full"
                    />
                    <div className="flex justify-end mt-4 gap-3">
                      <button
                        className="px-2 lg:px-4 py-1 lg:py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() =>
                          setCollapseState((prev) => ({
                            ...prev,
                            [category.id.toString()]: false,
                          }))
                        }
                      >
                        ยกเลิก
                      </button>
                      <button
                        className="px-2 lg:px-4 py-1 lg:py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        onClick={() =>
                          handleClickupdate(category.id.toString())
                        }
                      >
                        แก้ไข
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Add New Category */}
      <div className="flex flex-col p-6 bg-warning bg-opacity-10 rounded-lg shadow-md">
        <p className="text-sm lg:text-xl font-bold mb-4">เพิ่มหมวดหมู่ใหม่</p>
        <input
          type="text"
          name="cname"
          value={cname}
          placeholder="New category name"
          onChange={(e) => setCname(e.target.value)}
          className="input input-bordered input-warning  w-full"
        />
        <button
          className="btn btn-outline btn-warning mt-3"
          onClick={handleAddNewCategory}
        >
          เพิ่มหมวดหมู่
        </button>
      </div>
    </div>
  );
}
