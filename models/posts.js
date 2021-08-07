const mongoose = require("mongoose");

const posts = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("posts", posts);
