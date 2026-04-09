import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePaperAirplane } from 'react-icons/hi2';
import { GiWheat } from 'react-icons/gi';
import MessageBubble from '../components/MessageBubble';
import VoiceButton from '../components/VoiceButton';
import LanguageSelector from '../components/LanguageSelector';
import LoadingDots from '../components/LoadingDots';
import useVoiceInput from '../hooks/useVoiceInput';
import useTextToSpeech from '../hooks/useTextToSpeech';
import { useLanguage } from '../context/LanguageContext';
import { aiChat } from '../services/api';
import toast from 'react-hot-toast';

const suggestedQuestions = {
  en: [
    'How to treat yellow leaves in wheat?',
    'How to grow tomatoes at home?',
    'How to control pests in rice?',
    'How to make organic compost?',
  ],
  hi: [
    'गेहूं में पीले पत्तों का इलाज कैसे करें?',
    'घर पर टमाटर कैसे उगाएं?',
    'धान में कीटों को कैसे रोकें?',
    'जैविक खाद कैसे बनाएं?',
  ],
};

const Chat = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      text: language === 'hi'
        ? 'नमस्ते! मैं आपका AI कृषि सहायक हूँ। मुझसे कोई भी खेती का सवाल पूछें — मैं आपको सरल हिंदी में व्यावहारिक सलाह दूँगा। 🌾'
        : 'Hello! I am your AI Agriculture Assistant. Ask me any farming question — I\'ll give you practical advice in simple English/Hindi.',
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { isListening, transcript, startListening, stopListening, setTranscript } = useVoiceInput();
  const { isSpeaking, currentUtteranceId, speak, stop } = useTextToSpeech();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      setTranscript('');
    }
  }, [transcript]);

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;

    const userMessage = text.trim();
    setInput('');
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setLoading(true);

    try {
      const res = await aiChat(userMessage, language);
      const aiMsg = res.data.data.message;
      setMessages((prev) => [...prev, { text: aiMsg, isUser: false }]);
    } catch (err) {
      toast.error(language === 'hi' ? 'जवाब प्राप्त करने में विफल। कृपया पुनः प्रयास करें।' : 'Failed to get response. Please try again.');
      setMessages((prev) => [
        ...prev,
        { text: language === 'hi' ? 'क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें। 🙏' : 'Sorry, something went wrong. Please try again. 🙏', isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleVoiceStart = () => {
    startListening(language);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen max-w-4xl mx-auto p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-surface-200">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md flex-shrink-0">
          <GiWheat className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-surface-900">
            {language === 'hi' ? 'AI कृषि चैट' : 'AI Farm Chat'}
          </h1>
          <p className="text-xs text-surface-400">
            {language === 'hi' ? 'कोई भी खेती का सवाल पूछें' : 'Ask any farming question'}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <LanguageSelector />
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-surface-400 hidden sm:inline">
              {language === 'hi' ? 'ऑनलाइन' : 'Online'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-3 sm:space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg.text}
            isUser={msg.isUser}
            onSpeak={!msg.isUser ? () => speak(msg.text, language, `chat-${i}`) : undefined}
            onStopSpeak={stop}
            isSpeaking={isSpeaking && currentUtteranceId === `chat-${i}`}
          />
        ))}
        {loading && (
          <div className="flex gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
              <GiWheat className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="bg-white border border-surface-200 rounded-2xl rounded-tl-sm px-3 sm:px-4 py-2.5 sm:py-3">
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-1.5 sm:gap-2 pb-2 sm:pb-3"
        >
          {(suggestedQuestions[language] || suggestedQuestions.en).map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs bg-primary-50 text-primary-700 border border-primary-100 rounded-full hover:bg-primary-100 transition-colors"
            >
              {q}
            </button>
          ))}
        </motion.div>
      )}

      {/* Input area */}
      <div className="pt-2 sm:pt-3 border-t border-surface-200">
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-red-500 text-xs mb-2"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {language === 'hi' ? 'सुन रहा है... हिंदी में बोलें' : 'Listening... speak in English'}
          </motion.div>
        )}
        <div className="flex items-end gap-2">
          <VoiceButton
            isListening={isListening}
            onStart={handleVoiceStart}
            onStop={stopListening}
          />
          <div className="flex-1 min-w-0">
            <textarea
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'hi' ? 'यहाँ अपना सवाल लिखें...' : 'Type your question here...'}
              rows={1}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-surface-200 rounded-xl resize-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm transition-all"
              style={{ maxHeight: '120px' }}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="p-2.5 sm:p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-200 disabled:text-surface-400 text-white rounded-xl transition-all shadow-md shadow-primary-600/20 disabled:shadow-none flex-shrink-0"
          >
            <HiOutlinePaperAirplane className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
