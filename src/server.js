import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import session from 'express-session';
const express = require('express');
const cors = require('cors');
const app = express();

// 使用 CORS 中间件
app.use(cors());

// 其他中间件和路由设置
app.use(express.json());
app.post('/register', (req, res) => {
    // 处理注册请求的逻辑
});

app.listen(5000, () => {
    console.log('服务器正在运行在端口 5000');
});
const port = 5000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '200512',
  database: 'todo_app'
});

db.connect();

app.use(bodyParser.json());


app.use(session({
  secret: 'remedy', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ success: false });
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ success: false });
    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match) return res.status(400).json({ success: false });
      req.session.userId = user.id; // Store user ID in session
      res.json({ success: true, user });
    });
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
}

// Example protected route
app.get('/api/protected', isAuthenticated, (req, res) => {
  res.json({ success: true, message: 'This is a protected route' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});