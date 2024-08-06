import { useEffect, useState } from "react";
import Post from "../post/Post";
import "./posts.css";
import axios from 'axios'
import { useLocation } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([])
  const { search } = useLocation()

  useEffect(() => {
    const getPosts = async () => {
      const res = await axios.get('/posts/all' + search)
      setPosts(res.data)
    }
    getPosts()
  }, [search])

  return (
    <div className="posts">
      {posts.map((post) => (
        <Post post={post}/>
      ))}
    </div>
  );
}
