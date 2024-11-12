const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  walletAddress: {
    type: String,
  },
  Image: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  company: {
    type: String
  },
  bio: {
    type: String
  },
  followers: {
    type: Number
  },
  following: {
    type: Number
  },
  location: {
    type: String
  },
  twitter_url: {
    type: String
  },
  auth0_id: {
    type: String,
    required: true,
  },
  matchedUsers: {
    type: Array,
    default: [],
  },
  likedUsers: {
    type: Array,
    default: [],
  },
  rejectedUsers: {
    type: Array,
    default: [],
  },
  messageArrays: {
    type: Array,
    default: [],
  },
  organizations_url: {
    type: String
  },
  stack: {
    type: Array,
    default: [],
  },
  interests: {
    type: Array,
    default: [],
  },
  projects: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Users", UserSchema);