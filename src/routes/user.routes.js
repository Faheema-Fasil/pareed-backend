import express from 'express';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserPassword,
  deleteUser,
} from '../controllers/user.controller.js';
import { protect, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// User profile & password routes (Protected)
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);

// Admin-only user management routes
router.get('/', protect, authorizeAdmin, getUsers);
router.get('/:id', protect, getUserById);
router.delete('/:id', protect, authorizeAdmin, deleteUser);

export default router;
