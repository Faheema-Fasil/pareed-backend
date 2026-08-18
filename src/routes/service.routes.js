import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  bulkSaveServices,
  deleteService,
} from '../controllers/service.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getServices);

// Admin bulk save route
router.put('/bulk', protect, bulkSaveServices);

// Single item routes
router.get('/:id', getServiceById);
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

export default router;
