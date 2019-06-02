const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://admin:KKe5EYlOHM4I5pt9@cluster0-dreim.mongodb.net/node-angular?retryWrites=true&w=majority", {useNewUrlParser: true})
.then(() => {
  console.log('Connected to the database!');
})
.catch(() => {
  console.log('Connection to the database failed');
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.get('/api/posts', (req, res, next) => {

  Post.find()
  .then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    });
  });
});

app.post('/api/posts', (req, res, next) =>
{
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id
    });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
  .then(result => {
    console.log('Deleeted');
    res.status(200).json({
      message: "Post "+ req.params.id +" deleted"
    });
  })
  .catch((err) => {
    console.log('Cromo');
  });
});


module.exports = app;
