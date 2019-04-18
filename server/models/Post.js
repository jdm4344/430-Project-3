const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let PostModel = {};

const convertId = mongoose.Types.ObjectId;
const setTitle = (title) => _.escape(title).trim();

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Retrieves all post from a specific user on the server
PostSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertId(ownerID),
  };

  return PostModel.find(search).select('title ownerName content createdDate').exec(callback);
};

// Retrieves all posts from the sever
PostSchema.statics.getAllPosts = (callback) =>
    PostModel.find({}).select('title ownerName content createdDate').exec(callback);

// Handles removal of a post from the server
PostSchema.statics.deletePost = (postID, callback) => {
  const search = {
    _id: convertId(postID),
  };

  PostModel.deleteOne(search, (err) => {
    if (err) throw err;
  }).exec(callback);
};

PostModel = mongoose.model('Post', PostSchema);

module.exports.PostModel = PostModel;
module.exports.PostSchema = PostSchema;
