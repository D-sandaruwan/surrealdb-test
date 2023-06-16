const express = require('express');
const { default: Surreal } = require('surrealdb.js');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connecting to SurrealDB
const db = new Surreal('http://127.0.0.1:8000/rpc');
db.signin({
    user: 'root',
    pass: 'root',
});
db.use('app', 'app');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

// Route for user registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const userAlready = await db.select(`user:${username}`);
    if (userAlready) {
        res.status(400).json({ message: 'User already exists', data: null });
        return;
    }
    else {
        const user = await db.create('user', { id: `user:${username}`, password });
        res.json(user);
    }
});

// Route for user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.select(`user:${username}`);
    console.log(user);
    if (user && user.password === password) {
        // This is a simplified example, normally you should use JWT or similar for handling user sessions
        res.json({ message: 'Logged in successfully', data: user });
    } else {
        res.status(401).json({ message: 'Invalid username or password', data: null });
    }
});

// Route for getting all posts
app.get('/posts', async (req, res) => {
    const posts = await db.query('SELECT * FROM post');
    res.json(posts);
});

// Route for getting a single post
app.get('/post/:postId', async (req, res) => {
    const { postId } = req.params;
    // console.log(postId);
    const post = await db.query(`SELECT * FROM post WHERE id = ${postId} LIMIT 1`);
    // const post = await db.select(postId);
    res.json(post[0].result);
});

// Route for creating a post
app.post('/post', async (req, res) => {
    const { username, content } = req.body;
    const post = await db.create('post', { username, content });
    res.json(post);
});

// Route for commenting on a post
app.post('/comment', async (req, res) => {
    const { postId, username, content } = req.body;
    const comment = await db.create('comment', { postId, username, content });
    res.json(comment);
});

// Route for getting all comments on a post
app.get('/post/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    const comments = await db.query('SELECT * FROM comment WHERE postId = ?', [postId]);
    res.json(comments);
});

// Route for a user to like a post
app.post('/like', async (req, res) => {
    const { username, postId } = req.body;
    // Check if the user and the post exist
    const user = await db.select(username);
    const post = await db.select(postId);
    if (!user || !post) {
        res.status(404).json({ message: 'User or post not found', data: null });
        return;
    }
    // Check if the user has already liked the post
    const existingLike = await db.query(`SELECT * FROM like WHERE in INSIDE $username AND out INSIDE $postId`, {username, postId});
    console.log(existingLike);
    if (existingLike && existingLike.length && existingLike[0].result.length) {
        res.status(400).json({ message: 'User has already liked this post', data: null });
        return;
    }
    // Create the "like" relationship
    await db.query(`RELATE ${username}->like->${postId} UNIQUE SET time.liked = time::now()`);
    res.json({ message: 'Liked post successfully' });
});

// Route for getting all likes on a post
app.get('/post/:postId/likes', async (req, res) => {
    const { postId } = req.params;
    const likes = await db.query('SELECT * FROM user->like->post WHERE post.id = $postId', [postId]);
    res.json(likes);
});

app.listen(4000, () => console.log('Server running on port 4000'));
