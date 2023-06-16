import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const instance = axios.create({
  baseURL: 'http://localhost:4000',
});

function Posts() {
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    instance.get('/posts').then(res => {
      if (res.status === 200) {
        setPosts(res.data[0].result);
      }
    });
  }, []);

  return (
    <div className="p-8">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">Posts</h2>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="p-4 bg-white rounded shadow">
            <Link to={`/post/${post.id}`} className="text-blue-600 hover:underline">
              {post.content}
            </Link>
          </div>
          
        ))}
      </div>
      <button
            className="w-full p-2 mt-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => navigate('/create-post')}
          >
            Create Post
          </button>
    </div>
  );
}

export default Posts;
