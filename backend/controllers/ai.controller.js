import { chatWithGemini, analyzeImageWithGemini } from '../services/gemini.service.js';
import History from '../models/History.js';

// POST /api/ai/chat
export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const aiResponse = await chatWithGemini(message);

    // Save to history
    await History.create({
      userId: req.user._id,
      type: 'chat',
      input: message,
      response: aiResponse,
    });

    res.json({
      success: true,
      data: {
        message: aiResponse,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/ai/image
export const analyzeImage = async (req, res) => {
  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required.' });
    }

    const aiResponse = await analyzeImageWithGemini(image, mimeType || 'image/jpeg');

    // Save to history
    await History.create({
      userId: req.user._id,
      type: 'image',
      input: 'Image analysis request',
      response: aiResponse,
      imageUrl: `data:${mimeType || 'image/jpeg'};base64,${image.substring(0, 100)}...`,
    });

    res.json({
      success: true,
      data: {
        analysis: aiResponse,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
