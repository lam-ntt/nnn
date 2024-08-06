import { useContext, useEffect, useRef, useState } from 'react'
import './chat.css'
import axios from 'axios'
import { format } from 'timeago.js'
import { useSearchParams } from 'react-router-dom'
import { SocketContext } from '../../context/SocketContext'
import { Context } from '../../context/Context'

export default function Chat() {
  const { user } = useContext(Context)
  const [chat, setChat] = useState(null)
  const [contacts, setContacts] = useState([])
  const [param, setParam] = useSearchParams()
  const myRef = useRef()
  const {socket} = useContext(SocketContext)
  const FP = 'http://localhost:5000/images/'

  const getContact = async () => {
    try {
      const res = await axios.get('/chats/', {
        headers: {
          'auth-token': JSON.parse(localStorage.getItem('token'))
        }
      })
      setContacts(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const seenChat = async () => {
    try {
      await axios.put('/chats/' + chat._id, {}, {
        headers: {
          'auth-token': JSON.parse(localStorage.getItem('token'))
        }
      })
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (myRef.current) {
      myRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    // update real time contacts when not opening chatbox
    if(chat === null) getContact()
  })

  useEffect(() => {
    const chatId = param.get('openChatWith')
    if(chatId) {
      handleOpen(chatId)
    }
  }, [])

  const handleOpen = async (chatId) => {
    try {
      const res = await axios.get('/chats/' + chatId, {
        headers: {
          'auth-token': JSON.parse(localStorage.getItem('token'))
        }
      })
      setChat(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const text = formData.get('text')

    if (text === '') return
    try {
      const res = await axios.post('/messages/' + chat._id, {
        text
      }, {
        headers: {
          'auth-token': JSON.parse(localStorage.getItem('token'))
        }
      })

      e.target.reset()
      socket.emit('sendMessage', chat.users[0]._id === user._id ? chat.users[1]._id : chat.users[0]._id, res.data)
      setChat((prev) => ({ ...prev, messages: chat ? [...prev.messages, res.data] : [res.data] }))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if(socket && chat) {
      socket.on('getMessage', (data) => {
        if(data.chat.toString() === chat._id) {
          setChat((prev) => ({ ...prev, messages: chat ? [...prev.messages, data] : [data] }))
          seenChat()
        }
        // update real time contacts when opening chatbox
        getContact()
      })
    } 

    // to prevent socket received same message
    return () => {
      socket.off('getMessage')
    }
  }, [socket, chat])


  return (
    <div className="chat">
      <div className="chatContacts">
        {contacts && contacts.map((contact) => (
          <div
            className="contact" key={contact._id}
            onClick={(e) => handleOpen(contact._id)}
          >
            <img
              src={
                contact.users[0].profilePic ?
                  FP + contact.users[0].profilePic :
                  "https://www.booksie.com/files/profiles/22/mr-anonymous.png"}
              className={contact.seenBy.includes(user._id) || (chat && contact.users[0]._id === chat.users[0]._id) ? '' : 'new'}
            />
            <p>{contact.users[0].name}</p>
          </div>
        ))}
      </div>

      {chat && (
        <div className="chatBox">
          <div className="chatBoxReceiverInfo">
            <img
              src={
                chat.users[0].profilePic ?
                  FP + chat.users[0].profilePic :
                  "https://www.booksie.com/files/profiles/22/mr-anonymous.png"}
            />
            <p>{chat.users[0].name}</p>
            <span onClick={(e) => setChat(null)}>X</span>
          </div>
          <div className="chatBoxMessages">
            {chat.messages && chat.messages.map((message) => (
              <div
                className={`message ${message.user === user._id ? 'own' : ''}`}
                key={message._id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={myRef}></div>
          </div>
          <div className="chatBoxForm">
            <form onSubmit={handleSend}>
              <input name="text"></input>
              <button>Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}