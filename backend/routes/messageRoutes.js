const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { authUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(authUser, allMessages);
router.route("/").post(authUser, sendMessage);

module.exports = router;
