import express from 'express';
import { getWeather, getWeatherFarmingAdvice, getCropAdvisoryController } from '../controllers/weather.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:city', authMiddleware, getWeather);
router.post('/advice', authMiddleware, getWeatherFarmingAdvice);
router.post('/crop-advisory', authMiddleware, getCropAdvisoryController);

export default router;
