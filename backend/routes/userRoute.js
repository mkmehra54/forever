import express from 'express';
import { registerUser, loginUser, adminLogin } from '../controllers/userController.js';

const userRouter = express.Router();

// Route for user login
userRouter.post('/login', loginUser);

// Route for getting user profile
userRouter.post('/register', registerUser);

//Route for Admin Login
userRouter.post('/admin', adminLogin );

export default userRouter;