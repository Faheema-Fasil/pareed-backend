import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  bulkSaveServices,
  deleteService,
  getServiceCategories,
  addServiceCategory,
  deleteServiceCategory,
} from '../controllers/service.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Categories / Tags routes (Mount before /:id)
router.get('/categories', getServiceCategories);
router.get('/tags', getServiceCategories);
router.post('/categories', protect, addServiceCategory);
router.post('/tags', protect, addServiceCategory);
router.delete('/categories/:name', protect, deleteServiceCategory);

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

