import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  // console.log(productId);
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        // console.log(item);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [productId, products]);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [productId]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col justify-between sm:justify-normal w-full sm:w-[18.7%]">
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`Product Image ${index + 1}`}
                className="w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer transition-all duration-200 hover:scale-105"
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%] overflow-hidden">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="font-medium text-lg sm:text-xl md:text-2xl mt-2">
            {productData.name}
          </h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" />
            <img src={assets.star_icon} alt="" />
            <img src={assets.star_icon} alt="" />
            <img src={assets.star_icon} alt="" />
            <img src={assets.star_dull_icon} alt="" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  key={index}
                  className={`border py-2 px-4 bg-gray-100 rounded-sm ${
                    item === size ? "border-orange-500" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 rounded-sm"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5 text-gray-300" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash on Delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Product Description and Review  */}
      <div className="mt-20">
        <div className="flex">
          <p className="border px-5 py-3 text-sm">
            <b>Description</b>
          </p>
          <p className="border px-5 py-3 text-sm">Reviews(122)</p>
        </div>
        <div className="flex flex-col gap-4 p-6 text-sm text-gray-500">
          <p>
            Elevate your look with this chic, everyday essential. Made from
            soft, premium fabric for comfort and style wherever you go.
          </p>
          <p>
            Simple, elegant, and made to flatter. A versatile piece that moves
            with you and feels as good as it looks.
          </p>
        </div>
      </div>

      {/* Display related products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
