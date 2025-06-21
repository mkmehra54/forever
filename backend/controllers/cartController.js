import userModel from "../models/userModel.js";

// Add products to the user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        // if we already have this item with this size, increase it's quantity by 1
        cartData[itemId][size] += 1;
      } else {
        // if we don't have this item but not of this size, then add one of this size
        cartData[itemId][size] = 1;
      }
    } else {
      // in case if we don't even have this item(of any size), then create one entry in our cart
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update products in the user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = (await userData.cartData) || {};

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
