import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';
import { updateUserProfile, updateUserPassword } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/updatedetails', protect, updateUserProfile);
router.put('/updatepassword', protect, updateUserPassword);

export default router;
