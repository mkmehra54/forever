import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlacedOrder = () => {
  const [method, setMethod] = useState("cod");
  const navigate = useNavigate();
  const {
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    deliver_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const size in cartItems[items]) {
          if (cartItems[items][size] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[items][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }
      // console.log(orderItems);
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + deliver_fee,
      };

      switch (method) {
  // COD payment
  case "cod":
    const response = await axios.post(
      backendUrl + "/order/place",
      orderData,
      { headers: { token } }
    );
    if (response.data.success) {
      setCartItems({});
      navigate("/orders");
    } else {
      toast.error(response.data.message);
    }
    break;

  // Razorpay payment
  case "razorpay":
    const razorResponse = await axios.post(
      backendUrl + "/order/razorpay",
      { ...orderData, userId: JSON.parse(atob(token.split(".")[1])).id },
      { headers: { token } }
    );

    if (!razorResponse.data.success) {
      toast.error(razorResponse.data.message);
      return;
    }

    const razorpayOrder = razorResponse.data.order;

    // Open Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "Forever Clothing",
      description: "Payment for your order",
      order_id: razorpayOrder.id,
      handler: function (response) {
        toast.success("Payment successful!");
        setCartItems({});
        navigate("/orders");
      },
      prefill: {
        name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    break;

  default:
    toast.error("Please select a valid payment method.");
}

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            required
            className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First Name"
          />
          <input
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            required
            className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          required
          className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email"
        />
        <input
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          required
          className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            required
            className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <input
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            required
            className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            required
            className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
          />
          <input
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            required
            className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          required
          className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone Number"
        />
      </div>

      {/* Right Side */}
      <div
        className="mt-8
      "
      >
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHODS"} />
          {/* ----------------Payment Methods------------ */}
          <div className="flex flex-col lg:flex-row gap-3 transition-all duration-200">
            <div
              onClick={() => setMethod("strip")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer rounded-sm hover:bg-neutral-100"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method == "strip" ? "bg-green-500" : ""
                }`}
              ></p>
              <img
                className="h-5 mx-4"
                src={assets.stripe_logo}
                alt="stripe logo"
              />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer rounded-sm hover:bg-neutral-100"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method == "razorpay" ? "bg-green-500" : ""
                }`}
              ></p>
              <img
                className="h-5 mx-4"
                src={assets.razorpay_logo}
                alt="stripe logo"
              />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer rounded-sm hover:bg-neutral-100"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method == "cod" ? "bg-green-500" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="border border-black font-semibold hover:bg-black hover:text-white px-16 py-3 text-sm rounded-sm cursor-pointer transition-all duration-200"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlacedOrder;