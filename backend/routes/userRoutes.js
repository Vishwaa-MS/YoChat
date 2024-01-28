const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  allUsers,
} = require("../controllers/userControllers");

const { authUser } = require("../middleware/authMiddleware");

router.route("/").get(authUser, allUsers);
router.route("/signup").post(signupUser);
router.post("/login", loginUser);

module.exports = router;
