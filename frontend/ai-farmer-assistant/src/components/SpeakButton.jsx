import { motion } from 'framer-motion';
import { HiOutlineSpeakerWave, HiOutlineStop } from 'react-icons/hi2';

const SpeakButton = ({ isSpeaking, onSpeak, onStop, size = 'sm' }) => {
  const sizeClasses = {
    xs: 'p-1 rounded-lg',
    sm: 'p-1.5 rounded-lg',
    md: 'p-2 rounded-xl',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={isSpeaking ? onStop : onSpeak}
      className={`${sizeClasses[size]} transition-all duration-200 ${
        isSpeaking
          ? 'bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-sm shadow-orange-200'
          : 'bg-surface-100 text-surface-400 hover:bg-primary-50 hover:text-primary-600'
      }`}
      title={isSpeaking ? 'Stop speaking' : 'Listen to response'}
    >
      {isSpeaking ? (
        <HiOutlineStop className={iconSizes[size]} />
      ) : (
        <HiOutlineSpeakerWave className={iconSizes[size]} />
      )}
    </motion.button>
  );
};

export default SpeakButton;
