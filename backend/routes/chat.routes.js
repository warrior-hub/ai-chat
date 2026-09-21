const express = require("express");

const {
  createConversation,
  getConversations,
  getConversation,
  renameConversation,
  deleteConversation,
  sendMessage,
} = require("../controllers/chat.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

// All chat routes require login
router.use(protect);

// Create new chat
router.post("/", createConversation);

// Get all chats
router.get("/", getConversations);

// Get one chat with messages
router.get("/:id", getConversation);

// Rename chat
router.patch("/:id", renameConversation);

// Delete chat
router.delete("/:id", deleteConversation);
router.post("/:id/messages", sendMessage);

module.exports = router;