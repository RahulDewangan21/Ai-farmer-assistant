import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { HiOutlineClipboard, HiOutlineUser } from 'react-icons/hi2';
import { GiWheat } from 'react-icons/gi';
import toast from 'react-hot-toast';

const MessageBubble = ({ message, isUser }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    toast.success('Copied!', { icon: '📋' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 group ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-blue-400 to-blue-600'
            : 'bg-gradient-to-br from-primary-400 to-primary-600'
        }`}
      >
        {isUser ? <HiOutlineUser className="w-4 h-4" /> : <GiWheat className="w-4 h-4" />}
      </div>

      {/* Message */}
      <div className="relative max-w-[80%]">
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-primary-600 text-white rounded-tr-sm'
              : 'bg-white border border-surface-200 text-surface-800 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{message}</p>
          ) : (
            <div className="ai-message text-sm leading-relaxed">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy button for AI responses */}
        {!isUser && (
          <button
            onClick={copyToClipboard}
            className="absolute -bottom-3 right-2 p-1.5 rounded-lg bg-white border border-surface-200 text-surface-400 hover:text-primary-600 hover:border-primary-300 transition-all shadow-sm opacity-0 group-hover:opacity-100"
            title="Copy"
          >
            <HiOutlineClipboard className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
