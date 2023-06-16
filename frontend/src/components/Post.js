import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const instance = axios.create({
  baseURL: 'http://localhost:4000',
});

function Post() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const { postId } = useParams();
  const username = localStorage.getItem('user');

  useEffect(() => {
    instance.get(`/post/${postId}`).then(res => {
      console.log(res);
      if (res.status === 200)
        setPost(res.data[0])
    }).catch(err => console.log(err));
  }, [postId]);

  const submitComment = () => {
    instance.post('/comment', { postId: postId, username, content: newComment }).then(() => {
      setNewComment('');
      instance.get(`/post/${postId}/comments`).then(res => setComments(res.data));
    });
  };

  const likePost = () => {
    instance.post('/like', { username, postId }).then(res => {
      if (res.status === 200) {
        alert('You liked this post!');
      } else {
        alert('You have already liked this post');
      }
    }).catch(err => {
      alert(err.response.data.message);
    });
  };

  if (!post) return 'Loading...';

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold text-gray-800">{post.content}</h1>
      <button 
        className="mb-4 p-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        onClick={likePost}
      >
        Like
      </button>
      {comments.map(comment => (
        <div key={comment.id} className="p-4 mb-2 bg-white rounded shadow">
          {comment.content}
        </div>
      ))}
      <input 
        className="w-full p-2 mt-2 border rounded-md"
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
        placeholder="New comment"
      />
      <button 
        className="w-full p-2 mt-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        onClick={submitComment}
      >
        Submit comment
      </button>
    </div>
  );
}

export default Post;
