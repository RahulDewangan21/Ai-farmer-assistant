import History from '../models/History.js';

// GET /api/history
export const getHistory = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const query = { userId: req.user._id };

    if (type) {
      query.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [history, total] = await Promise.all([
      History.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      History.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: history,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/history/:id
export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await History.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!history) {
      return res.status(404).json({ success: false, message: 'History item not found.' });
    }

    res.json({ success: true, message: 'History item deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/history (clear all)
export const clearHistory = async (req, res) => {
  try {
    await History.deleteMany({ userId: req.user._id });
    res.json({ success: true, message: 'All history cleared.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
