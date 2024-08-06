import { Server } from "socket.io"

const io = new Server({
  cors: {
    origin: 'http://localhost:3000'
  }
})

const onlineUsers = []

const addUser = (userId, socketId) => {
  for(let i = 0; i < onlineUsers.length; i++) {
    if(onlineUsers[i].userId === userId) onlineUsers[i].socketId = socketId
  }
  onlineUsers.push({userId, socketId})
}

const getSocketId = (userId) => {
  for(let i = 0; i < onlineUsers.length; i++) {
    if(onlineUsers[i].userId === userId) return onlineUsers[i].socketId
  }
  return null
}

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
}

io.on('connection', (socket) => {
  console.log('Connected')

  socket.on('addUser', (userId) => {
    addUser(userId, socket.id)
    console.log('New')
  })

  socket.on('sendMessage', (receiverId, data) => {
    const socketId = getSocketId(receiverId)
    if(socketId) {
      io.to(socketId).emit('getMessage', data)
      console.log('Sent')
    }
  })

  socket.on('disconnected', () => {
    removeUser(socket.id)
    console.log('Disconnected')
  })
})

io.listen(4000)