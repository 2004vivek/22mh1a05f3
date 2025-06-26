import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: { type: String, default: 'direct' },
  location: { type: String, default: 'unknown' }
});

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  clicks: [clickSchema],
  totalClicks: {
    type: Number,
    default: 0
  }
});

const URLModel = mongoose.model('URL', urlSchema);
export default URLModel; 