import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Posts from './components/Posts';
import Post from './components/Post';
import CreatePost from './components/CreatePost';

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

export default App;
