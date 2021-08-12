const Post = require("../models/posts");

exports.getAllPost = async (req, res) => {
  const posts = await Post.find().populate("user");
  if (posts.length === 0) {
    return res.status(404).json({
      msg: "No Posts found....",
    });
  }
  res.status(200).json(posts);
};

exports.getSinglePost = async (req, res) => {
  const postId = req.params.id;

  const post = await Post.findById(postId).populate("user");
  if (!post) {
    return res.status(404).json({
      msg: "Post not found",
    });
  }
  res.status(200).json(post);
};

exports.addPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;

  if (content === "") {
    return res.status(400).json({
      msg: "content can't be empty",
    });
  }
  let post = new Post({
    content,
    user: userId,
  });
  post = await post.save();
  return res.status(200).json({ success: "success...", post });
};

exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const content = req.body.content;
  const userId = req.user._id;
  if (content === "") {
    return res.status(400).json({
      msg: "content can't be empty",
    });
  }
  const updateData = { ...req.body };
  const post = await Post.findById(postId);
  if (post.user.toString() === userId) {
    await Post.updateOne({ _id: postId }, updateData);
    return res.status(200).json({ success: "Updated...", content, postId });
  } else {
    return res.status(404).json({ msg: "Post Not found" });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  const deleteUpdate = await Post.deleteOne({ _id: postId });
  return res.status(200).json({ success: "deleted...", deleteUpdate, postId });
};

exports.likePost = async (req, res) => {
  const postId = req.params.id;
  const { _id } = req.user;

  if (!_id) {
    return res.status(400).json({
      message: "Bad request.",
      details: ["Missing user ID."],
    });
  }

  let post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "Post not found.",
    });
  }

  const likes = [...post.likes];
  const foundUser = likes.find((user) => user.toString() === _id);

  if (foundUser !== undefined) {
    return res.status(403).json({
      message: "Forbidden",
      details: ["User has already liked the post."],
    });
  }

  likes.push(_id);

  post = await Post.updateOne({ _id: postId }, { likes });
  return res.status(200).json({ success: "liked....", post });
};

exports.dislikePost = async (req, res) => {
  const postId = req.params.id;
  const { _id } = req.user;
  if (!_id) {
    return res.status(400).json({
      message: "Bad request.",
      details: ["Missing user ID."],
    });
  }

  let post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "Post not found.",
    });
  }

  if (post.likes.indexOf(_id) === -1) {
    return res.status(403).json({
      message: "Forbidden",
      details: ["User has not liked the post before."],
    });
  }

  const likes = [...post.likes].filter((user) => user.toString() !== _id);

  post = Post.updateOne({ _id: postId }, { likes });
  return res.status(200).json({ success: "disliked....", post });
};
