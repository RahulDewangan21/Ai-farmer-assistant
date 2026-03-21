import express from 'express';
import { chat, analyzeImage } from '../controllers/ai.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/chat', authMiddleware, chat);
router.post('/image', authMiddleware, analyzeImage);

export default router;
