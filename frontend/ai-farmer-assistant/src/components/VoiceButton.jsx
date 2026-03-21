import { motion } from 'framer-motion';
import { HiOutlineMicrophone, HiOutlineStopCircle } from 'react-icons/hi2';

const VoiceButton = ({ isListening, onStart, onStop }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={isListening ? onStop : onStart}
      className={`relative p-3 rounded-xl transition-all duration-300 ${
        isListening
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 pulse-glow'
          : 'bg-surface-100 text-surface-500 hover:bg-primary-50 hover:text-primary-600'
      }`}
      title={isListening ? 'Stop' : 'Speak your question'}
    >
      {isListening ? (
        <HiOutlineStopCircle className="w-5 h-5" />
      ) : (
        <HiOutlineMicrophone className="w-5 h-5" />
      )}
      {isListening && (
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 rounded-xl bg-red-500"
        />
      )}
    </motion.button>
  );
};

export default VoiceButton;
