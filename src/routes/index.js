import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import productRoutes from './product.routes.js';
import serviceRoutes from './service.routes.js';
import teamRoutes from './team.routes.js';
import whyChooseUsRoutes from './whyChooseUs.routes.js';
import inquiryRoutes from './inquiry.routes.js';
import settingRoutes from './setting.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import uploadRoutes from './upload.routes.js';
import { getSectionSetting, updateSectionSetting } from '../controllers/setting.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Pareed API Server is running healthy',
    timestamp: new Date().toISOString(),
  });
});

// Direct Mission & Vision routes
router.get('/mission-vision', (req, res, next) => {
  req.params.section = 'mission-vision';
  getSectionSetting(req, res, next);
});
router.put('/mission-vision', protect, (req, res, next) => {
  req.params.section = 'mission-vision';
  updateSectionSetting(req, res, next);
});

// Mount sub-routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/services', serviceRoutes);
router.use('/team', teamRoutes);
router.use('/why-choose-us', whyChooseUsRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/settings', settingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/upload', uploadRoutes);

export default router;
