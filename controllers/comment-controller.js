const Comment = require("../models/comments");
const Post = require("../models/posts");

exports.allPostComments = (req, res) => {
  const postId = req.params.id;
  try {
    Comment.find({ post: postId })
      .populate("user")
      .populate("post")
      .then((comments) => {
        if (comments.length === 0) {
          res.status(404).json({
            msg: "No comment found....",
          });
        }
        return res.json(comments);
      });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

exports.addComment = async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;
  const userId = req.user._id;
  try {
    if (content === "") {
      return res.status(404).json({
        msg: "Post can't be empty",
      });
    }
    const commentPost = await Post.findById(id);
    if (commentPost) {
      const comment = new Comment({
        content,
        user: userId,
        post: id,
      });
      const commentResult = await comment.save();
      return res
        .status(200)
        .json({ success: "commented...", commentId: commentResult._id });
    } else {
    }
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.updateComment = async (req, res) => {
  const commentId = req.params.commentid;
  const content = req.body.content;
  try {
    if (content === "") {
      return res.status(404).json({
        msg: "Post can't be empty",
      });
    }
    const updateData = { ...req.body };
    const check = await Comment.findById(commentId);
    if (check) {
      await Comment.updateOne({ _id: commentId }, updateData);
      return res
        .status(200)
        .json({ success: "Update comment...", content, commentId });
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
  const commentId = req.params.commentid;
  try {
    const deleteUpdate = await Comment.deleteOne({ _id: commentId });
    return res.status(200).json({ success: "delete comment....", commentId });
  } catch (err) {
    res.status(500).json({
      err: err,
    });
  }
};
