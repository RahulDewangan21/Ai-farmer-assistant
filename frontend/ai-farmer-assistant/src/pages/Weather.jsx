import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSun, HiOutlineMapPin, HiOutlineClipboard, HiOutlineSpeakerWave, HiOutlineStop } from 'react-icons/hi2';
import { GiWheat } from 'react-icons/gi';
import ReactMarkdown from 'react-markdown';
import { getWeather, getWeatherAdvice } from '../services/api';
import LanguageSelector from '../components/LanguageSelector';
import LoadingDots from '../components/LoadingDots';
import useTextToSpeech from '../hooks/useTextToSpeech';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const popularCities = ['Durg', 'Bhilai', 'Raipur', 'Bilaspur', 'Nagpur', 'Bhopal', 'Delhi', 'Mumbai'];

const Weather = () => {
  const { language } = useLanguage();
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const { isSpeaking, speak, stop } = useTextToSpeech();

  const t = {
    en: {
      title: 'Weather-Based Farming Advice',
      subtitle: 'Check weather in your city and get AI farming advice',
      placeholder: 'Enter city (e.g. Delhi)',
      search: 'Search',
      loadingText: 'Loading...',
      emptyState: 'Search a city to see weather 🌤️',
      humidity: 'Humidity',
      wind: 'Wind',
      feelsLike: 'Feels Like',
      getAdvice: 'Get AI Farming Advice',
      gettingAdvice: 'Getting advice',
      adviceTitle: 'AI Farming Advice',
      enterCity: 'Please enter a city name',
      weatherLoaded: 'Weather data loaded',
      weatherError: 'Could not fetch weather data.',
      adviceReady: 'Farming advice ready! 🌾',
      adviceFailed: 'Failed to get advice.',
      copied: 'Advice copied! 📋',
    },
    hi: {
      title: 'मौसम आधारित खेती सलाह',
      subtitle: 'अपने शहर का मौसम देखें और AI खेती सलाह पाएं',
      placeholder: 'शहर दर्ज करें (जैसे दिल्ली)',
      search: 'खोजें',
      loadingText: 'लोड हो रहा है...',
      emptyState: 'मौसम देखने के लिए शहर खोजें 🌤️',
      humidity: 'नमी',
      wind: 'हवा',
      feelsLike: 'महसूस',
      getAdvice: 'AI खेती सलाह लें',
      gettingAdvice: 'सलाह ले रहे हैं',
      adviceTitle: 'AI खेती सलाह',
      enterCity: 'कृपया शहर का नाम दर्ज करें',
      weatherLoaded: 'मौसम डेटा लोड हुआ',
      weatherError: 'मौसम डेटा नहीं मिला।',
      adviceReady: 'खेती सलाह तैयार! 🌾',
      adviceFailed: 'सलाह प्राप्त करने में विफल।',
      copied: 'सलाह कॉपी की! 📋',
    },
  };

  const text = t[language] || t.en;

  const fetchWeather = async (cityName = city) => {
    if (!cityName.trim()) {
      toast.error(text.enterCity);
      return;
    }

    setLoading(true);
    setAdvice('');

    try {
      const res = await getWeather(cityName.trim());
      console.log("API RESPONSE:", res.data);
      setWeatherData(res.data.data);
      toast.success(text.weatherLoaded);
    } catch (err) {
      console.error(err);
      toast.error(text.weatherError);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvice = async () => {
    if (!weatherData?.city) return;

    setAdviceLoading(true);
    try {
      const res = await getWeatherAdvice(weatherData.city, language);
      setAdvice(res.data.data.advice);
      toast.success(text.adviceReady);
    } catch (err) {
      toast.error(text.adviceFailed);
    } finally {
      setAdviceLoading(false);
    }
  };

  const copyAdvice = () => {
    navigator.clipboard.writeText(advice);
    toast.success(text.copied);
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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
              <HiOutlineSun className="w-7 h-7 text-yellow-500" />
              {text.title}
            </h1>
            <p className="text-surface-500 text-sm mt-1">{text.subtitle}</p>
          </div>
          <LanguageSelector />
        </div>
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
              placeholder={text.placeholder}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={() => fetchWeather()}
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? text.loadingText : text.search}
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
        <p className="text-center text-gray-400 mt-6">{text.emptyState}</p>
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
              <p className="text-xs">{text.humidity}</p>
              <p className="font-bold">
                {weatherData?.current?.humidity ?? "--"}%
              </p>
            </div>

            <div className="bg-white/10 p-3 rounded-xl text-center">
              <p className="text-xs">{text.wind}</p>
              <p className="font-bold">
                {weatherData?.current?.windSpeed ?? "--"} m/s
              </p>
            </div>

            <div className="bg-white/10 p-3 rounded-xl text-center">
              <p className="text-xs">{text.feelsLike}</p>
              <p className="font-bold">
                {weatherData?.current?.feelsLike ?? "--"}°C
              </p>
            </div>
          </div>

          <button
            onClick={fetchAdvice}
            disabled={adviceLoading}
            className="mt-4 w-full py-3 bg-white/20 rounded-xl flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
          >
            {adviceLoading ? <LoadingDots text={text.gettingAdvice} /> : (
              <>
                <GiWheat />
                {text.getAdvice}
              </>
            )}
          </button>
        </div>
      )}

      {/* Advice */}
      {advice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border rounded-2xl p-6 mt-6"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold flex items-center gap-2">
              <GiWheat className="text-primary-600" />
              {text.adviceTitle}
            </h3>

            <button
              onClick={copyAdvice}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-surface-100 text-surface-500 hover:bg-surface-200 hover:text-surface-700 transition-all"
            >
              <HiOutlineClipboard className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>

          <div className="ai-message">
            <ReactMarkdown>{advice}</ReactMarkdown>
          </div>

          {/* Big Listen Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={isSpeaking ? stop : () => speak(advice, language, 'weather-advice')}
            className={`w-full mt-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
              isSpeaking
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-300/40 hover:shadow-lg'
                : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-400/30 hover:shadow-lg hover:shadow-primary-400/40'
            }`}
          >
            {isSpeaking ? (
              <>
                <HiOutlineStop className="w-5 h-5" />
                {language === 'hi' ? 'रुकें' : 'Stop Listening'}
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </>
            ) : (
              <>
                <HiOutlineSpeakerWave className="w-5 h-5" />
                {language === 'hi' ? 'सलाह सुनें 🔊' : 'Listen to Advice 🔊'}
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Weather;