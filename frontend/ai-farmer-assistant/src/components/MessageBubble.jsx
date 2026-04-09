import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { HiOutlineClipboard, HiOutlineUser, HiOutlineSpeakerWave, HiOutlineStop } from 'react-icons/hi2';
import { GiWheat } from 'react-icons/gi';
import toast from 'react-hot-toast';

const MessageBubble = ({ message, isUser, onSpeak, onStopSpeak, isSpeaking }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    toast.success('Copied!', { icon: '📋' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-blue-400 to-blue-600'
            : 'bg-gradient-to-br from-primary-400 to-primary-600'
        }`}
      >
        {isUser ? <HiOutlineUser className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <GiWheat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
      </div>

      {/* Message */}
      <div className="max-w-[85%] sm:max-w-[80%] min-w-0">
        <div
          className={`rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm ${
            isUser
              ? 'bg-primary-600 text-white rounded-tr-sm'
              : 'bg-white border border-surface-200 text-surface-800 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className="text-xs sm:text-sm leading-relaxed break-words">{message}</p>
          ) : (
            <div className="ai-message text-xs sm:text-sm leading-relaxed break-words">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Action buttons for AI responses — always visible */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-2 ml-1">
            {/* Speak button — big and prominent */}
            {onSpeak && (
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={isSpeaking ? onStopSpeak : onSpeak}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${
                  isSpeaking
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-300/40'
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-400/30 hover:shadow-md hover:shadow-primary-400/40'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <HiOutlineStop className="w-4 h-4" />
                    <span>Stop</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </>
                ) : (
                  <>
                    <HiOutlineSpeakerWave className="w-4 h-4" />
                    <span>Listen 🔊</span>
                  </>
                )}
              </motion.button>
            )}
            {/* Copy button */}
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs bg-surface-100 text-surface-500 hover:bg-surface-200 hover:text-surface-700 transition-all"
              title="Copy"
            >
              <HiOutlineClipboard className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
