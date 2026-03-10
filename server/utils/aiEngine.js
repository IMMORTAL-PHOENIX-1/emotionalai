// ─── AI Engine ────────────────────────────────────────────────────────────────
// Keyword-based sentiment analysis and empathetic response generation
// with crisis detection and predefined response library.
// ──────────────────────────────────────────────────────────────────────────────

const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
  'hurt myself', 'self harm', 'self-harm', 'cutting myself', 'overdose',
  'no reason to live', 'can\'t go on', 'give up on life', 'end it all',
  'not worth living', 'better off dead',
];

const NEGATIVE_KEYWORDS = [
  'sad', 'depressed', 'depression', 'anxious', 'anxiety', 'lonely', 'alone',
  'hopeless', 'worthless', 'useless', 'failure', 'broken', 'lost', 'scared',
  'fear', 'worried', 'stress', 'stressed', 'overwhelmed', 'exhausted', 'tired',
  'hate myself', 'hate myself', 'angry', 'frustrated', 'miserable', 'empty',
  'numb', 'pain', 'suffering', 'crying', 'cry', 'tears', 'grief', 'trauma',
  'panic', 'attack', 'ptsd', 'abuse', 'neglect', 'abandoned',
];

const POSITIVE_KEYWORDS = [
  'happy', 'better', 'good', 'great', 'wonderful', 'amazing', 'joy',
  'excited', 'hopeful', 'grateful', 'thankful', 'improved', 'progress',
  'calm', 'peaceful', 'relaxed', 'okay', 'fine', 'healing', 'hope',
  'stronger', 'confident', 'proud', 'love', 'smile', 'laugh',
];

const RESPONSES = {
  crisis: [
    `🆘 I'm really concerned about what you just shared. Your life matters deeply, and I want you to reach out to a crisis professional right now:\n\n📞 **iCall (India):** 9152987821\n📞 **Vandrevala Foundation:** 1860-2662-345 (24/7)\n📞 **International Crisis:** https://www.befrienders.org\n\nPlease don't go through this alone. Would you like to talk about what's bringing you to this point?`,
    `🆘 What you're feeling right now must be incredibly painful, and I'm grateful you're talking rather than acting. Please reach out immediately:\n\n📞 **iCall:** 9152987821\n📞 **AASRA:** 9820466627\n\nYou deserve support. Can you tell me what's been happening?`,
  ],
  negative: [
    `I hear you, and I want you to know that what you're feeling is completely valid. It takes real courage to express these emotions. Can you tell me more about what's been weighing on you?`,
    `It sounds like you're carrying a lot right now. I'm here with you — there's no rush, and no judgment. What's been the hardest part of your day?`,
    `Thank you for trusting me with this. Emotions like these can feel very heavy, but you don't have to face them alone. What do you think triggered these feelings?`,
    `I can sense the pain in your words, and I want you to know I'm truly listening. Sometimes just saying things out loud can help — is there anything specific you'd like to explore?`,
    `That sounds really difficult, and your feelings are completely understandable. Remember — emotions are temporary even when they feel permanent. Would you like to try a breathing exercise to help ground yourself?`,
    `You're showing incredible strength by reaching out. I'm here to listen without judgment. Can you describe what's making you feel this way?`,
    `It's okay to feel this way. Many people go through similar struggles. Would you like to talk about some coping strategies that might help?`,
  ],
  positive: [
    `That's wonderful to hear! It sounds like you're in a good place right now. What's been contributing to these positive feelings?`,
    `I'm so glad you're feeling this way! It's important to celebrate these moments. What small win can you acknowledge for yourself today?`,
    `That's really encouraging! Moments like these should be treasured. Is there something you did recently that contributed to feeling this way?`,
    `It's great to hear things are going well! What's been the highlight of your day so far?`,
    `Your positivity is wonderful! Keep holding onto these moments. How can we build on this feeling?`,
  ],
  neutral: [
    `I'm here to listen. How has your day been going overall?`,
    `Thank you for reaching out today. What's on your mind?`,
    `I'm glad you're here. Is there something specific you'd like to talk about or explore?`,
    `How are you feeling right now, in this moment? Sometimes checking in with ourselves is the first step.`,
    `I'm here with you. There's no agenda — we can talk about anything you feel comfortable sharing.`,
    `It's great that you reached out. How can I best support you today?`,
    `Take your time. I'm here to listen to whatever you'd like to share.`,
  ],
  greetings: [
    `Hello! I'm MindfulBot, your compassionate mental health companion 💚 I'm here to listen, support, and help you navigate your emotions. How are you feeling today?`,
    `Hi there! Welcome 🌱 I'm MindfulBot. This is a safe, judgment-free space for you to share anything on your mind. How are you doing?`,
    `Hey! I'm so glad you're here 💙 I'm MindfulBot — your supportive companion. What's on your mind today?`,
  ],
  breathing: [
    `A breathing exercise can really help when things feel overwhelming 🌬️ Let's try the **4-7-8 technique**: Inhale for 4 seconds, hold for 7 seconds, exhale slowly for 8 seconds. You can find the **Breathing Exercise** button in the toolbar. Would you like to try it?`,
    `I notice you might benefit from a grounding exercise. Try this: inhale deeply for 4 counts, hold for 7, then exhale for 8. Or use the **Breathing Exercise** module in the app for a guided session 🌿`,
  ],
  followUp: [
    `How has that been making you feel?`,
    `What support would feel most helpful to you right now?`,
    `Have you experienced this feeling before, or is this new for you?`,
    `What would make you feel even a little bit better right now?`,
    `Is there someone in your life you trust who you can also reach out to?`,
    `What's one small thing you can do for yourself today?`,
    `How long have you been feeling this way?`,
  ],
};

const GREETING_PATTERNS = /^(hi|hello|hey|good morning|good evening|good afternoon|howdy|sup|yo|greetings)/i;
const BREATHING_PATTERNS = /\b(breath|breathing|breathe|calm|anxious|panic|overwhelm|relax)\b/i;

/**
 * Analyzes the sentiment of user input
 * @param {string} text
 * @returns {'crisis'|'negative'|'positive'|'neutral'}
 */
const analyzeSentiment = (text) => {
  const lower = text.toLowerCase();

  for (const kw of CRISIS_KEYWORDS) {
    if (lower.includes(kw)) return 'crisis';
  }

  let negScore = 0;
  let posScore = 0;

  for (const kw of NEGATIVE_KEYWORDS) {
    if (lower.includes(kw)) negScore++;
  }
  for (const kw of POSITIVE_KEYWORDS) {
    if (lower.includes(kw)) posScore++;
  }

  if (negScore > posScore && negScore > 0) return 'negative';
  if (posScore > negScore && posScore > 0) return 'positive';
  return 'neutral';
};

/**
 * Picks a random response from an array
 * @param {string[]} arr
 */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Generates an empathetic bot response based on user input
 * @param {string} userMessage
 * @returns {{ reply: string, sentiment: string }}
 */
const generateResponse = (userMessage) => {
  const sentiment = analyzeSentiment(userMessage);

  if (sentiment === 'crisis') {
    return { reply: pick(RESPONSES.crisis), sentiment: 'crisis' };
  }

  if (GREETING_PATTERNS.test(userMessage.trim())) {
    return { reply: pick(RESPONSES.greetings), sentiment: 'neutral' };
  }

  let reply;

  if (BREATHING_PATTERNS.test(userMessage) && sentiment === 'negative') {
    reply = pick(RESPONSES.breathing);
  } else if (sentiment === 'negative') {
    reply = pick(RESPONSES.negative);
  } else if (sentiment === 'positive') {
    reply = pick(RESPONSES.positive);
  } else {
    reply = pick(RESPONSES.neutral);
  }

  // Occasionally append a follow-up question for engagement
  if (Math.random() > 0.4) {
    reply += `\n\n*${pick(RESPONSES.followUp)}*`;
  }

  return { reply, sentiment };
};

module.exports = { analyzeSentiment, generateResponse };
