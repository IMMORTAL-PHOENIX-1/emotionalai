const { validationResult } = require('express-validator');
const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');
const { generateResponse } = require('../utils/aiEngine');

// @route   GET /api/chat/sessions
exports.getSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
};

// @route   POST /api/chat/sessions
exports.createSession = async (req, res) => {
  const { mood, moodScore, title } = req.body;
  try {
    const session = await ChatSession.create({
      userId: req.user.id,
      title: title || `Session ${new Date().toLocaleDateString()}`,
      mood: mood || '😐 Neutral',
      moodScore: moodScore || 5,
    });

    // Send welcome message from bot
    const welcomeMsg = await Message.create({
      sessionId: session._id,
      sender: 'bot',
      content: `Hello! I'm MindfulBot 💚 I see you're feeling **${session.mood}** today. This is a safe space — I'm here to listen and support you. What's on your mind?`,
      sentiment: 'neutral',
    });

    res.status(201).json({ session, welcomeMessage: welcomeMsg });
  } catch (error) {
    res.status(500).json({ message: 'Error creating session' });
  }
};

// @route   GET /api/chat/sessions/:sessionId/messages
exports.getMessages = async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.sessionId,
      userId: req.user.id,
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const messages = await Message.find({ sessionId: req.params.sessionId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// @route   POST /api/chat/sessions/:sessionId/messages
exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { content } = req.body;

  try {
    const session = await ChatSession.findOne({
      _id: req.params.sessionId,
      userId: req.user.id,
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Save user message
    const userMessage = await Message.create({
      sessionId: session._id,
      sender: 'user',
      content,
      sentiment: 'neutral',
    });

    // Generate bot response
    const { reply, sentiment } = generateResponse(content);

    // Update user message sentiment
    await Message.findByIdAndUpdate(userMessage._id, { sentiment });

    // Save bot message
    const botMessage = await Message.create({
      sessionId: session._id,
      sender: 'bot',
      content: reply,
      sentiment,
    });

    // Auto-update session title from first user message (if still default)
    if (session.title.startsWith('Session') || session.title === 'New Conversation') {
      const shortTitle = content.length > 40 ? content.substring(0, 40) + '...' : content;
      await ChatSession.findByIdAndUpdate(session._id, { title: shortTitle });
    }

    res.json({ userMessage, botMessage, sentiment });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// @route   GET /api/chat/mood-history
exports.getMoodHistory = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30)
      .select('mood moodScore createdAt title');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mood history' });
  }
};

// @route   DELETE /api/chat/sessions/:sessionId
exports.deleteSession = async (req, res) => {
  try {
    const session = await ChatSession.findOneAndDelete({
      _id: req.params.sessionId,
      userId: req.user.id,
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    await Message.deleteMany({ sessionId: req.params.sessionId });
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting session' });
  }
};
