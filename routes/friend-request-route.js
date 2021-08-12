const express = require("express");

const check = require("../middleware/auth");
const friendRequestController = require("../controllers/friend-request-controller");
const friendRequestValidator = require("../validators/friend-request-validator")
  .friendRequestSchema;
const validator = require("../middleware/validator");

const router = express.Router();

router.get("/", check.isAuth, friendRequestController.getAllFriendRequest);
router.get(
  "/:id",
  check.isAuth,
  friendRequestController.getSingleFriendRequest
);
router.post(
  "/",
  check.isAuth,
  friendRequestValidator,
  validator.validateRequest,
  friendRequestController.addFriendRequest
);
router.delete(
  "/:id",
  check.isAuth,
  friendRequestController.deleteFriendRequest
);

module.exports = router;
