import express from 'express';
import { getHistory, deleteHistory, clearHistory } from '../controllers/history.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getHistory);
router.delete('/clear', authMiddleware, clearHistory);
router.delete('/:id', authMiddleware, deleteHistory);

export default router;
