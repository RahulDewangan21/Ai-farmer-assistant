import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSun, HiOutlineMapPin, HiOutlineClipboard } from 'react-icons/hi2';
import { GiWheat } from 'react-icons/gi';
import ReactMarkdown from 'react-markdown';
import { getWeather, getWeatherAdvice } from '../services/api';
import LoadingDots from '../components/LoadingDots';
import toast from 'react-hot-toast';

const popularCities = ['Durg', 'Bhilai', 'Raipur', 'Bilaspur', 'Nagpur', 'Bhopal', 'Delhi', 'Mumbai'];

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

      console.log("API RESPONSE:", res.data);

      setWeatherData(res.data.data); // ✅ fixed

      toast.success('Weather data loaded! ☀️');
    } catch (err) {
      console.error(err);
      toast.error('Could not fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvice = async () => {
    if (!weatherData?.city) return;

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
    if (!desc) return '🌤️';
    desc = desc.toLowerCase();
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('clear')) return '☀️';
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
    if (desc.includes('storm')) return '⛈️';
    return '🌤️';
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <HiOutlineSun className="w-7 h-7 text-yellow-500" />
          Weather-Based Farming Advice
        </h1>
        <p className="text-surface-500 text-sm mt-1">
          Check weather in your city and get AI farming advice
        </p>
      </motion.div>

      {/* Input */}
      <div className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <HiOutlineMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
              placeholder="Enter city (e.g. Delhi)"
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={fetchWeather}
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {/* Popular cities */}
        <div className="flex flex-wrap gap-2 mt-3">
          {popularCities.map((c) => (
            <button
              key={c}
              onClick={() => { setCity(c); fetchWeather(c); }}
              className="px-3 py-1 text-xs bg-surface-100 rounded-full hover:bg-primary-50"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {!weatherData && !loading && (
        <p className="text-center text-gray-400 mt-6">
          Search a city to see weather 🌤️
        </p>
      )}

      {/* Weather Card */}
      {weatherData?.current && (
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-xl">

          <div className="flex justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">
                {weatherData?.city}, {weatherData?.country}
              </h2>
              <p className="capitalize text-blue-100">
                {weatherData?.current?.description || "No data"}
              </p>
            </div>

            <span className="text-4xl">
              {getWeatherIcon(weatherData?.current?.description)}
            </span>
          </div>

          <div className="text-5xl font-bold mb-4">
            {weatherData?.current?.temp ?? "--"}°C
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 p-3 rounded-xl text-center">
              <p className="text-xs">Humidity</p>
              <p className="font-bold">
                {weatherData?.current?.humidity ?? "--"}%
              </p>
            </div>

            <div className="bg-white/10 p-3 rounded-xl text-center">
              <p className="text-xs">Wind</p>
              <p className="font-bold">
                {weatherData?.current?.windSpeed ?? "--"} m/s
              </p>
            </div>

            <div className="bg-white/10 p-3 rounded-xl text-center">
              <p className="text-xs">Feels Like</p>
              <p className="font-bold">
                {weatherData?.current?.feelsLike ?? "--"}°C
              </p>
            </div>
          </div>

          <button
            onClick={fetchAdvice}
            disabled={adviceLoading}
            className="mt-4 w-full py-3 bg-white/20 rounded-xl flex items-center justify-center gap-2"
          >
            {adviceLoading ? <LoadingDots text="Getting advice" /> : (
              <>
                <GiWheat />
                Get AI Farming Advice
              </>
            )}
          </button>
        </div>
      )}

      {/* Advice */}
      {advice && (
        <div className="bg-white border rounded-2xl p-6 mt-6">
          <div className="flex justify-between mb-3">
            <h3 className="font-bold">AI Farming Advice</h3>

            <button onClick={copyAdvice}>
              <HiOutlineClipboard />
            </button>
          </div>

          <div className="ai-message">
            <ReactMarkdown>{advice}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;