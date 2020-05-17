const models = require('../models');

const { Post } = models;

const makerPage = (req, res) => {
  Post.PostModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    console.log('makerPage()');

    return res.render('app', { csrfToken: req.csrfToken(), posts: docs });
  });
};

// Handles submission of
const makePost = (req, res) => {
  if (!req.body.title || !req.body.content) {
    return res.status(400).json({ error: 'Both title and content are required' });
  }

  const postData = {
    title: req.body.title,
    content: req.body.content,
    ownerName: req.session.account.username,
    owner: req.session.account._id,
  };

  const newPost = new Post.PostModel(postData);

  const postPromise = newPost.save();

  postPromise.then(() => res.json({ redirect: '/maker' }));

  postPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Post with this title already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return postPromise;
};

// Handles deltion of a post
const deletePost = (req, res) => {
  if (!req.body.postID) {
    return res.status(400).json({ error: 'An error occurred' });
  }

  console.dir(req.body._csrf);

  return Post.PostModel.deletePost(req.body.postID, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(202).json({ error: 'An error occurred' });
    }

    return res.json({ posts: docs });
  });
};

// Render the edit page
// NODE: UNFINISHED
const editPage = (req, res) => res.render('edit', { csrfToken: req.csrfToken() });

// Handle submission of an update to a post
// NOTE: UNFINISHED
const editPost = (req, res) => {
  if (!req.body.title || !req.body.content) {
    return res.status(400).json({ error: 'Both title and content are required' });
  }

  return res.status(200).json({ message: 'Post updated' });
};

const getPosts = (request, response) => {
  const req = request;
  const res = response;

  return Post.PostModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ posts: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makePost;
module.exports.getPosts = getPosts;
module.exports.editPage = editPage;
module.exports.editPost = editPost;
module.exports.deletePost = deletePost;
