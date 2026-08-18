import express from 'express';
import {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  bulkSaveProducts,
  deleteProduct,
} from '../controllers/product.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);

// Admin bulk save route (placed before :id route)
router.put('/bulk', protect, bulkSaveProducts);
router.get('/admin', protect, getAdminProducts);

// Single item routes
router.get('/:id', getProductById);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
