const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  title: String,
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  userId: String, // To store the user ID from the session
  messages: [messageSchema], // An array of messages for each chat
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
