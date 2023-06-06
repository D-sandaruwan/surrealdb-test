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

app.listen(4000, () => console.log('Server running on port 4000'));
