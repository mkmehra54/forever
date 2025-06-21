import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App initialization
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
