const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');


const app = express();

mongoose.connect("mongodb+srv://admin:KKe5EYlOHM4I5pt9@cluster0-dreim.mongodb.net/node-angular", {useNewUrlParser: true})
.then(() => {
  console.log('Connected to the database!');
})
.catch((err) => {
  console.log('Connection to the database failed', err);
});

app.use(bodyParser.json());
app.use("/images", express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods',
  'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

app.use('/api/posts',postsRoutes);
app.use('/api/user', userRoutes);


module.exports = app;
