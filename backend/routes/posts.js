const express = require('express');
const multer = require('multer');
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');

    if (isValid) {
      error = null;
    }

    cb(error, "backend/images");
  },

  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage= +req.query.page;
  let fetchedPosts;
  const postQuery = Post.find();

  if (pageSize && currentPage)
  {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery.find()
  .then(documents => {
    fetchedPosts = documents;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: fetchedPosts,
      maxPosts: count
    });
  });
});

router.post('',
 checkAuth,
 multer({storage: storage}).single('image'), (req, res, next) =>
{
  const url = req.protocol + '://' + req.get('host');

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });


  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  });
});

router.put('/:id',
 checkAuth,
 multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });

  Post.updateOne({_id: req.params.id}, post)
  .then(result => {
    res.status(200).json({
      message: 'Update successfull',
      image: post.imagePath
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "Post not found"
      });
    }
  });
});

router.delete('/:id',  checkAuth, (req, res, next) => {
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

module.exports = router;
