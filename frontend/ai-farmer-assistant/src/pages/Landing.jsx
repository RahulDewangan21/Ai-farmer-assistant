import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiWheat, GiFarmer, GiPlantSeed, GiSunCloud } from 'react-icons/gi';
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlinePhoto,
  HiOutlineMicrophone,
  HiOutlineSun,
  HiOutlineChevronRight,
  HiOutlineSparkles,
} from 'react-icons/hi2';

const features = [
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: 'AI Chat Assistant',
    desc: 'Ask any farming question and get instant expert advice in simple language.',
    color: 'from-green-500 to-emerald-600',
    border: 'border-green-100',
  },
  {
    icon: HiOutlinePhoto,
    title: 'Crop Disease Detection',
    desc: 'Upload a photo of your crop and let AI identify diseases and suggest treatments.',
    color: 'from-orange-400 to-red-500',
    border: 'border-orange-100',
  },
  {
    icon: HiOutlineMicrophone,
    title: 'Voice Input',
    desc: 'Speak your question — no typing needed. Supports Hindi voice recognition.',
    color: 'from-purple-400 to-indigo-600',
    border: 'border-purple-100',
  },
  {
    icon: HiOutlineSun,
    title: 'Weather-Based Advice',
    desc: 'Get location-specific weather data and AI farming advice based on conditions.',
    color: 'from-yellow-400 to-orange-500',
    border: 'border-yellow-100',
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-surface-900 overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <GiWheat className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">AgroGenAI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900">
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 md:pt-44 pb-20 px-6 overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-[140px]" />
        <div className="absolute top-60 right-1/4 w-[300px] h-[300px] bg-yellow-100/30 rounded-full blur-[100px]" />

        <div className="max-w-6xl mx-auto text-center relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 mb-8">
              <HiOutlineSparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm text-primary-700 font-medium">
                Generative AI Powered
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] mb-8">
              <span className="block">Your Smart</span>
              <span className="block gradient-text">AI Farm Assistant</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-surface-500 max-w-2xl mx-auto mb-10">
              Identify crop diseases, get weather-based farming advice, and ask AI any agriculture question — all in one place.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">

              <Link
                to="/signup"
                className="group px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-2xl text-lg font-semibold text-white shadow-xl flex items-center justify-center gap-2"
              >
                <GiFarmer className="w-5 h-5" />
                Start Free
                <HiOutlineChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                to="/login"
                className="px-8 py-4 bg-surface-100 hover:bg-surface-200 border border-surface-200 rounded-2xl text-lg font-medium text-surface-700 text-center"
              >
                Log In
              </Link>
            </div>

          </motion.div>

          {/* Floating icons */}
          <div className="mt-16 flex justify-center gap-6 flex-wrap">
            {[GiPlantSeed, GiWheat, GiSunCloud].map((Icon, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
                className="w-14 h-14 rounded-2xl bg-white border shadow-sm flex items-center justify-center"
              >
                <Icon className="w-7 h-7 text-primary-500" />
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-surface-50">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful <span className="gradient-text">AI Features</span>
            </h2>
            <p className="text-surface-500 text-lg">
              Built for every farmer — simple, fast, and reliable
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl bg-white border ${feature.border} shadow-sm hover:shadow-lg transition h-full flex flex-col`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>

                <p className="text-surface-500 flex-grow">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center px-6 py-14 rounded-3xl bg-gradient-to-br from-primary-50 to-green-50 border border-primary-200">

          <GiWheat className="w-12 h-12 text-primary-500 mx-auto mb-6" />

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started Today
          </h2>

          <p className="text-surface-500 text-lg mb-8 max-w-xl mx-auto">
            Transform your farming with the power of AI. Registration is free!
          </p>

          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-2xl text-lg font-semibold text-white shadow-xl"
          >
            Sign Up Now
            <HiOutlineChevronRight className="w-5 h-5" />
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 py-8 px-6 bg-surface-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">

          <div className="flex items-center gap-2">
            <GiWheat className="w-5 h-5 text-primary-500" />
            <span className="text-sm text-surface-500">
              AI Farmer Assistant © 2026
            </span>
          </div>

          <span className="text-xs text-surface-400">
            Made with ❤️ for Indian Farmers
          </span>

        </div>
      </footer>
    </div>
  );
};

export default Landing;