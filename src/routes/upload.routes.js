import express from 'express';
import { upload } from '../middlewares/upload.middleware.js';
import { uploadImage } from '../controllers/upload.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Upload image endpoint (supports any image field name such as 'image', 'file', etc.)
router.post('/', upload.any(), uploadImage);

export default router;
