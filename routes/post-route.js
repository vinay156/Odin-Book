const check = require("../middleware/auth");
const express = require("express");
const postController = require("../controllers/post-controller");
const router = express.Router();

router.get("/", check.isAuth, postController.getAllPost);
router.get("/:id", check.isAuth, postController.getSinglePost);
router.post("/", check.isAuth, postController.doPost);
router.put("/:id", check.isAuth, postController.updatePost);
router.delete("/:id", check.isAuth, postController.deletePost);
router.put("/:id/like", check.isAuth, postController.likePost);
router.put("/:id/dislike", check.isAuth, postController.dislikePost);

module.exports = router;
