import { createContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

  const savedToken = useRef(localStorage.getItem("token"));

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);
    toast.success("Added to cart!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });

    if (token) {
      try {
        await axios.post(
          backendUrl + "/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        try {
          if (cartItems[itemId][size] > 0) {
            totalCount += cartItems[itemId][size];
          }
        } catch (error) {
          console.error(`Error processing item ${itemId} with size ${size}:`, error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
        toast.error("Item Deleted!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (!itemInfo) continue;

      for (const size in cartItems[itemId]) {
        try {
          if (cartItems[itemId][size] > 0) {
            totalAmount += itemInfo.price * cartItems[itemId][size];
          }
        } catch (error) {
          console.error(`Error processing item ${itemId} with size ${size}:`, error);
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (userToken) => {
    try {
      const response = await axios.post(
        backendUrl + "/cart/get",
        {},
        { headers: { token: userToken } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  // Fetch product list on mount
  useEffect(() => {
    getProductsData();
  }, []);

  // Set token from localStorage on mount
  useEffect(() => {
    if (savedToken.current) {
      setToken(savedToken.current);
    }
  }, []);

  // Fetch user cart once token is set
  useEffect(() => {
    if (token) {
      getUserCart(token);
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    backendUrl,
    token,
    setToken,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
