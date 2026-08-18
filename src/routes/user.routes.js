import express from 'express';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
} from '../controllers/user.controller.js';
import { protect, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// User profile route (Protected)
router.put('/profile', protect, updateUserProfile);

// Admin-only user management routes
router.get('/', protect, authorizeAdmin, getUsers);
router.get('/:id', protect, getUserById);
router.delete('/:id', protect, authorizeAdmin, deleteUser);

export default router;
