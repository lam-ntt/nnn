const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

const User = require('../models/User')
const Post = require('../models/Post')

const verifyToken = require('../helpers/verifyToken')

router.put('/:id', verifyToken, async (req, res)  => {
  const valid = req.userId === req.params.id
  if(!valid) return res.status(401).json('Only update your account!')

  try {
    if(req.body.password) {
      const salt = await bcrypt.genSalt(10)
      req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )

    const { password, ...others } = updateUser._doc
    return res.status(200).json(others)
  } catch(err) {
    return res.status(500).json(err)
  }
})

router.delete('/:id', verifyToken, async (req, res)  => {
  const valid = req.body.userId === req.params.id
  if(!valid) return res.status(401).json('Only update your account!')

  try {
    await Post.deleteMany({author: req.params.id})
    await User.findByIdAndDelete(req.params.id)
    return res.status(200).json('Deleted!')
  } catch(err) {
    return res.status(500).json(err)
  }
})

router.get('/all', async (req, res)  => {
  const users = await User.find().select('-password')
  return res.status(200).json(users)
})

router.get('/:id', async (req, res)  => {
  const user = await User.findOne({name: req.body.name})
  if(!user) return res.status(401).json('User not found!')
  else {
    const { password, ...others } = user._doc
    return res.status(200).json(others)
  }
})

module.exports = router