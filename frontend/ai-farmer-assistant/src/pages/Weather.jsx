import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSun, HiOutlineMapPin, HiOutlineClipboard } from 'react-icons/hi2';
import { GiWheat } from 'react-icons/gi';
import ReactMarkdown from 'react-markdown';
import { getWeather, getWeatherAdvice } from '../services/api';
import LoadingDots from '../components/LoadingDots';
import toast from 'react-hot-toast';

const popularCities = ['Delhi', 'Mumbai', 'Lucknow', 'Jaipur', 'Patna', 'Bhopal', 'Chandigarh', 'Hyderabad'];

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [adviceLoading, setAdviceLoading] = useState(false);

  const fetchWeather = async (cityName = city) => {
    if (!cityName.trim()) {
      toast.error('Please enter a city name');
      return;
    }
    setLoading(true);
    setAdvice('');
    try {
      const res = await getWeather(cityName.trim());
      setWeatherData(res.data.data);
      toast.success('Weather data loaded! ☀️');
    } catch (err) {
      toast.error('Could not fetch weather data. Check city name.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvice = async () => {
    if (!weatherData) return;
    setAdviceLoading(true);
    try {
      const res = await getWeatherAdvice(weatherData.city);
      setAdvice(res.data.data.advice);
      toast.success('Farming advice ready! 🌾');
    } catch (err) {
      toast.error('Failed to get advice.');
    } finally {
      setAdviceLoading(false);
    }
  };

  const copyAdvice = () => {
    navigator.clipboard.writeText(advice);
    toast.success('Advice copied! 📋');
  };

  const getWeatherIcon = (desc) => {
    if (desc?.includes('cloud')) return '☁️';
    if (desc?.includes('rain')) return '🌧️';
    if (desc?.includes('clear')) return '☀️';
    if (desc?.includes('mist') || desc?.includes('fog')) return '🌫️';
    if (desc?.includes('storm')) return '⛈️';
    return '🌤️';
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <HiOutlineSun className="w-7 h-7 text-yellow-500" />
          Weather-Based Farming Advice
        </h1>
        <p className="text-surface-500 text-sm mt-1">Check weather in your city and get AI farming advice</p>
      </motion.div>

      {/* City input */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <HiOutlineMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              id="city-input"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
              placeholder="Enter city name (e.g. Delhi, Lucknow)"
              className="w-full pl-10 pr-4 py-3 bg-white border border-surface-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm transition-all"
            />
          </div>
          <button
            onClick={() => fetchWeather()}
            disabled={loading}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md"
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>

        {/* Popular cities */}
        <div className="flex flex-wrap gap-2 mt-3">
          {popularCities.map((c) => (
            <button
              key={c}
              onClick={() => { setCity(c); fetchWeather(c); }}
              className="px-3 py-1 text-xs bg-surface-100 text-surface-600 rounded-full hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Weather Data Card */}
      {weatherData && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{weatherData.city}, {weatherData.country}</h2>
                <p className="text-blue-100 capitalize text-sm">{weatherData.description}</p>
              </div>
              <span className="text-4xl">{getWeatherIcon(weatherData.description)}</span>
            </div>
            <div className="text-5xl font-bold mb-4">{weatherData.temp}°C</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xs text-blue-200">Humidity</p>
                <p className="font-bold">{weatherData.humidity}%</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xs text-blue-200">Wind</p>
                <p className="font-bold">{weatherData.windSpeed} m/s</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xs text-blue-200">Feels Like</p>
                <p className="font-bold">{weatherData.feelsLike}°C</p>
              </div>
            </div>

            <button
              onClick={fetchAdvice}
              disabled={adviceLoading}
              className="mt-4 w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              {adviceLoading ? (
                <LoadingDots text="Getting advice" />
              ) : (
                <>
                  <GiWheat className="w-5 h-5" />
                  Get AI Farming Advice
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Advice */}
      {advice && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-surface-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GiWheat className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-surface-900">AI Farming Advice</h3>
            </div>
            <button onClick={copyAdvice} className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-primary-600 transition-colors">
              <HiOutlineClipboard className="w-4 h-4" />
            </button>
          </div>
          <div className="ai-message text-sm text-surface-700 leading-relaxed">
            <ReactMarkdown>{advice}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Weather;
