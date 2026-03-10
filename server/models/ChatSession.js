const mongoose = require('mongoose');

const ChatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'New Conversation',
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  mood: {
    type: String,
    enum: ['😊 Happy', '😢 Sad', '😰 Anxious', '😤 Angry', '😐 Neutral', '😴 Tired', '😁 Excited', '😔 Depressed'],
    default: '😐 Neutral',
  },
  moodScore: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
