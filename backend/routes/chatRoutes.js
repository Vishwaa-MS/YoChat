const express = require("express");
const { authUser } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(authUser, accessChat);
router.route("/").get(authUser, fetchChats);

router.route("/group").post(authUser, createGroupChat);
router.route("/renamegroup").put(authUser, renameGroup);
router.route("/groupremove").put(authUser, removeFromGroup);
router.route("/groupadd").put(authUser, addToGroup);

module.exports = router;
