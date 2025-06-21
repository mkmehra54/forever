import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";


const BestSeller = () => {
  const { products } = useContext(ShopContext);
//   console.log(products);
  
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter(item => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
    // console.log(bestSeller);
    
  }, [products]);

  return (
    <section className="my-10">
    {/* Text for Best Seller Section */}
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Explore our best-selling styles — timeless pieces that blend comfort,
          quality, and effortless charm. These favorites never go out of
          fashion.
        </p>
      </div>
      
      {/* Rendering Best Selling Products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {bestSeller.map((item, index) => (
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
        ))
        }
      </div>
    </section>
  );
};

export default BestSeller;
