const { body } = require("express-validator");

exports.requestAcceptSchema = schema = [
  body("senderId")
    .exists({ checkFalsy: true })
    .withMessage("senderId can't be empty"),
];
