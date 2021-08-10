const express = require("express");

const check = require("../middleware/auth");
const friendRequestController = require("../controllers/friend-request-controller");
const schema = require("../validator-schema/schema");
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
  schema.friendRequestSchema,
  validator.validateRequest,
  friendRequestController.addFriendRequest
);
router.delete(
  "/:id",
  check.isAuth,
  friendRequestController.deleteFriendRequest
);

module.exports = router;
