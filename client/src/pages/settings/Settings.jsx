import "./settings.css";
import Sidebar from "../../components/sidebar/Sidebar";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import axios from "axios";

export default function Settings() {
  const { user, dispatch } = useContext(Context)
  const PF = 'http://localhost:5000/images/'

  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState('')
  const [file, setFile] = useState()
  const [error, setError] = useState('')

  const handleUpdate = async (e) => {
    e.preventDefault()
    dispatch({type: 'UPDATE_START'})

    const updateUser = {
      name, email, password
    }
    
    if(file) {
      const type = file.type.split('/')[0]
      if(type !== 'image') {
        setError('Only accept image type!')
        console.log(error)
        return
      }
      const data = new FormData()
      const filename = Date.now() + file.name
      data.append('name', filename)
      data.append('file', file)
      updateUser.profilePic = filename
      try {
        await axios.post('/upload', data)
      } catch(err) {}
    }
    try {
      const res = await axios.put('/users/' + user._id, 
        updateUser, {
        headers: {
          'auth-token': JSON.parse(localStorage.getItem('token'))
        }
      })
      dispatch({type: 'UPDATE_SUCCESS', payload: res.data})
      window.location.reload()
    } catch(err) {
      dispatch({type: 'UPDATE_FAILURE'})
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    try {
      dispatch({type: 'LOGOUT'})
      await axios.delete('/users/' + user._id, {data: {userId: user._id}}, {
        headers: {
          'auth-token': JSON.parse(localStorage.getItem('token'))
        }
      })
    } catch(err) {}
  }
  
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsTitleUpdate" onClick={handleUpdate}>Update Your Account</span>
          <span className="settingsTitleDelete" onClick={handleDelete}>Delete Account</span>
        </div>
        <form className="settingsForm" onSubmit={handleUpdate}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img
              src={file ? URL.createObjectURL(file) : PF + user.profilePic}
              alt=""
            />
            <label htmlFor="fileInput">
              <i className="settingsPPIcon far fa-user-circle"></i>
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              className="settingsPPInput"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input 
            type="text" 
            name="name" 
            minLength={3}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input 
            type="password"
            name="password" 
            minLength={3}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="settingsSubmitButton" type="submit">
            Update
          </button>
          {error && (
            <span style={{textAlign: 'center', color: 'red'}}>{error}</span>
          )}
        </form>
      </div>
      <Sidebar />
    </div>
  );
}
