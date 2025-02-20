"use client";
import { createClient } from "@/utils/supabase/client";
import { categories, products } from "@/app/type";
import { useEffect, useState } from "react";
import { getCategories, getProducts } from "@/app/shelf/action";
import ProductCard from "./product-card";
import { User } from "@supabase/supabase-js";
import { RxCross2 } from "react-icons/rx";
import { FaLine } from "react-icons/fa6";
export default function Shelf() {
  const [categories, setCategories] = useState<categories[]>([]);
  const [products, setProducts] = useState<products[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<products[]>([]);
  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  const [selectedCateFilter, setSelectedCateFilter] = useState<string[]>([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesMap, setCategoriesMap] = useState<{ [key: string]: string }>(
    {}
  );
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  const fetchProducts = async () => {
    const productsFromServer = await getProducts();
    setProducts(productsFromServer);
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setHasAuthenticated(!!user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesFromServer = await getCategories();
      setCategories(categoriesFromServer);

      const categoriesMap = categoriesFromServer.reduce((acc, cate) => {
        acc[cate.id.toString()] = cate.cname;
        return acc;
      }, {});

      setCategoriesMap(categoriesMap);
    };

    fetchCategories();
    fetchProducts();
  }, []);

  // Toggle category selection
  const toggleCategoryFilter = (category: string) => {
    setSelectedCateFilter((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Toggle status selection
  const toggleStatusFilter = (status: string) => {
    setSelectedStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Apply filters
  useEffect(() => {
    let filtered = products;

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.pname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCateFilter.length > 0) {
      filtered = filtered.filter((product) =>
        product.categories.some((cate) => selectedCateFilter.includes(cate))
      );
    }

    // Apply status filter
    if (!hasAuthenticated) {
      filtered = filtered.filter((product) => product.status === "active");
    } else if (selectedStatusFilter.length > 0) {
      filtered = filtered.filter((product) =>
        selectedStatusFilter.includes(product.status)
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCateFilter, selectedStatusFilter, products]);

  return (
    <div
      id="products"
      className="flex flex-col py-24  gap-2 md:gap-4 w-full lg:w-10/12 items-center  min-h-screen px-4"
    >
      <h2 className="font-medium text-3xl md:text-5xl text-center mb-4">
        {hasAuthenticated ? "สินค้าในคลัง" : "สินค้าของเรา"}
      </h2>
      {!hasAuthenticated && (
        <div className="flex fixed bottom-0 right-0 p-6 md:p-16 z-[99999] rounded-full ">
          <div
            className="tooltip tooltip-open tooltip-left md:tooltip-top tooltip-warning "
            data-tip="สนใจสินค้า ติดต่อได้ที่"
          >
            <a href="https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=YOUR_CHANNEL_ID&redirect_uri=YOUR_REDIRECT_URI&scope=profile%20openid">
              <FaLine className="text-green-500 text-5xl md:text-7xl" />
            </a>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <label className="input input-bordered flex items-center gap-2 w-3/5">
        <input
          type="text"
          className="grow "
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </label>

      <h3 className="font-medium text-xl md:text-3xl text-left text-warning  w-full">
        ค้นหาตามหมวดหมู่
      </h3>

      {/* Category Selection */}
      <div className="flex flex-col md:flex-row  w-full justify-center items-center ">
        <div className="flex flex-col md:flex-row w-full">
          <div className="flex flex-col md:flex-row w-full ">
            {/* selection */}
            <div className="dropdown w-96 md:w-64">
              <label
                tabIndex={0}
                className="btn m-1 btn-outline btn-warning btn-sm text-md "
                aria-haspopup="true"
                aria-expanded="false"
              >
                เลือกตัวกรอง
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                {categories.map((cate, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer transition-all  rounded-md py-2 px-4 ${
                      selectedCateFilter.includes(cate.id.toString())
                        ? "bg-accent bg-opacity-20"
                        : "bg-white"
                    }`}
                    onClick={() => toggleCategoryFilter(cate.id.toString())}
                  >
                    {cate.cname}
                  </li>
                ))}
              </ul>
            </div>
            {/* display */}
            <div className="flex flex-row w-full items-center py-1">
              {selectedCateFilter.length > 0 && (
                <div className="flex flex-row gap-2 flex-wrap">
                  {selectedCateFilter.map((cate, index) => (
                    <button
                      key={index}
                      className="text-md btn btn-base-100 btn-sm font-normal flex flex-row"
                      onClick={() => toggleCategoryFilter(cate)}
                    >
                      <p className="text-xs">{categoriesMap[cate]}</p>
                      <p className="text-sm">
                        {" "}
                        <RxCross2 />
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {hasAuthenticated && (
            <div className="flex flex-row w-full ">
              {/* Status Selection */}
              <div className="flex flex-col md:flex-row w-full justify-start items-center">
                <div className="dropdown w-4/12 ">
                  <label
                    tabIndex={0}
                    className="btn m-1 btn-outline btn-warning text-lg px-4"
                    aria-haspopup="true"
                    aria-expanded={
                      selectedStatusFilter.length > 0 ? "true" : "false"
                    }
                    aria-controls="status-dropdown-menu"
                  >
                    เลือกสถานะ
                  </label>
                  <ul
                    id="status-dropdown-menu"
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    {["active", "draft", "inactive"].map((status, index) => (
                      <li
                        key={index}
                        className={`cursor-pointer transition-all rounded-md py-2 px-4 ${
                          selectedStatusFilter.includes(status)
                            ? "bg-accent bg-opacity-20"
                            : "bg-white"
                        }`}
                        onClick={() => toggleStatusFilter(status)}
                      >
                        {status}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-row text-accent gap-4 w-full items-center">
                  {selectedStatusFilter.map((status, index) => (
                    <button
                      key={index}
                      className={`text-xl btn btn-base-100 font-normal flex flex-row bg-opacity-20 border-none ${
                        status === "active"
                          ? "btn-success"
                          : status === "inactive"
                            ? "btn-error"
                            : "btn-accent"
                      }`}
                      onClick={() => toggleCategoryFilter(status)}
                    >
                      <p
                        key={index}
                        className={`text-sm rounded-md text-primary bg-opacity-20 `}
                      >
                        {status} {/* Display status name */}
                      </p>
                      <p className="text-sm">
                        {" "}
                        <RxCross2 />
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Selected Filters */}
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filteredProducts.map((product, index) => (
          <ProductCard
            product={product}
            key={index}
            isAdmin={hasAuthenticated}
            categoriesMap={categoriesMap}
            onUpdate={fetchProducts}
          />
        ))}
      </div>
    </div>
  );
}
