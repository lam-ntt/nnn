import { Link, useLocation, useNavigate } from "react-router-dom";
import "./singlePost.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../context/Context";

export default function SinglePost() {
  const [post, setPost] = useState('')
  const location = useLocation()
  const postId = location.pathname.split('/')[2]
  const PF = 'http://localhost:5000/images/'
  const navigate = useNavigate()

  const [updateMode, setUpdateMode] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [error, setError] = useState('')
  const { user } = useContext(Context)

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get('/posts/' + postId)   
      setPost(res.data)
      setTitle(res.data.title)
      setDesc(res.data.desc)
    }
    getPost()
  }, [postId])

  const handleUpdate = async (e) => {
    e.preventDefault()
    if(title === '' || desc === '') {
      setError('All fields must be filled!')
      return
    }
    try {
      await axios.put('/posts/' + post._id, { title, desc }, {
        headers: {
          'auth-token': JSON.parse(localStorage.getItem('token'))
        }
      })
      setUpdateMode(false)
    } catch(err) {}
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    try {
      await axios.delete('/posts/' + post._id, {
        headers: {
          'auth-token': JSON.parse(localStorage.getItem('token'))
        }
      })
      window.location.replace('/')
    } catch(err) {}
  }   

  const handleOpenChat = async (receiverId) => {
    try {
      const res = await axios.post('/chats/', {
        receiverId
      }, {
        headers: {
          'auth-token': JSON.parse(localStorage.getItem('token'))
        }
      })
      navigate('/chat?openChatWith=' + res.data._id)
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        <img
          className="singlePostImg"
          src={PF + post.photo}
          alt=""
        />

        {updateMode ? (
          <input 
            type="text" 
            placeholder={post.title} className="singlePostTitleInput"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post.author && user && post.author._id === user._id && (
              <div className="singlePostEdit">
                <i className="singlePostIcon far fa-edit" onClick={(e) => setUpdateMode(true)}></i>
                <i className="singlePostIcon far fa-trash-alt" onClick={handleDelete}></i>
              </div>
            )}
            {post.author && user && post.author._id !== user._id && (
              <div className="singlePostEdit">
                <i className="singlePostIcon fas fa-comment" onClick={(e) => handleOpenChat(post.author._id)}></i> 
              </div>
            )}
          </h1>
        )}
      
        <div className="singlePostInfo">
          <span>
            Author:
            <b className="singlePostAuthor">
            {post.author && (
              <Link className="link" to={`/?name=${post.author.name}`}>
                {post.author.name}
              </Link>
            )}
            </b>
          </span>
          <span>{new Date(post.createdAt).toDateString()}</span>
        </div>

        {updateMode ? (
          <textarea 
            type="text" 
            placeholder={post.desc} 
            className="singlePostDescInput"
            required
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        ) : (
          <p className="singlePostDesc">
            {desc}
          </p>
        )}

        {updateMode && (
          <>
            <button style={{float: 'right'}} onClick={handleUpdate}>Update</button>
            {error && (
              <span style={{textAlign: 'right', color: 'red'}}>{error}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
