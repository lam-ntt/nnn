import { useContext, useState } from "react";
import "./write.css";
import { Context } from "../../context/Context";
import axios from "axios";

export default function Write() {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [file, setFile] = useState('')
  const [error, setError] = useState('')
  const { user } = useContext(Context)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newPost = {
      title, desc, author: user._id
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
      newPost.photo = filename
      try {
        await axios.post('/upload', data)
      } catch(err) {}
    }

    try {
      await axios.post('http://localhost:5000/api/posts', newPost, {
        headers: {
          'auth-token': JSON.parse(localStorage.getItem('token'))
        }
      })
      window.location.replace('/')
    } catch(err) {}
  }

  return (
    <div className="write">
      {file && (
        <img
        className="writeImg"
        src={URL.createObjectURL(file)}
        alt=""
      />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        {error && (
          <span style={{marginLeft: '150px', color: 'red'}}>{error}</span>
        )}
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input 
            id="fileInput" 
            type="file" 
            accept="image/*"
            style={{ display: "none" }} 
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            className="writeInput"
            placeholder="Title"
            type="text"
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
          <textarea
            className="writeInput writeText"
            placeholder="Tell your story..."
            type="text"
            required
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
  );
}
