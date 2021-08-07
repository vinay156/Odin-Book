const check = require("../middleware/auth");
const commentController = require("../controllers/comment-controller");
const express = require("express");
const router = express.Router();

router.get(
  "/:postid/comments",
  check.isAuth,
  commentController.allPostComments
);
router.post("/:postid/comments", check.isAuth, commentController.doComment);
router.put(
  "/:postid/comments/:commentid",
  check.isAuth,
  commentController.updateComment
);
router.delete(
  "/:postid/comments/:commentid",
  check.isAuth,
  commentController.deleteComment
);

module.exports = router;
