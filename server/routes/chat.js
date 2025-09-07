const express = require('express');
const Message = require('../models/Message');
const { Configuration, OpenAIApi } = require('openai');
const jwt = require('jsonwebtoken');

const router = express.Router();

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

// Middleware to verify JWT
function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Get chat messages
router.get('/messages', auth, async (req, res) => {
  const messages = await Message.find().sort({ createdAt: 1 });
  res.json(messages);
});

// Send a message & get AI reply
router.post('/messages', auth, async (req, res) => {
  const { text } = req.body;
  const userMessage = new Message({ sender: req.user.username, text });
  await userMessage.save();

  // Get AI reply
  const prompt = `You are a Haryanvi girl talking in Haryanvi. Reply to this message: "${text}"`;
  const aiRes = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }]
  });
  const aiReplyText = aiRes.data.choices[0].message.content;

  const aiMessage = new Message({ sender: 'Haryanvi Girl AI', text: aiReplyText });
  await aiMessage.save();

  res.json([userMessage, aiMessage]);
});

module.exports = router;