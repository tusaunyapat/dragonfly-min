import { products } from "@/app/type";
import { useState } from "react";
import UpdateProductForm from "./modal-update-product";
import ProductDetail from "./modal-detail";
import Swal from "sweetalert2";
import { deleteProduct } from "@/app/shelf/action";

export default function ProductCard({
  product,
  isAdmin,
  categoriesMap,
  onUpdate,
}: {
  product: products;
  isAdmin: boolean;
  onUpdate: () => void;
  categoriesMap: { [key: string]: string };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  console.log("card", categoriesMap);
  const handleDeleteProduct = (id: string) => {
    const formData = new FormData();

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
        await deleteProduct(formData);

        onUpdate();
        Swal.fire({
          title: "Deleted!",
          text: "Your category has been deleted.",
          icon: "success",
          customClass: {
            popup: "w-10/12 md:w-3/5 lg:w-2/5", // Apply Tailwind directly
          },
        });
      }
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openModalDetail = () => setIsModalDetailOpen(true);
  const closeModalDetail = () => setIsModalDetailOpen(false);

  // Show the background overlay when any modal is open
  const isAnyModalOpen = isModalOpen || isModalDetailOpen;

  return (
    <div className="product-list">
      <div
        key={product.id}
        className="product-card border p-2 md:p-4 rounded-lg shadow-md flex flex-col md:flex-row"
      >
        {/* Image Carousel */}
        <div className="carousel product-image w-full md:w-1/3 flex justify-center items-center">
          {product.images.length > 0 ? (
            product.images.map((src, index) => (
              <div
                className="carousel-item w-full flex justify-center"
                key={index}
              >
                <img
                  src={src}
                  className="w-auto h-48 md:h-56 object-contain rounded-lg"
                  alt={`Product image ${index + 1}`}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No image available</p>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-2/3 flex flex-col justify-between ">
          <div className="product-details px-4">
            <div className="flex flex-row w-full justify-between items-center pt-2 md:pt-0">
              <div className="flex flex-row gap-4 items-center">
                <h3 className="product-name text-md md:text-xl font-bold">
                  {product.pname}
                </h3>

                {isAdmin && (
                  <p
                    className={`badge badge-outline product-status text-xs md:text-sm ${
                      product.status === "inactive"
                        ? "badge-error"
                        : product.status === "active"
                          ? "badge-success"
                          : ""
                    }`}
                  >
                    {product.status}
                  </p>
                )}
              </div>
              <p className="product-price text-warning font-semibold text-md md:text-2xl">
                {product.price} ฿
              </p>
            </div>
            <p className="product-brand text-sm text-gray-500">
              Brand: {product.brand}
            </p>
            <p className="product-description text-gray-600 line-clamp-3">
              {product.description}
            </p>
          </div>

          {/* Admin Buttons */}
          <div className="flex flex-row gap-2 justify-center md:justify-end w-full ">
            <div className="flex gap-2 mt-4">
              <button
                className="btn btn-outline btn-warning btn-sm "
                onClick={openModalDetail}
              >
                see detail
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteProduct(product.id.toString())}
                  className="btn btn-outline  btn-sm btn-error text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              )}

              {isAdmin && (
                <button className="btn btn-outline btn-sm " onClick={openModal}>
                  Update
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Overlay */}
        {isAnyModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
        )}

        {/* Modal 1: Update Product */}
        {isModalOpen && (
          <dialog id="my_modal_4" className="modal" open>
            <div className="modal-box w-[80vw] max-w-5xl">
              <UpdateProductForm
                product={product}
                onUpdate={onUpdate}
                closeModal={closeModal}
              />
            </div>
          </dialog>
        )}

        {/* Modal 2: Product Detail */}
        {isModalDetailOpen && (
          <dialog id="my_modal_4" className="modal" open>
            <div className="modal-box w-[80vw] max-w-5xl">
              <ProductDetail product={product} categoriesMap={categoriesMap} />
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn" onClick={closeModalDetail}>
                    Close
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}
