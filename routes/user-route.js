const express = require("express");

const check = require("../middleware/auth");
const schema = require("../validator-schema/schema");
const userController = require("../controllers/user-controller");
const validator = require("../middleware/validator");

const router = express.Router();

router.get("/:id", check.isAuth, userController.getUser);
router.get("/:id/posts", check.isAuth, userController.userPosts);
router.get("/:id/friendrequests", check.isAuth, userController.friendRequests);
router.put(
  "/:id/friend",
  check.isAuth,
  schema.requestAcceptSchema,
  validator.validateRequest,
  userController.requestAccept
);
router.delete("/:id/unfriend", check.isAuth, userController.unfriend);

module.exports = router;
