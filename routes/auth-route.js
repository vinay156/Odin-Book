const express = require("express");

const authController = require("../controllers/auth-controller");
const signUpValidator = require("../validators/sign-up-validator").signUpSchema;
const logInValidator = require("../validators/log-in-validator").logInSchema;
const validator = require("../middleware/validator");

const router = express.Router();

router.post(
  "/sign-up",
  signUpValidator,
  validator.validateRequest,
  authController.signUp
);
router.post(
  "/log-in",
  logInValidator,
  validator.validateRequest,
  authController.logIn
);

module.exports = router;
