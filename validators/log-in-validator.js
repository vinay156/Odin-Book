const { body } = require("express-validator");

exports.logInSchema = schema = [
  body("email").isEmail().withMessage("Email must contain @"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Length should be greater than or equal to 5"),
];
