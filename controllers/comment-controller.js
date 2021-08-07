const Comment = require("../models/comments");
const Post = require("../models/posts");

exports.allPostComments = (req, res) => {
  const postid = req.params.postid;
  try {
    Comment.find({ post: postid })
      .populate("userid")
      .populate("post")
      .then((comments) => {
        if (comments.length === 0) {
          res.status(404).json({
            msg: "No Posts found....",
          });
        }
        return res.json(comments);
      });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.doComment = async (req, res) => {
  const { content } = req.body;
  const { postid } = req.params;
  try {
    if (content === "") {
      return res.status(404).json({
        msg: "Post can't be empty",
      });
    }
    const commentPost = await Post.findById(postid);
    if (commentPost) {
      const newComment = new Comment({
        content: content,
        userid: req.user._id,
        post: postid,
      });
      const commentResult = await newComment.save();
      return res.status(200).json(commentResult);
    } else {
    }
  } catch (err) {
    res.status(500).json({
      err: err,
    });
  }
};

exports.updateComment = async (req, res) => {
  const { postid, commentid } = req.params;
  const content = req.body.content;
  try {
    if (content === "") {
      return res.status(404).json({
        msg: "Post can't be empty",
      });
    }
    const updateData = { ...req.body };
    const check = await Comment.findById(commentid);
    if (check) {
      await Comment.updateOne({ _id: commentid }, updateData);
      return res.status(200).json({ content, _id: commentid });
    } else {
      return res.status(404).json({ msg: "Post Not found" });
    }
  } catch (err) {
    res.status(500).json({
      err: err,
    });
  }
};

exports.deleteComment = async (req, res) => {
  const commentid = req.params.commentid;
  try {
    const deleteUpdate = await Comment.deleteOne({ _id: commentid });
    return res.status(200).json({ deleteUpdate, _id: commentid });
  } catch (err) {
    res.status(500).json({
      err: err,
    });
  }
};
