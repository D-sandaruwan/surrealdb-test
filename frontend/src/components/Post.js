import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const instance = axios.create({
  baseURL: 'http://localhost:4000',
});

function Post() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Additional state for post update
  const [isEditing, setIsEditing] = useState(false);
  const [updatedPostContent, setUpdatedPostContent] = useState('');

  const { postId } = useParams();
  const username = localStorage.getItem('user');
  const navigate = useNavigate();


  const getPost = (postId) => {
    instance.get(`/post/${postId}`).then(res => {
      console.log(res);
      if (res.status === 200)
        setPost(res.data[0])
    }).catch(err => console.log(err));
  }

  useEffect(() => {
    getPost(postId);
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

  // Update post function
  const updatePost = () => {
    instance.put(`/post/${postId}`, { content: updatedPostContent }).then(res => {
      if (res.status === 200) {
        alert('Post updated successfully');
        getPost(postId);
        setIsEditing(false);
        setPost(res.data[0]);
      }
    }).catch(err => alert(err.response.data.message));
  };

  // Delete post function
  const deletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      instance.delete(`/post/${postId}`).then(res => {
        if (res.status === 200) {
          alert('Post deleted successfully');
          navigate('/posts') // Redirect to home after deletion
        }
      }).catch(err => alert(err.response.data.message));
    }
  };

  if (!post) return 'Loading...';

  return (
    <div className="p-8">
      {
        isEditing ? (
          <>
            <textarea
              className="w-full p-2 mb-4 border rounded-md"
              value={updatedPostContent}
              onChange={e => setUpdatedPostContent(e.target.value)}
            />
            <button
              className="mb-4 mr-2 p-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={updatePost}
            >
              Save Changes
            </button>
            <button
              className="mb-4 p-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </>
        ) : (<>

          <h1 className="mb-4 text-2xl font-semibold text-gray-800">{post.content}</h1>
          <button
            className="mb-4 mr-2 p-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={likePost}
          >
            Like
          </button>
          <button
            className="mb-4 mr-2 p-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className="mb-4 p-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
            onClick={deletePost}
          >
            Delete
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
        </>)
      }
    </div>
  );
}

export default Post;
