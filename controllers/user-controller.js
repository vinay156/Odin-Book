const FriendRequest = require("../models/friend-request");
const Post = require("../models/posts");
const User = require("../models/users");

exports.getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findById(userId)
      .populate("friends")
      .then((user) => {
        if (!user) {
          res.status(404).json({
            msg: "User no found",
          });
        }
        res.json(user);
      });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.userPosts = async (req, res) => {
  const userId = req.params.id;
  try {
    await Post.find({ user: userId })
      .populate("user")
      .then((posts) => {
        if (posts.length === 0) {
          res.status(404).json({
            msg: "No posts found",
          });
        }
        return res.json(posts);
      });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.friendRequests = async (req, res) => {
  const userId = req.params.id;
  try {
    FriendRequest.find({ receiver: userId })
      .populate("sender")
      .populate("receiver")
      .then((results) => {
        if (results.length === 0) {
          return res.status(404).json({
            msg: "No request found",
          });
        }
        res.json(results);
      });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.requestAccept = async (req, res) => {
  const userId = req.params.id;
  const senderId = req.body.senderId;
  try {
    if (!senderId) {
      return res.status(404).json({
        msg: "User id isn't sent in req body",
      });
    }
    const senderUser = await User.findById(senderId);
    if (!senderUser) {
      return res.status(400).json({
        msg: "User dosen't exist",
      });
    }
    const receiverUser = await User.findById(userId);
    if (receiverUser.friends.indexOf(senderId) !== -1) {
      return res.status(400).json({
        msg: "User already is friend",
      });
    }
    if (senderUser.friends.indexOf(userId) !== -1) {
      return res.status(400).json({
        msg: "User already is friend",
      });
    }
    receiverUser.friends.push(senderId);
    senderUser.friends.push(userId);
    const saveReceiver = receiverUser.save();
    const saveSender = senderUser.save();
    return res.json({
      userId,
      saveReceiver,
    });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.unfriend = async (req, res) => {
  const userId = req.params.id;
  const senderId = req.body.senderId;
  try {
    if (!senderId) {
      return res.status(404).json({
        msg: "User id isn't sent in req body",
      });
    }
    const senderUser = await User.findById(senderId);
    if (!senderUser) {
      return res.status(400).json({
        msg: "User dosen't exist",
      });
    }
    const receiverUser = await User.findById(userId);
    if (!receiverUser) {
      return res.status(400).json({
        msg: "User dosen't exist",
      });
    }
    const receiverData = [...receiverUser.friends].filter(
      (friend) => friend.toString() !== senderId
    );

    const senderData = [...senderUser.friends].filter(
      (friend) => friend.toString() !== userId
    );
    const updateReceiver = await User.updateOne(
      { _id: userId },
      { friends: receiverData }
    );
    const updateSender = await User.updateOne(
      { _id: senderId },
      { friends: senderData }
    );
    return res.json({ userId, updateReceiver });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};
