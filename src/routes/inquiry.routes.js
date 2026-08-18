import express from 'express';
import {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
} from '../controllers/inquiry.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public route for lead submission
router.post('/', createInquiry);

// Admin protected routes for leads management
router.get('/', protect, getInquiries);
router.get('/:id', protect, getInquiryById);
router.put('/:id', protect, updateInquiry);
router.delete('/:id', protect, deleteInquiry);

export default router;
