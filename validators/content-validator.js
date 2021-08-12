const { body } = require("express-validator");

exports.contentSchema = schema = [
  body("content")
    .exists({ checkFalsy: true })
    .withMessage("Content can't be empty"),
];
