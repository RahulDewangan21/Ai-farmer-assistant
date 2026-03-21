import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['chat', 'image', 'weather'],
    required: true,
  },
  input: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Index for efficient querying
historySchema.index({ userId: 1, createdAt: -1 });

const History = mongoose.model('History', historySchema);
export default History;
