import express from 'express';
import {
  getWhyChooseUs,
  bulkSaveWhyChooseUs,
} from '../controllers/whyChooseUs.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getWhyChooseUs);
router.put('/bulk', protect, bulkSaveWhyChooseUs);

export default router;
