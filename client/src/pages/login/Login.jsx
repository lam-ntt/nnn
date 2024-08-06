import { Link } from "react-router-dom";
import "./login.css";
import { useContext, useState } from "react";
import axios from "axios";
import { Context } from '../../context/Context'

export default function Login() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { dispatch } = useContext(Context)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({type: 'LOGIN_START'})
    try {
      const res = await axios.post('/auth/login', { name, password })
      dispatch({type: 'LOGIN_SUCCESS', payload: res.data})
    } catch(err) {
      setName('')
      setPassword('')
      setError(err.response.data)
      dispatch({type: 'LOGIN_FAILURE'})
    }
  }

  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label>Name</label>
        <input 
          className="loginInput" 
          type="text" 
          placeholder="Enter your name..." 
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <label>Password</label>
        <input 
          className="loginInput" 
          type="password" 
          placeholder="Enter your password..." 
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="loginButton" type="submit">Login</button>
        {error && (
          <span style={{textAlign: 'center', color: 'red'}}>{error}</span>
        )}
      </form>
      <Link to='/register'><button className="loginRegisterButton">Register</button></Link>
    </div>
  );
}
