const express = require('express');

const app = express();

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {id: 'asdfal23b', title:'First server-side post', content:'this is coming from the server'},
    {id: 'asdfal23b', title:'Second server-side post', content:'this is as from the server'},
    {id: 'asdfal23b', title:'Third server-side post', content:'this is coasdming from the server'}
  ];
  res.status(200).json({
    message: 'Posts fetched successfully',
    posts: posts
  });
});

module.exports = app;
