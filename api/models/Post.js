const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true 
  },
  desc: {
    type: String,
    required: true 
  },
  photo: {
    type: String,
    default: ''
  },
  categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

}, { timestamps:true })

const Post = mongoose.model('Post', PostSchema)

module.exports = Post