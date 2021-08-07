const authController = require("../controllers/auth-controller");
const express = require("express");
const router = express.Router();

router.post("/sign-up", authController.signUp);
router.post("/log-in", authController.logIn);

module.exports = router;
