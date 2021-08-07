const FriendRequest = require("../models/friend-request");
const User = require("../models/users");

exports.getAllFriendRequest = (req, res) => {
  try {
    FriendRequest.find()
      .populate("receiver")
      .populate("sender")
      .then((data) => {
        if (data.length === 0) {
          res.status(404).json({
            msg: "No friends request found....",
          });
        }
        return res.json(data);
      });
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.getSingleFriendRequest = async (req, res) => {
  try {
    const requestid = req.params.id;
    await FriendRequest.findById(requestid)
      .populate("receiver")
      .populate("sender")
      .then((request) => {
        if (!request) {
          res.status(404).json({
            msg: "request no found",
          });
        }
        res.json(request);
      });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.doFriendRequest = async (req, res) => {
  const { sender, receiver } = req.body;
  try {
    if (!sender || !receiver) {
      return res.status(404).json({
        msg: "Sender or Receiver not given",
      });
    }
    if (sender === receiver) {
      return res.status(404).json({
        msg: "Sender and Receiver are same",
      });
    }

    const senderUser = await User.findById(sender);
    const receiverUser = await User.findById(receiver);

    if (!senderUser || !receiverUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const newFriendRequest = new FriendRequest({
      sender: sender,
      receiver: receiver,
    });
    const requestResult = await newFriendRequest.save();
    return res.status(200).json(requestResult);
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

exports.deleteFriendRequest = async (req, res) => {
  const requestid = req.params.id;
  try {
    const deleteUpdate = await FriendRequest.deleteOne({ _id: requestid });
    return res.status(200).json({ deleteUpdate, _id: requestid });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};
