const express = require("express");

const check = require("../middleware/auth");
const commentController = require("../controllers/comment-controller");
const schema = require("../validator-schema/schema");
const validator = require("../middleware/validator");

const router = express.Router();

router.get("/:id/comments", check.isAuth, commentController.allPostComments);
router.post(
  "/:id/comments",
  check.isAuth,
  schema.contentSchema,
  validator.validateRequest,
  commentController.addComment
);
router.put(
  "/:id/comments/:commentid",
  check.isAuth,
  schema.contentSchema,
  validator.validateRequest,
  commentController.updateComment
);
router.delete(
  "/:id/comments/:commentid",
  check.isAuth,
  commentController.deleteComment
);

module.exports = router;
