import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlinePhoto,
  HiOutlineSun,
  HiOutlineClock,
  HiOutlineChevronRight,
} from 'react-icons/hi2';
import { GiWheat, GiFarmer } from 'react-icons/gi';

const quickActions = [
  {
    path: '/chat',
    label: 'Ask AI',
    desc: 'Ask any farming question and get instant advice',
    icon: HiOutlineChatBubbleLeftRight,
    gradient: 'from-green-400 to-emerald-600',
    shadow: 'shadow-green-500/10',
  },
  {
    path: '/upload',
    label: 'Check Crop',
    desc: 'Upload a crop photo to identify diseases',
    icon: HiOutlinePhoto,
    gradient: 'from-orange-400 to-red-500',
    shadow: 'shadow-orange-500/10',
  },
  {
    path: '/weather',
    label: 'Weather Advice',
    desc: 'Get farming advice based on your local weather',
    icon: HiOutlineSun,
    gradient: 'from-yellow-400 to-orange-500',
    shadow: 'shadow-yellow-500/10',
  },
  {
    path: '/history',
    label: 'Past Queries',
    desc: 'View your previous conversations and results',
    icon: HiOutlineClock,
    gradient: 'from-blue-400 to-indigo-600',
    shadow: 'shadow-blue-500/10',
  },
];

const tips = [
  '🌾 Yellowing in wheat may indicate nitrogen deficiency',
  '💧 Early morning irrigation reduces water evaporation',
  '🌱 Crop rotation helps maintain soil fertility',
  '🐛 Neem oil works as a natural pesticide',
];

const Dashboard = () => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <GiFarmer className="w-7 h-7 sm:w-8 sm:h-8 text-primary-500 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-surface-900 truncate">
              {greeting}, <span className="gradient-text">{user?.name || 'Farmer'}!</span>
            </h1>
            <p className="text-surface-500 text-xs sm:text-sm">How can we help you today?</p>
          </div>
        </div>
      </motion.div>

      {/* Tip of the day */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 sm:mb-8 p-3 sm:p-4 bg-primary-50 border border-primary-100 rounded-2xl"
      >
        <div className="flex items-start gap-3">
          <GiWheat className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider mb-1">Farming Tip</p>
            <p className="text-sm text-primary-800 leading-relaxed">{randomTip}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Link
              to={action.path}
              className={`block p-4 sm:p-5 bg-white border border-surface-200 rounded-2xl hover:border-surface-300 hover:shadow-lg ${action.shadow} transition-all duration-300 group`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-surface-900 mb-0.5 sm:mb-1 text-sm sm:text-base">{action.label}</h3>
                  <p className="text-xs sm:text-sm text-surface-500 line-clamp-2">{action.desc}</p>
                </div>
                <HiOutlineChevronRight className="w-5 h-5 text-surface-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 sm:p-6 bg-white border border-surface-200 rounded-2xl"
      >
        <h2 className="text-base sm:text-lg font-bold text-surface-900 mb-3 sm:mb-4">🤖 About AI Assistant</h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { value: '24/7', label: 'Always Available' },
            { value: 'English/Hindi', label: 'Language Support' },
            { value: 'Voice Input', label: 'Speak your question' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-2 sm:p-3 bg-surface-50 rounded-xl">
              <p className="text-lg sm:text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-surface-500 mt-0.5 sm:mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
