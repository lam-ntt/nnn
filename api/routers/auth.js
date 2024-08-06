const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../models/User')

router.post('/register', async (req, res) => {
  const user = await User.findOne({name: req.body.name})
  if(user) return res.status(401).json('Name existed!')

  try {
    const salt = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(req.body.password, salt)
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPass
    })
    const { password, ...others } = newUser._doc
    return res.status(200).json(others)
  } catch(err) {
    return res.status(500).json(err)
  }
})

router.post('/login', async (req, res) => {
  const user = await User.findOne({name: req.body.name})
  if(!user) return res.status(401).json('Wrong name!')

  const valid = await bcrypt.compare(req.body.password, user.password)
  if(!valid) return res.status(401).json('Wrong password!')

  const token = jwt.sign(
    { userId: user._id },
    process.env.SECRET_KEY,
    { expiresIn: '1d' }
  )
  return res.header('auth-token', token).json({user, token})
})

module.exports = router