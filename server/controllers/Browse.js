const models = require('../models');

const { Post } = models;

const getAllPosts = (request, response) => {
  const req = request;
  const res = response;

  Post.PostModel.getAllPosts((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    // console.dir(docs[0]._doc);

    return res.json({ csrfToken: req.csrfToken(), posts: docs });
  });
};

// Renders the browse page with all posts from the server
const browsePage = (request, response) => {
  const req = request;
  const res = response;

  Post.PostModel.getAllPosts((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    console.dir('browsePage()');

    return res.render('browse', { csrfToken: req.csrfToken(), posts: docs });
  });
};

module.exports.browsePage = browsePage;
module.exports.getAllPosts = getAllPosts;
