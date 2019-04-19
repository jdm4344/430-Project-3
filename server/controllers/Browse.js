const models = require('../models');

const Post = models.Post;

// Renders the browse page with all posts from the server
const displayPosts = (req, res) => {
  Post.PostModel.getAllPosts((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('browse', { csrfToken: req.csrfToken(), posts: docs });
  });
};

module.exports.displayPosts = displayPosts;
