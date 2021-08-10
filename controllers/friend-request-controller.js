const FriendRequest = require("../models/friend-request");
const User = require("../models/users");

exports.getAllFriendRequest = async (req, res) => {
  try {
    const data = await FriendRequest.find()
      .populate("receiver")
      .populate("sender");

    if (data.length === 0) {
      return res.status(404).json({
        msg: "No friends request found....",
      });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.getSingleFriendRequest = async (req, res) => {
  const requestId = req.params.id;
  try {
    const request = await FriendRequest.findById(requestId)
      .populate("receiver")
      .populate("sender");
    if (!request) {
      return res.status(404).json({
        msg: "request no found",
      });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.addFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    if (!senderId || !receiverId) {
      return res.status(404).json({
        msg: "Sender or Receiver not given",
      });
    }
    if (senderId === receiverId) {
      return res.status(404).json({
        msg: "Sender and Receiver are same",
      });
    }

    const senderUser = await User.findById(senderId);
    const receiverUser = await User.findById(receiverId);

    if (!senderUser || !receiverUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const friendRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
    });
    const requestResult = await friendRequest.save();
    return res.status(200).json(requestResult);
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.deleteFriendRequest = async (req, res) => {
  const requestId = req.params.id;
  try {
    const deleteUpdate = await FriendRequest.deleteOne({ _id: requestId });
    return res
      .status(200)
      .json({ success: "delete friend request...", requestId });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};
