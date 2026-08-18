import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Protected Admin dashboard stats
router.get('/stats', protect, getDashboardStats);

export default router;
