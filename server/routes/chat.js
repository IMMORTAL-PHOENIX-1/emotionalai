const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getSessions,
  createSession,
  getMessages,
  sendMessage,
  getMoodHistory,
  deleteSession,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { chatLimiter } = require('../middleware/rateLimiter');

router.use(protect);

router.get('/sessions', getSessions);
router.post('/sessions', createSession);
router.get('/mood-history', getMoodHistory);

router.get('/sessions/:sessionId/messages', getMessages);
router.post(
  '/sessions/:sessionId/messages',
  chatLimiter,
  [body('content').trim().notEmpty().withMessage('Message cannot be empty').isLength({ max: 2000 })],
  sendMessage
);
router.delete('/sessions/:sessionId', deleteSession);

module.exports = router;
