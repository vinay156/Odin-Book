const express = require("express");

const check = require("../middleware/auth");
const postController = require("../controllers/post-controller");
const contentValidator = require("../validators/content-validator")
  .contentSchema;
const validator = require("../middleware/validator");

const router = express.Router();

router.get("/", check.isAuth, postController.getAllPost);
router.get("/:id", check.isAuth, postController.getSinglePost);
router.post(
  "/",
  check.isAuth,
  contentValidator,
  validator.validateRequest,
  postController.addPost
);
router.put(
  "/:id",
  check.isAuth,
  contentValidator,
  validator.validateRequest,
  postController.updatePost
);
router.delete("/:id", check.isAuth, postController.deletePost);
router.put("/:id/like", check.isAuth, postController.likePost);
router.put("/:id/dislike", check.isAuth, postController.dislikePost);

module.exports = router;
