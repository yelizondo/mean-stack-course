const express = require('express');
const extractFile = require('../middleware/file');
const checkAuth = require('../middleware/check-auth');
const PostsController =  require('../contollers/posts');

const router = express.Router();

router.get('', PostsController.getAllRoute);

router.post('', checkAuth, extractFile, PostsController.postRoute);

router.put('/:id', checkAuth, extractFile, PostsController.putRoute);

router.get('/:id', PostsController.getOneRoute);

router.delete('/:id',  checkAuth, PostsController.deleteRoute);

module.exports = router;
