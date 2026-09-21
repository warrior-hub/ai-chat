const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chat.routes");

dotenv.config();

const app = express();

// Database
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Chat Backend is running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});