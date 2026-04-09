import { chatWithGemini, analyzeImageWithGemini } from '../services/gemini.service.js';
import History from '../models/History.js';

// POST /api/ai/chat
export const chat = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("USER:", req.user);

    const { message, language } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required.',
      });
    }

    const aiResponse = await chatWithGemini(message, language || 'en');

    // Save only if user exists
    if (req.user?._id) {
      await History.create({
        userId: req.user._id,
        type: 'chat',
        input: message,
        response: aiResponse,
      });
    }

    res.json({
      success: true,
      data: {
        message: aiResponse,
      },
    });

  } catch (error) {
    console.error("CHAT ERROR FULL:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/ai/image
export const analyzeImage = async (req, res) => {
  try {
    const { image, mimeType, language } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required.' });
    }

    const aiResponse = await analyzeImageWithGemini(image, mimeType || 'image/jpeg', language || 'en');

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
