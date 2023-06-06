import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Surreal from 'surrealdb.js';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate, useParams } from 'react-router-dom';

const instance = axios.create({
  baseURL: 'http://localhost:4000',
});

const db = new Surreal('http://127.0.0.1:8000/rpc');

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/" element={<Register />} />
      </Routes>
    </Router>
  );
}

function Register() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const register = async () => {
    try {
      const result = await instance.post('/register', { username, password });
      if (result.status === 200) {
        navigate('/login');
      } else {
        alert('Error registering');
      }
    }
    catch (err) {
      if (err.response.status === 400) {
        alert(err.response.data.message);
      }
      else alert('Error registering');
    }

  };

  return (
    <div>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button onClick={register}>Register</button>
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const login = async () => {
    try {
      const result = await instance.post('/login', { username, password });
      if (result.status === 200) {
        navigate('/posts');
        localStorage.setItem('user', result.data.data.id);
      }
      else {
        alert('Error logging in');
      }
    }
    catch (err) {
      if (err.response.status === 401) {
        alert(err.response.data.message);
      }
      else {
        alert('Error logging in');
      }
    }
  };

  return (
    <div>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button onClick={login}>Login</button>
    </div>
  );
}

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // instance.get('/posts').then(res => {
    //   if (res.status === 200) {
    //     setPosts(res.data[0].result);
    //   }
    // });

    try {
      db.signin({
			  NS: 'app',
			  DB: 'app',
        SC: 'user',
        user: 'root',
        pass: 'root',
      });
      db.use('app', 'app');
      db.query('LIVE SELECT * FROM post').then(res => {
        console.log(res);
      });
    }
    catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <Link to={`/post/${post.id}`}>{post.content}</Link>
        </div>
      ))}
    </div>
  );
}

function Post() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const {postId} = useParams();

  useEffect(() => {
    instance.get(`/post/${postId}`).then(res => {
      console.log(res);
      if(res.status === 200)
      setPost(res.data[0])
    }
      
      ).catch(err => console.log(err));
    // instance.get(`/post/${postId}/comments`).then(res => setComments(res.data)).catch(err => console.log(err));
  }, []);

  const submitComment = () => {
      instance.post('/comment', { postId: postId, username: 'test', content: newComment }).then(() => {
        setNewComment('');
      instance.get(`/post/${postId}/comments`).then(res => setComments(res.data));
    });
  };

  if (!post) return 'Loading...';

  return (
    <div>
      <h1>{post.content}</h1>
      {comments.map(comment => (
        <div key={comment.id}>{comment.content}</div>
      ))}
      <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="New comment" />
      <button onClick={submitComment}>Submit comment</button>
    </div>
  );
}

function CreatePost() {
  const [content, setContent] = useState('');
  // get logged user
  const username = localStorage.getItem('user');

  const createPost = () => {
    instance.post('/post', { username, content });
  };

  return (
    <div>
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="New post" />
      <button onClick={createPost}>Create post</button>
    </div>
  );
}

export default App;
