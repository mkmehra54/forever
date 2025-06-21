import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/product/list");
      // console.log(response.data);
      if (response.data) {
        setList(response.data.products);
        // console.log(list);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching the list:", error);
      toast.error(response.data.message);
    }
  };

  const removeProuct = async (id) => {
    try {
      const response = await axios.delete(backendUrl + "/product/remove/", {
        headers: { token },
        data: { id },
      });
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList(); // Refresh the list after successful deletion
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p>All Products List</p>
      <div className="flex flex-col gap-2">
        {/* -----------List Table Title---------- */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-300 bg-gray-100 text-sm rounded-sm">
          <p>
            <b>Image</b>
          </p>
          <p>
            <b>Name</b>
          </p>
          <p>
            <b>Category</b>
          </p>
          <p>
            <b>Price</b>
          </p>
          <p>
            <b className="text-center">Action</b>
          </p>
        </div>

        {/* ------Product List----------- */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border border-gray-300 rounded-sm text-sm"
            key={index}
          >
            <img className="w-12" src={item.image[0]} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <p
              onClick={() => removeProuct(item._id)}
              className="text-right text-lg font-semibold cursor-pointer text-red-500 hover:text-red-700 px-2"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
