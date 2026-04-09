import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-surface-100 rounded-xl p-1" id="language-selector">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
          language === 'en'
            ? 'bg-white text-primary-700 shadow-sm'
            : 'text-surface-400 hover:text-surface-600'
        }`}
      >
        🇬🇧 EN
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setLanguage('hi')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
          language === 'hi'
            ? 'bg-white text-primary-700 shadow-sm'
            : 'text-surface-400 hover:text-surface-600'
        }`}
      >
        🇮🇳 हिंदी
      </motion.button>
    </div>
  );
};

export default LanguageSelector;
