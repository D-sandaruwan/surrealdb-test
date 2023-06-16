import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const instance = axios.create({
  baseURL: 'http://localhost:4000',
});

function Posts() {
  const [posts, setPosts] = useState([]);

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
    </div>
  );
}

export default Posts;
