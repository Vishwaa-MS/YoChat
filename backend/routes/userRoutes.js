const express = require("express");
const router = express.Router();
const { signupUser, loginUser } = require("../controllers/userControllers");

router.route("/signup").post(signupUser);
router.post("/login", loginUser);

module.exports = router;
