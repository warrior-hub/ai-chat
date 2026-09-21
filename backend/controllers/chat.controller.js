const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const {
  generateAIResponseStream,
  generateConversationTitle,
} = require("../services/gemini.service");
// =====================================
// CREATE NEW CONVERSATION
// =====================================

const createConversation = async (req, res) => {
  try {
    const conversation = await Conversation.create({
      user: req.user._id,
      title: "New Chat",
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
};


// =====================================
// GET ALL CONVERSATIONS
// =====================================

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      user: req.user._id,
    }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};


// =====================================
// GET SINGLE CONVERSATION
// =====================================

const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const messages = await Message.find({
      conversation: conversation._id,
    }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      conversation,
      messages,
    });
  } catch (error) {
    console.error("Get conversation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
    });
  }
};


// =====================================
// RENAME CONVERSATION
// =====================================

const renameConversation = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        title: title.trim(),
      },
      {
        new: true,
      }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Conversation renamed successfully",
      conversation,
    });
  } catch (error) {
    console.error("Rename conversation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to rename conversation",
    });
  }
};


// =====================================
// DELETE CONVERSATION
// =====================================

const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    await Message.deleteMany({
      conversation: conversation._id,
    });

    await Conversation.deleteOne({
      _id: conversation._id,
    });

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Delete conversation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const conversationId = req.params.id;

    // -----------------------------------------
    // Validate message
    // -----------------------------------------
    if (
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const trimmedContent = content.trim();

    // -----------------------------------------
    // Limit message length
    // -----------------------------------------
    if (trimmedContent.length > 10000) {
      return res.status(400).json({
        success: false,
        message:
          "Message cannot exceed 10,000 characters",
      });
    }

    // -----------------------------------------
    // Validate conversation ID
    // -----------------------------------------
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    // -----------------------------------------
    // Find conversation
    // -----------------------------------------
    const conversation =
      await Conversation.findOne({
        _id: conversationId,
        user: req.user._id,
      });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // -----------------------------------------
    // Save user message
    // -----------------------------------------
    const userMessage =
      await Message.create({
        conversation: conversationId,
        role: "user",
        content: trimmedContent,
      });

    // -----------------------------------------
    // Generate simple title for first message
    // No extra Gemini API call
    // -----------------------------------------
    const messageCount =
      await Message.countDocuments({
        conversation: conversationId,
      });

    if (
      messageCount === 1 &&
      conversation.title === "New Chat"
    ) {
      conversation.title =
        trimmedContent
          .replace(/\s+/g, " ")
          .slice(0, 50);

      await conversation.save();
    }

    // -----------------------------------------
    // Get conversation history
    // -----------------------------------------
    const previousMessages =
      await Message.find({
        conversation: conversationId,
      })
        .sort({ createdAt: 1 })
        .select("role content");

    // -----------------------------------------
    // Convert messages for Gemini
    // -----------------------------------------
    const aiMessages =
      previousMessages.map((message) => ({
        role: message.role,
        content: message.content,
      }));

    // -----------------------------------------
    // SSE Headers
    // -----------------------------------------
    res.setHeader(
      "Content-Type",
      "text/event-stream; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache, no-transform"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    res.setHeader(
      "X-Accel-Buffering",
      "no"
    );

    res.flushHeaders();

    // -----------------------------------------
    // Send user message to frontend
    // -----------------------------------------
    res.write(
      `data: ${JSON.stringify({
        type: "user_message",
        message: userMessage,
      })}\n\n`
    );

    // -----------------------------------------
    // Generate AI response
    // -----------------------------------------
    let fullAIResponse = "";

    try {
      fullAIResponse =
        await generateAIResponseStream(
          aiMessages,
          (chunk) => {
            // Client disconnected
            if (res.destroyed) {
              return;
            }

            // Send streamed AI chunk
            res.write(
              `data: ${JSON.stringify({
                type: "chunk",
                text: chunk,
              })}\n\n`
            );
          }
        );

      // ---------------------------------------
      // Check empty response
      // ---------------------------------------
      if (
        !fullAIResponse ||
        !fullAIResponse.trim()
      ) {
        throw new Error(
          "Empty AI response"
        );
      }

      // ---------------------------------------
      // Save assistant response
      // ---------------------------------------
      const assistantMessage =
        await Message.create({
          conversation: conversationId,
          role: "assistant",
          content: fullAIResponse,
        });

      // ---------------------------------------
      // Update conversation time
      // ---------------------------------------
      conversation.updatedAt =
        new Date();

      await conversation.save();

      // ---------------------------------------
      // Send completed response
      // ---------------------------------------
      if (!res.destroyed) {
        res.write(
          `data: ${JSON.stringify({
            type: "done",
            message: assistantMessage,
          })}\n\n`
        );

        res.end();
      }
    } catch (aiError) {
      console.error(
        "Gemini error:",
        aiError
      );

      let errorMessage =
        "AI response failed. Please try again.";

      const errorText =
        aiError?.message?.toLowerCase() ||
        "";

      // ---------------------------------------
      // Rate limit / quota
      // ---------------------------------------
      if (
        errorText.includes("429") ||
        errorText.includes("rate") ||
        errorText.includes("quota")
      ) {
        errorMessage =
          "AI usage limit reached. Please try again later.";
      }

      // ---------------------------------------
      // API authentication
      // ---------------------------------------
      if (
        errorText.includes("api key") ||
        errorText.includes("authentication") ||
        errorText.includes("401") ||
        errorText.includes("403")
      ) {
        errorMessage =
          "AI API authentication failed. Check your Gemini API key.";
      }

      // ---------------------------------------
      // Model not found
      // ---------------------------------------
      if (
        errorText.includes("not found") ||
        errorText.includes("model")
      ) {
        errorMessage =
          "AI model is unavailable. Please check the configured Gemini model.";
      }

      // ---------------------------------------
      // Send error to frontend
      // ---------------------------------------
      if (!res.destroyed) {
        res.write(
          `data: ${JSON.stringify({
            type: "error",
            message: errorMessage,
          })}\n\n`
        );

        res.end();
      }
    }
  } catch (error) {
    console.error(
      "Send message error:",
      error
    );

    // -----------------------------------------
    // Normal JSON error
    // -----------------------------------------
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to send message",
      });
    }

    // -----------------------------------------
    // Close SSE connection
    // -----------------------------------------
    if (!res.destroyed) {
      res.end();
    }
  }
};

module.exports = {
  createConversation,
  getConversations,
  getConversation,
  renameConversation,
  deleteConversation,
   sendMessage,
};