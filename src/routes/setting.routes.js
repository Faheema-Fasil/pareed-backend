import express from 'express';
import {
  getAllSettings,
  getSectionSetting,
  updateSectionSetting,
} from '../controllers/setting.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllSettings);
router.get('/:section', getSectionSetting);

// Protected Admin update route
router.put('/:section', protect, updateSectionSetting);

export default router;
