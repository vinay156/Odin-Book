const FriendRequest = require("../models/friend-request");
const Post = require("../models/posts");
const User = require("../models/users");

exports.getAllUser = async (req, res) => {
  try {
    await User.find()
      .populate("friends")
      .then((users) => {
        if (users.length === 0) {
          res.status(404).json({
            msg: "No Users found",
          });
        }
        res.json(users);
      });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userid = req.params.id;
    await User.findById(userid)
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
  try {
    const userid = req.params.id;
    await Post.find({ userid: userid })
      .populate("userid")
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
      msg: "check...",
    });
  }
};

exports.friendRequests = async (req, res) => {
  const userid = req.params.id;
  try {
    FriendRequest.find({ receiver: userid })
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
      err: err,
      msg: "Not done...",
    });
  }
};

exports.requestAccept = async (req, res) => {
  const userid = req.params.id;
  const senderid = req.body.senderid;
  try {
    if (!senderid) {
      return res.status(404).json({
        msg: "User id isn't sent in req body",
      });
    }
    const senderUser = await User.findById(senderid);
    if (!senderUser) {
      return res.status(400).json({
        msg: "User dosen't exist",
      });
    }
    const receiverUser = await User.findById(userid);
    if (receiverUser.friends.indexOf(senderid) !== -1) {
      return res.status(400).json({
        msg: "User already is friend",
      });
    }
    if (senderUser.friends.indexOf(userid) !== -1) {
      return res.status(400).json({
        msg: "User already is friend",
      });
    }
    receiverUser.friends.push(senderid);
    senderUser.friends.push(userid);
    const saveReceiver = receiverUser.save();
    const saveSender = senderUser.save();
    return res.json({
      saveReceiver,
    });
  } catch (err) {
    res.status(500).json({
      err: err,
      msg: "Not done...",
    });
  }
};

exports.unfriend = async (req, res) => {
  const userid = req.params.id;
  const senderid = req.body.senderid;
  try {
    if (!senderid) {
      return res.status(404).json({
        msg: "User id isn't sent in req body",
      });
    }
    const senderUser = await User.findById(senderid);
    if (!senderUser) {
      return res.status(400).json({
        msg: "User dosen't exist",
      });
    }
    const receiverUser = await User.findById(userid);
    if (!receiverUser) {
      return res.status(400).json({
        msg: "User dosen't exist",
      });
    }
    const receiverData = [...receiverUser.friends].filter(
      (friend) => friend.toString() !== senderid
    );
    console.log(receiverData);
    const senderData = [...senderUser.friends].filter(
      (friend) => friend.toString() !== userid
    );
    const updateReceiver = await User.updateOne(
      { _id: userid },
      { friends: receiverData }
    );
    const updateSender = await User.updateOne(
      { _id: senderid },
      { friends: senderData }
    );
    return res.json({ updateReceiver, msg: "delete...." });
  } catch (err) {
    res.status(500).json({
      err: err,
      msg: "check.....",
    });
  }
};
