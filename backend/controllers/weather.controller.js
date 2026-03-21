import { getWeatherData } from '../services/weather.service.js';
import { getWeatherAdvice } from '../services/gemini.service.js';
import History from '../models/History.js';

// GET /api/weather/:city
export const getWeather = async (req, res) => {
  try {
    const { city } = req.params;
    const weatherData = await getWeatherData(city || 'Delhi');
    res.json({ success: true, data: weatherData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/weather/advice
export const getWeatherFarmingAdvice = async (req, res) => {
  try {
    const { city } = req.body;
    const location = city || 'Delhi';

    const weatherData = await getWeatherData(location);
    const advice = await getWeatherAdvice(weatherData, location);

    // Save to history
    await History.create({
      userId: req.user._id,
      type: 'weather',
      input: `Weather advice for ${location}`,
      response: advice,
    });

    res.json({
      success: true,
      data: {
        weather: weatherData,
        advice,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
