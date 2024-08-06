const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')

const authRouter = require('./routers/auth')
const userRouter = require('./routers/users')
const postRouter = require('./routers/posts')
const categoryRouter = require('./routers/categories')
const chatRouter = require('./routers/chats')
const messageRouter = require('./routers/messages')


dotenv.config()

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Database is connected..."))
.catch((err) => console.log(err))

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/chats', chatRouter)
app.use('/api/messages', messageRouter)


app.use('/images', express.static(path.join(__dirname, '/images')))

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'images')
  },
  filename: (req, res, cb) => {
    cb(null, req.body.name)
  }
})

const upload = multer({storage: storage})

app.post('/api/upload', upload.single('file'), (req, res) => {
  return res.status(200).json('File uploaded!')
})

app.listen(5000, () => {
  console.log('App is listening on 5000...')
})