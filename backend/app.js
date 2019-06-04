const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');


const app = express();

mongoose.connect("mongodb+srv://admin:KKe5EYlOHM4I5pt9@cluster0-dreim.mongodb.net/node-angular?retryWrites=true&w=majority", {useNewUrlParser: true})
.then(() => {
  console.log('Connected to the database!');
})
.catch(() => {
  console.log('Connection to the database failed');
});

app.use(bodyParser.json());
app.use("/images", express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

app.use('/api/posts',postsRoutes);


module.exports = app;
