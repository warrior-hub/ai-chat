# 🤖 AI Chat App

A modern full-stack AI chat application built with the **MERN Stack** and **Google Gemini API**.

The application provides secure authentication, multiple conversations, persistent chat history, real-time AI response streaming, Markdown rendering, code formatting, chat renaming, and chat deletion.

## 🚀 Live Demo

**Frontend:**
https://ai-chat-five-nu.vercel.app/

**Backend:**
https://ai-chat-1pgv.onrender.com
---

## ✨ Features

### 🔐 Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes
* Password hashing with bcrypt
* Persistent login using JWT

### 💬 AI Chat

* Chat with AI using Google Gemini API
* Real-time streaming AI responses
* Conversation history
* Multiple conversations
* Automatically creates a conversation when sending the first message
* Persistent messages stored in MongoDB

### 📝 Markdown & Code

* Markdown response rendering
* GitHub Flavored Markdown
* Headings
* Lists
* Tables
* Links
* Inline code
* Formatted code blocks
* Programming language labels

### 🗂️ Conversation Management

* Create new conversations
* Automatically generate chat title from the first message
* Rename conversations
* Delete conversations
* Open previous conversations
* Automatically refresh conversation list

### 🎨 UI

* Modern dark UI
* Responsive layout
* Chat sidebar
* Auto-scrolling messages
* AI typing indicator
* Streaming cursor
* Auto-resizing message input
* Enter to send
* Shift + Enter for new line
* Character counter

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* Lucide React
* React Markdown
* Remark GFM

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Server-Sent Events (SSE)

### AI

* Google Gemini API

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

## 📁 Project Structure

```text
ai-chat/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── chat.controller.js
│   │
│   ├── middleware/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Conversation.js
│   │   └── Message.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── chat.routes.js
│   │
│   ├── services/
│   │   └── gemini.service.js
│   │
│   ├── utils/
│   │   └── generateToken.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   ├── common/
│   │   │   └── sidebar/
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ChatContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Chat.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── chat.service.js
│   │   │
│   │   ├── utils/
│   │   │   └── constants.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/warrior-hub/ai-chat.git
```

Go into the project:

```bash
cd ai-chat
```

---

# 🔧 Backend Setup

Go to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

# 🎨 Frontend Setup

Open another terminal.

Go to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

## Backend

| Variable         | Description                        |
| ---------------- | ---------------------------------- |
| `PORT`           | Backend server port                |
| `MONGO_URI`      | MongoDB connection string          |
| `JWT_SECRET`     | Secret key used to sign JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key              |
| `CLIENT_URL`     | Frontend URL used for CORS         |

Example:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-chat
JWT_SECRET=your_secure_secret
GEMINI_API_KEY=your_api_key
CLIENT_URL=http://localhost:5173
```

> Never commit your `.env` file or API keys to GitHub.

---

# 🔌 API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

Request:

```json
{
  "name": "Prince Yadav",
  "email": "user@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
```

### Get Current User

```http
GET /api/auth/me
```

Requires:

```http
Authorization: Bearer <token>
```

---

## 💬 Conversations

### Create Conversation

```http
POST /api/chats
```

### Get Conversations

```http
GET /api/chats
```

### Get Single Conversation

```http
GET /api/chats/:id
```

### Rename Conversation

```http
PATCH /api/chats/:id
```

Request:

```json
{
  "title": "React Learning"
}
```

### Delete Conversation

```http
DELETE /api/chats/:id
```

### Send Message

```http
POST /api/chats/:id/messages
```

Request:

```json
{
  "content": "Explain React hooks"
}
```

The endpoint streams AI responses using **Server-Sent Events (SSE)**.

---

# ⚡ AI Streaming Flow

The application uses Server-Sent Events to stream the AI response.

```text
User
  │
  │ Send Message
  ▼
React Frontend
  │
  │ POST /api/chats/:id/messages
  ▼
Express Backend
  │
  ├── Validate JWT
  ├── Save User Message
  ├── Get Conversation History
  │
  ▼
Google Gemini API
  │
  │ Streaming Response
  ▼
Express SSE
  │
  │ AI Chunks
  ▼
React Frontend
  │
  ▼
Live AI Response
```

---

# 🗄️ Database Models

## User

Stores:

```text
name
email
password
createdAt
updatedAt
```

## Conversation

Stores:

```text
user
title
createdAt
updatedAt
```

## Message

Stores:

```text
conversation
role
content
createdAt
updatedAt
```

---

# 🔐 Security

The application implements:

* JWT authentication
* Password hashing with bcrypt
* Protected API routes
* User-specific conversations
* CORS configuration
* Environment variables for secrets
* API keys kept on the backend
* Request validation
* Message length limits

---

# 🚀 Deployment

## Frontend

The frontend can be deployed using:

```text
Vercel
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

## Backend

The backend can be deployed using:

```text
Render
```

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Root directory:

```text
backend
```

## Database

Production database:

```text
MongoDB Atlas
```

---

# 📸 Screenshots

Add screenshots of the application here:

```text
screenshots/
├── login.png
├── register.png
├── chat.png
└── conversations.png
```

Example:

```markdown
![Login](screenshots/login.png)

![Chat](screenshots/chat.png)
```

---

# 📌 Future Improvements

Possible improvements:

* Google OAuth
* Dark/light theme
* Copy code button
* Code syntax highlighting
* Regenerate AI response
* Edit and resend message
* Stop generating button
* Chat search
* Conversation folders
* File uploads
* Image understanding
* Voice input
* AI response export
* Usage tracking
* Admin dashboard

---

# 👨‍💻 Author

**Prince Yadav**

MERN Stack Developer | Full Stack Developer

GitHub:
https://github.com/warrior-hub

LinkedIn:
https://www.linkedin.com/in/prince-yadav-9b4060305/

---

# 📄 License

This project is created for learning, portfolio, and demonstration purposes.
