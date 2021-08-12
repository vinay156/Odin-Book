const Comment = require("../models/comments");
const Post = require("../models/posts");

exports.allPostComments = async (req, res) => {
  const postId = req.params.id;

  const comments = await Comment.find({ post: postId })
    .populate("user")
    .populate("post");

  if (comments.length === 0) {
    return res.status(404).json({
      msg: "No comment found....",
    });
  }
  return res.status(200).json(comments);
};

exports.addComment = async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;
  const userId = req.user._id;

  if (content === "") {
    return res.status(400).json({
      msg: "content can't be empty",
    });
  }
  const post = await Post.findById(postId);
  if (post) {
    let comment = new Comment({
      content,
      user: userId,
      post: postId,
    });
    comment = await comment.save();
    return res
      .status(200)
      .json({ success: "commented...", commentId: comment._id });
  } else {
    return res.status(404).json({ msg: "Post not found" });
  }
};

exports.updateComment = async (req, res) => {
  const commentId = req.params.commentid;
  const postId = req.params.id;
  const userId = req.user._id;
  const { content } = req.body;

  if (content === "") {
    return res.status(400).json({
      msg: "content can't be empty",
    });
  }
  const updateData = { ...req.body };
  let comment = await Comment.findById(commentId);
  if (
    comment.user.toString() === userId &&
    comment.post.toString() === postId
  ) {
    comment = await Comment.updateOne({ _id: commentId }, updateData);
    return res
      .status(200)
      .json({ success: "Update comment...", content, commentId });
  } else {
    return res.status(404).json({ msg: "Post Not found" });
  }
};

exports.deleteComment = async (req, res) => {
  const commentId = req.params.commentid;

  const deleteUpdate = await Comment.deleteOne({ _id: commentId });
  return res.status(200).json({ success: "delete comment....", commentId });
};
