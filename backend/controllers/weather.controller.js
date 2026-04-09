import { getWeatherData } from '../services/weather.service.js';
import { getWeatherAdvice, getCropAdvisory } from '../services/gemini.service.js';
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
    const { city, language } = req.body;
    const location = city || 'Delhi';

    const weatherData = await getWeatherData(location);
    const advice = await getWeatherAdvice(weatherData.current, location, language || 'en');

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

// POST /api/weather/crop-advisory
export const getCropAdvisoryController = async (req, res) => {
  try {
    const { city, language } = req.body;
    const location = city || 'Delhi';
    const currentMonth = new Date().getMonth() + 1; // 1-12

    const weatherData = await getWeatherData(location);
    const advisory = await getCropAdvisory(weatherData.current, location, currentMonth, language || 'en');

    // Save to history
    await History.create({
      userId: req.user._id,
      type: 'crop-advisory',
      input: `Crop advisory for ${location}`,
      response: advisory,
    });

    res.json({
      success: true,
      data: {
        weather: weatherData,
        advisory,
        month: currentMonth,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
