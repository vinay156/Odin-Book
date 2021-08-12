const { body } = require("express-validator");

exports.friendRequestSchema = schema = [
  body("senderId")
    .exists({ checkFalsy: true })
    .withMessage("senderId can't be empty"),
  body("receiverId")
    .exists({ checkFalsy: true })
    .withMessage("ReceiverId can't be empty"),
];
