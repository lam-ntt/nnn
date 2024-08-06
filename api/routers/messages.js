const express = require('express')
const verifyToken = require('../helpers/verifyToken')

const Chat = require('../models/Chat')
const Message = require('../models/Message')

const router = express.Router()

router.post('/:id', verifyToken, async (req, res) => {
  try {
    const chat = await Chat.findById({ _id: req.params.id })
    if (!chat) {
      return res.status(404).json('Chat not Existed!')
    }

    const newMessage = await Message.create({
      text: req.body.text,
      user: req.userId,
      chat: req.params.id
    })

    await Chat.updateOne({
      _id: req.params.id
    }, {
      $push: { messages: newMessage },
      seenBy: [req.userId]
    })

    return res.status(200).json(newMessage)
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router