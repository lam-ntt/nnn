import { useState } from "react"
import "./register.css"
import axios from "axios"
import { Link } from "react-router-dom"

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/auth/register', { name, email, password })
      window.location.replace('/login')
    } catch(err) { 
      setName('')
      setEmail('')
      setPassword('')
      setError(err.response.data)
    }
  }

    return (
      <div className="register">
      <span className="registerTitle">Register</span>
      <form className="registerForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input 
          className="registerInput" 
          type="text"
          placeholder="Enter your username..." 
          minLength={3}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Email</label>
        <input 
          className="registerInput" 
          type="email" 
          placeholder="Enter your email..." 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input 
          className="registerInput" 
          type="password" 
          placeholder="Enter your password..." 
          minLength={3}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="registerButton" type="submit">Register</button>
        {error && (
          <span style={{textAlign: 'center', color: 'red'}}>{error}</span>
        )}
      </form>
      <Link to='/login'><button className="registerLoginButton">Login</button></Link>
    </div>
    )
}
