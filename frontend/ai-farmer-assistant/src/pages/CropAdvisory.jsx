import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMapPin, HiOutlineClipboard, HiOutlineSpeakerWave, HiOutlineStop, HiOutlineCalendarDays } from 'react-icons/hi2';
import { GiWheat, GiPlantSeed } from 'react-icons/gi';
import ReactMarkdown from 'react-markdown';
import { getWeather, getCropAdvisory } from '../services/api';
import LanguageSelector from '../components/LanguageSelector';
import LoadingDots from '../components/LoadingDots';
import useTextToSpeech from '../hooks/useTextToSpeech';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const popularCities = ['Durg', 'Bhilai', 'Raipur', 'Bilaspur', 'Nagpur', 'Bhopal', 'Delhi', 'Mumbai'];

const seasonMap = {
  1: { en: 'Rabi (Winter)', hi: 'रबी (सर्दी)', emoji: '❄️', color: 'from-blue-500 to-cyan-500' },
  2: { en: 'Rabi (Winter)', hi: 'रबी (सर्दी)', emoji: '❄️', color: 'from-blue-500 to-cyan-500' },
  3: { en: 'Rabi (Spring)', hi: 'रबी (बसंत)', emoji: '🌸', color: 'from-pink-500 to-rose-400' },
  4: { en: 'Zaid (Summer)', hi: 'जायद (गर्मी)', emoji: '☀️', color: 'from-orange-500 to-yellow-500' },
  5: { en: 'Zaid (Summer)', hi: 'जायद (गर्मी)', emoji: '☀️', color: 'from-orange-500 to-yellow-500' },
  6: { en: 'Kharif (Monsoon)', hi: 'खरीफ (बरसात)', emoji: '🌧️', color: 'from-emerald-500 to-teal-500' },
  7: { en: 'Kharif (Monsoon)', hi: 'खरीफ (बरसात)', emoji: '🌧️', color: 'from-emerald-500 to-teal-500' },
  8: { en: 'Kharif (Monsoon)', hi: 'खरीफ (बरसात)', emoji: '🌧️', color: 'from-emerald-500 to-teal-500' },
  9: { en: 'Kharif (Monsoon)', hi: 'खरीफ (बरसात)', emoji: '🌧️', color: 'from-emerald-500 to-teal-500' },
  10: { en: 'Rabi (Autumn)', hi: 'रबी (पतझड़)', emoji: '🍂', color: 'from-amber-500 to-orange-500' },
  11: { en: 'Rabi (Winter)', hi: 'रबी (सर्दी)', emoji: '❄️', color: 'from-blue-500 to-cyan-500' },
  12: { en: 'Rabi (Winter)', hi: 'रबी (सर्दी)', emoji: '❄️', color: 'from-blue-500 to-cyan-500' },
};

const monthNames = {
  en: ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  hi: ['', 'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
};

const CropAdvisory = () => {
  const { language } = useLanguage();
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [advisory, setAdvisory] = useState('');
  const [loading, setLoading] = useState(false);
  const [advisoryLoading, setAdvisoryLoading] = useState(false);
  const { isSpeaking, speak, stop } = useTextToSpeech();

  const currentMonth = new Date().getMonth() + 1;
  const currentSeason = seasonMap[currentMonth];

  const t = {
    en: {
      title: 'Crop Advisory',
      subtitle: 'Get AI-powered crop recommendations based on your weather & season',
      placeholder: 'Enter your city (e.g. Raipur)',
      search: 'Search',
      loadingText: 'Loading...',
      emptyState: 'Enter a city to get personalized crop recommendations 🌾',
      currentSeason: 'Current Season',
      month: 'Month',
      getAdvisory: 'Get Crop Recommendations',
      gettingAdvisory: 'Analyzing',
      advisoryTitle: 'AI Crop Advisory',
      enterCity: 'Please enter a city name',
      weatherLoaded: 'Weather data loaded',
      weatherError: 'Could not fetch weather data.',
      advisoryReady: 'Crop advisory ready! 🌾',
      advisoryFailed: 'Failed to get crop advisory.',
      copied: 'Advisory copied! 📋',
      listenBtn: 'Listen to Advisory 🔊',
      stopBtn: 'Stop Listening',
      temp: 'Temperature',
      humidity: 'Humidity',
      condition: 'Condition',
    },
    hi: {
      title: 'फसल सलाहकार',
      subtitle: 'अपने मौसम और ऋतु के आधार पर AI फसल सिफारिशें पाएं',
      placeholder: 'अपना शहर दर्ज करें (जैसे रायपुर)',
      search: 'खोजें',
      loadingText: 'लोड हो रहा है...',
      emptyState: 'व्यक्तिगत फसल सिफारिशें पाने के लिए शहर दर्ज करें 🌾',
      currentSeason: 'वर्तमान ऋतु',
      month: 'महीना',
      getAdvisory: 'फसल सिफारिशें पाएं',
      gettingAdvisory: 'विश्लेषण हो रहा है',
      advisoryTitle: 'AI फसल सलाह',
      enterCity: 'कृपया शहर का नाम दर्ज करें',
      weatherLoaded: 'मौसम डेटा लोड हुआ',
      weatherError: 'मौसम डेटा नहीं मिला।',
      advisoryReady: 'फसल सलाह तैयार! 🌾',
      advisoryFailed: 'फसल सलाह प्राप्त करने में विफल।',
      copied: 'सलाह कॉपी की! 📋',
      listenBtn: 'सलाह सुनें 🔊',
      stopBtn: 'रुकें',
      temp: 'तापमान',
      humidity: 'नमी',
      condition: 'स्थिति',
    },
  };

  const text = t[language] || t.en;

  const fetchWeatherAndAdvisory = async (cityName = city) => {
    if (!cityName.trim()) {
      toast.error(text.enterCity);
      return;
    }

    setLoading(true);
    setAdvisory('');
    setWeatherData(null);

    try {
      // 1. First fetch weather
      const weatherRes = await getWeather(cityName.trim());
      setWeatherData(weatherRes.data.data);
      toast.success(text.weatherLoaded);

      // 2. Then automatically get crop advisory
      setAdvisoryLoading(true);
      const advRes = await getCropAdvisory(cityName.trim(), language);
      setAdvisory(advRes.data.data.advisory);
      toast.success(text.advisoryReady);
    } catch (err) {
      console.error(err);
      toast.error(text.advisoryFailed);
    } finally {
      setLoading(false);
      setAdvisoryLoading(false);
    }
  };

  const copyAdvisory = () => {
    navigator.clipboard.writeText(advisory);
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
            <h1 className="text-xl sm:text-2xl font-bold text-surface-900 flex items-center gap-2">
              <GiPlantSeed className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600" />
              {text.title}
            </h1>
            <p className="text-surface-500 text-xs sm:text-sm mt-1">{text.subtitle}</p>
          </div>
          <LanguageSelector />
        </div>
      </motion.div>

      {/* Season Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`bg-gradient-to-r ${currentSeason.color} text-white rounded-2xl p-4 sm:p-5 mb-6 shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">{currentSeason.emoji}</span>
            <div>
              <p className="text-xs uppercase tracking-wider opacity-80">{text.currentSeason}</p>
              <p className="text-lg sm:text-xl font-bold">{currentSeason[language] || currentSeason.en}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-xs opacity-80">
              <HiOutlineCalendarDays className="w-4 h-4" />
              {text.month}
            </div>
            <p className="text-lg font-bold">{monthNames[language]?.[currentMonth] || monthNames.en[currentMonth]}</p>
          </div>
        </div>
      </motion.div>

      {/* City Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <HiOutlineMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeatherAndAdvisory()}
              placeholder={text.placeholder}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <button
            onClick={() => fetchWeatherAndAdvisory()}
            disabled={loading || advisoryLoading}
            className="px-5 sm:px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-medium text-sm transition-colors"
          >
            {loading ? text.loadingText : text.search}
          </button>
        </div>

        {/* Popular cities */}
        <div className="flex flex-wrap gap-2 mt-3">
          {popularCities.map((c) => (
            <button
              key={c}
              onClick={() => { setCity(c); fetchWeatherAndAdvisory(c); }}
              className="px-3 py-1 text-xs bg-surface-100 rounded-full hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Empty state */}
      {!weatherData && !loading && !advisoryLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <GiPlantSeed className="w-16 h-16 mx-auto mb-4 text-surface-200" />
          <p className="text-surface-400 text-sm">{text.emptyState}</p>
        </motion.div>
      )}

      {/* Loading state */}
      {(loading || advisoryLoading) && !advisory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-100 flex items-center justify-center">
            <GiWheat className="w-8 h-8 text-primary-600 animate-pulse" />
          </div>
          <LoadingDots text={advisoryLoading ? text.gettingAdvisory : text.loadingText} />
        </motion.div>
      )}

      {/* Weather + Advisory Results */}
      {weatherData?.current && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Compact Weather Summary */}
          <div className="bg-white border border-surface-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getWeatherIcon(weatherData?.current?.description)}</span>
                <div>
                  <h3 className="font-bold text-surface-900">
                    {weatherData?.city}, {weatherData?.country}
                  </h3>
                  <p className="text-xs text-surface-400 capitalize">{weatherData?.current?.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-xs text-surface-400">{text.temp}</p>
                  <p className="font-bold text-surface-900">{weatherData?.current?.temp ?? '--'}°C</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-surface-400">{text.humidity}</p>
                  <p className="font-bold text-surface-900">{weatherData?.current?.humidity ?? '--'}%</p>
                </div>
                <div className="text-center hidden sm:block">
                  <p className="text-xs text-surface-400">{text.condition}</p>
                  <p className="font-bold text-surface-900 capitalize">{weatherData?.current?.description?.split(' ')[0] || '--'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Advisory Content */}
          {advisory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-surface-200 rounded-2xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-surface-900 flex items-center gap-2 text-base">
                  <GiPlantSeed className="w-5 h-5 text-primary-600" />
                  {text.advisoryTitle}
                </h3>
                <button
                  onClick={copyAdvisory}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-surface-100 text-surface-500 hover:bg-surface-200 hover:text-surface-700 transition-all"
                >
                  <HiOutlineClipboard className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>

              <div className="ai-message prose prose-sm max-w-none text-surface-700 leading-relaxed text-sm">
                <ReactMarkdown>{advisory}</ReactMarkdown>
              </div>

              {/* Big Listen Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={isSpeaking ? stop : () => speak(advisory, language, 'crop-advisory')}
                className={`w-full mt-5 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                  isSpeaking
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-300/40 hover:shadow-lg'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-400/30 hover:shadow-lg hover:shadow-primary-400/40'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <HiOutlineStop className="w-5 h-5" />
                    {text.stopBtn}
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </>
                ) : (
                  <>
                    <HiOutlineSpeakerWave className="w-5 h-5" />
                    {text.listenBtn}
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CropAdvisory;
