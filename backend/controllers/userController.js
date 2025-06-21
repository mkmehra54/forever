//Allow users to create an account, login, and view their profile

import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//Route for user Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    //checking if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //checking if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      return res.json({ success: true, token, message: "login successful!" });
    } else {
      res.status(401).json({ success: false, message: "Incorrect password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Route for User Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    // validating email format and password strength
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }
    // hashing password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Route for Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const payload = { id: email + password };
      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export { loginUser, registerUser, adminLogin };
