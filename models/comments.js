const mongoose = require("mongoose");

const comment = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("comment", comment);
