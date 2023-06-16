import React, { useState } from 'react';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000',
});

function CreatePost() {
  const [content, setContent] = useState('');
  // get logged user
  const username = localStorage.getItem('user');

  const createPost = () => {
    instance.post('/post', { username, content });
  };

  return (
    <div className="p-8">
      <textarea 
        className="w-full p-2 mb-4 border rounded-md"
        value={content} 
        onChange={e => setContent(e.target.value)} 
        placeholder="New post" 
      />
      <button 
        className="w-full p-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        onClick={createPost}
      >
        Create post
      </button>
    </div>
  );
}

export default CreatePost;
