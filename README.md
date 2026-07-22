# Tango 💬

A full-stack real-time chat and social platform built using the MERN Stack. Tango enables secure messaging, AI-powered conversations, friend management, and Instagram-like Stories with real-time synchronization using Socket.IO.

---

## 🚀 Live Demo

[ https://tango-1.onrender.com ]

---

## Features

### Authentication
- JWT Authentication
- Secure Login & Registration
- Password Encryption using bcrypt
- Protected Routes

### Real-Time Chat
- One-to-One Messaging
- Real-Time Message Delivery
- Edit/Delete Messages
- Online/Offline Status
- Last Message Preview
- Conversation Management

### Friend System
- Send Friend Requests
- Accept / Reject Requests
- Friends List
- Pending Requests
- Real-Time Friend Updates

### Stories
- Upload Image & Video Stories
- 24-Hour Auto Expiry (MongoDB TTL Index)
- Story Viewer
- Delete Own Stories
- Real-Time Story Updates
- Cloudinary Media Storage

### AI Chat
- Integrated Google Gemini API
- Dedicated AI Chat Window
- Persistent AI Conversations

### User Profile
- Update Profile Information
- Change Profile Picture
- About Section
- Location & Phone Number
- Change Password

### Media Upload
- Cloudinary Integration
- Image Upload
- Video Upload
- Automatic File Cleanup

### Deployment
- Frontend hosted on Render
- Backend hosted on Render
- MongoDB Atlas Database

---

## Tech Stack

### Frontend
- React
- React Router
- Context API
- Axios
- Bootstrap
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- bcrypt
- Multer
- Cloudinary

### Database
- MongoDB Atlas

### AI
- Google Gemini API

---

## Folder Structure

```
client/
    src/
        components/
        context/
        pages/
        api/

server/
    controllers/
    middleware/
    models/
    routes/
    utils/
    socket.js
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/PratikDAvhad/Tango.git
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Environment Variables

### Backend (.env)

```env
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=
```

### Frontend (.env)

```env
VITE_API_URL=
VITE_SOCKET_URL=
```

---

## Screenshots

- Authentication
- Real-Time Chat
- Friend Requests
- Stories
- AI Chat
- Profile Page

(Add screenshots here)

---

## Future Improvements

- Group Chats
- Message Reactions
- Voice & Video Calling
- Read Receipts
- Push Notifications
- Story Likes & Replies
- End-to-End Encryption

---

## Author

**Pratik Avhad**

GitHub: https://github.com/PratikDAvhad

---
