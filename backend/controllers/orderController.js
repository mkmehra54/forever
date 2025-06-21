import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//Placing order using COD method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const delivery_fee = 10;

    // Calculate total amount
    const amount = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const orderData = {
      userId,
      items,
      address,
      amount: amount + delivery_fee,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // clearing cart data after the order is placed
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Placing order using Stripe method
const placeOrderStripe = async (req, res) => {
  console.log(error.message);
};

//Placing order using Razorpay method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const delivery_fee = 10;

    // Recalculate amount to ensure correctness
    const amount = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0) + delivery_fee;

    if (amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Order amount must be at least ₹1",
      });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: Math.round(amount * 100), // in paise
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    razorpay.orders.create(options, async (error, razorpayOrder) => {
      if (error) {
        console.error("Razorpay Error:", error);
        return res.status(500).json({
          success: false,
          message: error.description || "Razorpay order creation failed",
        });
      }

      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      return res.json({
        success: true,
        order: razorpayOrder,
        orderId: newOrder._id,
      });
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


//All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//User Order Data for Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
