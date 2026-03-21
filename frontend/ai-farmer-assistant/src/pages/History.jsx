import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineClock,
  HiOutlineChatBubbleLeftRight,
  HiOutlinePhoto,
  HiOutlineSun,
  HiOutlineTrash,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
} from 'react-icons/hi2';
import ReactMarkdown from 'react-markdown';
import { getHistory, deleteHistoryItem, clearAllHistory } from '../services/api';
import toast from 'react-hot-toast';

const typeConfig = {
  chat: { label: 'Chat', icon: HiOutlineChatBubbleLeftRight, color: 'bg-green-100 text-green-700' },
  image: { label: 'Image', icon: HiOutlinePhoto, color: 'bg-orange-100 text-orange-700' },
  weather: { label: 'Weather', icon: HiOutlineSun, color: 'bg-blue-100 text-blue-700' },
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = filter ? { type: filter } : {};
      const res = await getHistory(params);
      setHistory(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      setHistory(history.filter((h) => h._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all history?')) return;
    try {
      await clearAllHistory();
      setHistory([]);
      toast.success('All history cleared');
    } catch {
      toast.error('Failed to clear');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
              <HiOutlineClock className="w-7 h-7 text-primary-600" />
              History
            </h1>
            <p className="text-surface-500 text-sm mt-1">Your past conversations and analyses</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-1.5"
            >
              <HiOutlineTrash className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: '', label: 'All' },
          { value: 'chat', label: '💬 Chat' },
          { value: 'image', label: '📷 Image' },
          { value: 'weather', label: '☀️ Weather' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-sm rounded-xl font-medium whitespace-nowrap transition-all ${
              filter === f.value
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white border border-surface-200 text-surface-600 hover:border-primary-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* History List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <HiOutlineClock className="w-16 h-16 text-surface-200 mx-auto mb-4" />
          <p className="text-surface-400 text-lg">No history yet</p>
          <p className="text-surface-300 text-sm mt-1">Chat with AI or upload images to get started</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {history.map((item, index) => {
              const config = typeConfig[item.type] || typeConfig.chat;
              const isExpanded = expandedId === item._id;

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white border border-surface-200 rounded-2xl overflow-hidden hover:shadow-md transition-all"
                >
                  <div
                    className="p-4 cursor-pointer flex items-start gap-3"
                    onClick={() => setExpandedId(isExpanded ? null : item._id)}
                  >
                    <div className={`p-2 rounded-xl ${config.color} flex-shrink-0`}>
                      <config.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
                        <span className="text-xs text-surface-400">{formatDate(item.createdAt)}</span>
                      </div>
                      <p className="text-sm text-surface-700 truncate">{item.input}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-surface-300 hover:text-red-500 transition-colors"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                      {isExpanded ? (
                        <HiOutlineChevronUp className="w-4 h-4 text-surface-400" />
                      ) : (
                        <HiOutlineChevronDown className="w-4 h-4 text-surface-400" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-surface-100"
                      >
                        <div className="p-4 bg-surface-50">
                          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">AI Response</p>
                          <div className="ai-message text-sm text-surface-700 leading-relaxed">
                            <ReactMarkdown>{item.response}</ReactMarkdown>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default History;
