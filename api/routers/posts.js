const express = require('express')
const router = express.Router()

const User = require('../models/User')
const Post = require('../models/Post')
const Category = require('../models/Category')

const verifyToken = require('../helpers/verifyToken')

router.post('/', verifyToken, async (req, res) => {
  const post = await Post.findOne({title: req.body.title})
  if(post) return res.status(401).json('Title existed!')

  try {
    const newPost = await Post.create({
      title: req.body.title,
      desc: req.body.desc,
      photo: req.body.photo,
      author: req.body.author
    })
    return res.status(200).json(newPost)
  } catch(err) {
    return res.status(500).json(err)
  }
})

router.put('/:id', verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author")
  const valid = req.userId == post.author._id
  if(!valid) return res.status(401).json('Only update your post!')

    console.log(req.body)

  try {
    const updatePost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    return res.status(200).json(updatePost)
  } catch(err) {
    return res.status(500).json(err)
  }
})

router.delete('/:id', verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id)
  const valid = req.userId == post.author
  if(!valid) return res.status(401).json('Only delete your post!')

  try {
    await Post.findByIdAndDelete(req.params.id)
    return res.status(200).json("Deleted!")
  } catch(err) {
    return res.status(500).json(err)
  }
})

router.get('/all', async (req, res) => {
  const { name: authorName, cat: catName } = req.query
  let posts
  if(authorName) {
    const user = await User.findOne({name: authorName})
    posts = await Post.find({author: user._id})
  } else if (catName) {
    const cat = await Category.findOne({name: catName})
    posts = await Post.find({categories: {
      $in: [cat._id]
    }})
  } else {
    posts = await Post.find()
  }
  return res.status(200).json(posts)
})

router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author')
  if(!post) return res.status(401).json('Post not found!')
  else return res.status(200).json(post)
})

module.exports = router