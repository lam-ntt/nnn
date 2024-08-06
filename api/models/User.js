const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User