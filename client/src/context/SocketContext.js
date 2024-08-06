import { createContext, useContext, useEffect, useState } from "react"
import {io} from 'socket.io-client'
import { Context } from "./Context"

export const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
  const {user} = useContext(Context)
  const [socket, setSocket] = useState(io('http://localhost:4000'))

  useEffect(() => {
    if(user) socket.emit('addUser', user._id)
  }, [user])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}