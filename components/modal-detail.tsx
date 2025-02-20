"use client";
import { products } from "@/app/type";

export default function ProductDetail({
  product,
  categoriesMap,
}: {
  product: products;
  categoriesMap: { [key: string]: string };
}) {
  console.log(product);
  console.log("detail", categoriesMap);
  return (
    <div className="flex flex-col md:flex-row w-full gap-8 max-h-[60vh] overflow-auto py-2">
      {/* Left Side - Image Carousel */}
      <div className="flex flex-col w-full">
        <div className="carousel h-auto">
          {product.images.map((img, index) => (
            <div
              key={index}
              id={`${product.id}_${index}`}
              className="carousel-item w-full"
            >
              <img
                src={img}
                className="w-full rounded-lg"
                alt={`Product image ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex w-full justify-center gap-2 py-2">
          {product.images.map((img, index) => (
            <div key={index} className="carousel-item">
              <a
                href={`#${product.id}_${index}`}
                className="btn btn-xs"
                aria-label={`Go to image ${index + 1}`}
              >
                {index + 1}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Product Info */}
      <div className="flex flex-col w-full gap-1 p-2">
        <div className="flex flex-row justify-between">
          <p className="text-lg lg:text-2xl font-bold">{product.pname}</p>
          <p className="text-lg lg:text-2xl font-bold text-warning">
            {product.price} ฿
          </p>
        </div>
        <div className="flex flex-row gap-4">
          <p className="text-sm lg:text-md text-gray-500">Brand: </p>
          <p className="text-sm lg:text-md text-gray-500">{product.brand}</p>
        </div>

        {/* Categories */}
        <div className="flex flex-row gap-4">
          <p className="text-sm lg:text-md text-gray-500">Categories: </p>
          <div className="flex flex-row">
            {product.categories.every(
              (cate) => !categoriesMap[Number(cate)]
            ) ? (
              <p className="mr-2">ไม่ระบุ</p>
            ) : (
              product.categories.map((cate, index) =>
                categoriesMap[Number(cate)] ? (
                  <p
                    key={index}
                    className="mr-2 text-xs bg-slate-100 px-2 py-1 rounded-md"
                  >
                    {categoriesMap[Number(cate)]}
                  </p>
                ) : null
              )
            )}
          </div>
        </div>

        {/* Product Description */}
        <p className="text-xs lg:text-md">{product.description}</p>
        <br />
        <p className="text-xs lg:text-md">{product.detail}</p>
      </div>
    </div>
  );
}
