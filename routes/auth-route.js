const express = require("express");

const authController = require("../controllers/auth-controller");
const schema = require("../validator-schema/schema");
const validator = require("../middleware/validator");

const router = express.Router();

router.post(
  "/sign-up",
  schema.signUpSchema,
  validator.validateRequest,
  authController.signUp
);
router.post(
  "/log-in",
  schema.logInSchema,
  validator.validateRequest,
  authController.logIn
);

module.exports = router;
