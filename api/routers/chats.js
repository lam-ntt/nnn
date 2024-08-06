const express = require('express')
const verifyToken = require('../helpers/verifyToken')

const Chat = require('../models/Chat')
const User = require('../models/User')

const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $in: [req.userId] },
      messages: { $not: { $size: 0 } }
    }).populate('users', 'name profilePic')

    for(let i = 0; i < chats.length; i++) {
      chats[i].users = chats[i].users.filter(
        user => user._id.toString() !== req.userId
      )
    }

    return res.status(200).json(chats)
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      users: { $in: [req.userId] }
    })
    .populate('users', 'name profilePic')
    .populate('messages')

    chat.users = chat.users.filter(
      user => user._id.toString() !== req.userId
    )

    await Chat.updateOne({
      _id: req.params.id,
      users: { $in: [req.userId] }
    }, {
      $push: { seenBy: req.userId }
    })

    return res.status(200).json(chat)
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.post('/', verifyToken, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      users: { $all: [req.userId, req.body.receiverId] }
    })

    if(chat) {
      return res.status(200).json(chat)
    } else {
      const newChat = await Chat.create({
        users: [req.userId, req.body.receiverId]
      })
      return res.status(200).json(newChat)
    }
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const chat = await Chat.updateOne({
      _id: req.params.id,
      users: { $in: [req.userId] }
    }, {
      $push: { seenBy: req.userId }
    })

    return res.status(200).json(chat)
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router