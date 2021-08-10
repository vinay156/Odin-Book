const Post = require("../models/posts");

exports.getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    if (posts.length === 0) {
      return res.status(404).json({
        msg: "No Posts found....",
      });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.getSinglePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId).populate("user");
    if (!post) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.addPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;
  try {
    if (content === "") {
      return res.status(404).json({
        msg: "Post can't be empty",
      });
    }
    let post = new Post({
      content,
      user: userId,
    });
    post = await post.save();
    return res.status(200).json({ success: "success...", post });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const content = req.body.content;
  const userId = req.user._id;
  try {
    if (content === "") {
      return res.status(404).json({
        msg: "Post can't be empty",
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
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const deleteUpdate = await Post.deleteOne({ _id: postId });
    return res
      .status(200)
      .json({ success: "deleted...", deleteUpdate, postId });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.likePost = async (req, res) => {
  const postId = req.params.id;
  const { _id } = req.user;
  try {
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
      return res.status(404).json({
        message: "Forbidden",
        details: ["User has already liked the post."],
      });
    }

    likes.push(_id);

    post = await Post.updateOne({ _id: postId }, { likes });
    return res.status(200).json({ success: "liked....", post });
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.dislikePost = async (req, res) => {
  const postId = req.params.id;
  const { _id } = req.user;
  try {
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
      return res.status(404).json({
        message: "Forbidden",
        details: ["User has not liked the post before."],
      });
    }

    const likes = [...post.likes].filter((user) => user.toString() !== _id);

    post = Post.updateOne({ _id: postId }, { likes });
    return res.status(200).json({ success: "disliked....", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
};
