import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilters, setShowFilters] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const applyFilters = () => {
    let productsCopy = [...products];

    // Smarter search logic
    if (showSearch && search) {
      const searchTerm = search.toLowerCase().trim();
      const searchWords = searchTerm.split(/\s+/);
      const hasCategory = ["men", "women", "kids"].some((cat) =>
        searchWords.includes(cat)
      );

      productsCopy = productsCopy.filter((item) => {
        const name = item.name.toLowerCase();
        const description = item.description.toLowerCase();
        const category = item.category.toLowerCase();
        const subCategory = item.subCategory.toLowerCase();

        if (hasCategory) {
          return searchWords.every((word) =>
            `${name} ${description} ${subCategory} ${category}`.includes(word)
          );
        } else {
          return (
            name.includes(searchTerm) ||
            description.includes(searchTerm) ||
            subCategory.includes(searchTerm)
          );
        }
      });
    }

    // Apply category filter
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    // Apply subcategory filter
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Apply sorting after filtering
    sortProducts(productsCopy);
  };

  const sortProducts = (productsToSort) => {
    let sortedProducts = [...productsToSort];
    switch (sortType) {
      case "low-high":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilterProducts(sortedProducts);
  };

  useEffect(() => {
    applyFilters();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProducts(filterProducts);
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filters Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilters(!showFilters)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${
              showFilters ? "rotate-90" : "rotate-270"
            }`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 rounded-sm ${
            showFilters ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Men", "Women", "Kids"].map((cat) => (
              <p key={cat} className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                />
                {cat}
              </p>
            ))}
          </div>
        </div>

        {/* Subcategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 rounded-sm my-5 ${
            showFilters ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Topwear", "Bottomwear", "Winterwear"].map((type) => (
              <p key={type} className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={type}
                  onChange={toggleSubCategory}
                />
                {type}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          {/* Product Sort Option */}
          <div className="flex items-center text-base sm:text-2xl mb-4">
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="border-2 border-gray-300 text-sm px-2 rounded-sm py-2 sm:py-3 text-gray-600"
            >
              <option value="relavent">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.length === 0 ? (
            <p className="text-center text-lg sm:text-xl text-gray-400">
              No Products Found.
            </p>
          ) : (
            filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
