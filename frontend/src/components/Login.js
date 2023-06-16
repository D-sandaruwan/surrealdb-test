import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const instance = axios.create({
  baseURL: 'http://localhost:4000',
});

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-4 bg-white rounded shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>
        <input 
          className="w-full p-2 mt-2 border rounded-md"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input 
          className="w-full p-2 mt-2 border rounded-md"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button 
          className="w-full p-2 mt-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
