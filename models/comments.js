const mongoose = require("mongoose");

const Comment = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", Comment);
