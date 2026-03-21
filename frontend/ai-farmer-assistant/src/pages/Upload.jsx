import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePhoto, HiOutlineArrowUpTray, HiOutlineXMark, HiOutlineClipboard } from 'react-icons/hi2';
import { GiWheat } from 'react-icons/gi';
import ReactMarkdown from 'react-markdown';
import { aiImageAnalysis } from '../services/api';
import LoadingDots from '../components/LoadingDots';
import toast from 'react-hot-toast';

const Upload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be smaller than 10MB');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setAnalysis('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1];
      setImage({ data: base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const res = await aiImageAnalysis(image.data, image.mimeType);
      setAnalysis(res.data.data.analysis);
      toast.success('Analysis complete! ✅');
    } catch (err) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    setAnalysis('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyResult = () => {
    navigator.clipboard.writeText(analysis);
    toast.success('Result copied! 📋');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <HiOutlinePhoto className="w-7 h-7 text-primary-600" />
          Crop Disease Detection
        </h1>
        <p className="text-surface-500 text-sm mt-1">Upload a crop photo — AI will identify diseases and suggest treatments</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Area */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-surface-300 bg-white hover:border-primary-400 hover:bg-primary-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files[0])}
                className="hidden"
                id="image-upload"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center">
                  <HiOutlineArrowUpTray className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-surface-700">Drop your crop image here</p>
                  <p className="text-sm text-surface-400 mt-1">or click to browse</p>
                  <p className="text-xs text-surface-400 mt-2">JPG, PNG — max 10MB</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl border border-surface-200 overflow-hidden bg-white">
              <img src={preview} alt="Uploaded crop" className="w-full h-64 object-cover" />
              <button
                onClick={clearImage}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-xl shadow-md hover:bg-red-50 text-surface-600 hover:text-red-500 transition-colors"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
              <div className="p-4">
                <button
                  id="analyze-button"
                  onClick={analyzeImage}
                  disabled={loading}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md shadow-primary-600/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <LoadingDots text="Analyzing" />
                  ) : (
                    <>
                      <GiWheat className="w-5 h-5" />
                      Analyze with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Result Area */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <AnimatePresence mode="wait">
            {analysis ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-surface-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GiWheat className="w-5 h-5 text-primary-600" />
                    <h3 className="font-bold text-surface-900">AI Analysis Report</h3>
                  </div>
                  <button
                    onClick={copyResult}
                    className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-primary-600 transition-colors"
                    title="Copy"
                  >
                    <HiOutlineClipboard className="w-4 h-4" />
                  </button>
                </div>
                <div className="ai-message prose prose-sm max-w-none text-surface-700 leading-relaxed max-h-[60vh] overflow-y-auto">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center bg-surface-50 border border-surface-200 rounded-2xl p-8 min-h-[300px]"
              >
                <div className="text-center text-surface-400">
                  <HiOutlinePhoto className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Upload a crop image</p>
                  <p className="text-xs mt-1">AI analysis will appear here</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
