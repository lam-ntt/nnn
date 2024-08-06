const express = require('express')
const router = express.Router()

const Category = require('../models/Category')

const verifyToken = require('../helpers/verifyToken')

router.post('/', verifyToken, async (req, res) => {
  const cat = await Category.findOne({name: req.body.name})
  if(cat) return res.status(401).json('Name existed!')

  try {
    const newCat = await Category.create({
      name: req.body.name 
    })
    return res.status(200).json(newCat)
  } catch(err) {
    return res.status(500).json(err)
  }
})

router.get('/', async (req, res) => {
  const cats = await Category.find()
  return res.status(200).json(cats)
})

module.exports = router