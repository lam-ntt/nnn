const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }
}, { timestamps: true })

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message