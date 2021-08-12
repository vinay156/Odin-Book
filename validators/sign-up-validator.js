const { body } = require("express-validator");

exports.signUpSchema = schema = [
  body("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First name can't be empty"),
  body("lastName")
    .exists({ checkFalsy: true })
    .withMessage("last name can't be empty"),
  body("email").isEmail().withMessage("Email must contain @"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Length should be greater than or equal to 5"),
  body("photo").exists({ checkFalsy: false }).withMessage("photo can be empty"),
];
