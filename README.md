# Tango 💬

**Tango** is a modern **full-stack real-time chat and social platform** built using the **MERN Stack**. It combines secure messaging, AI-powered conversations, friend management, and Instagram-like Stories with **real-time synchronization using Socket.IO**.

---

## 🚀 Live Demo

🔗 **Frontend:** https://tango-1.onrender.com

---

## ✨ Features

### 🔐 Authentication

* JWT-based authentication
* Secure user registration & login
* Password hashing with **bcrypt**
* Protected API routes

### 💬 Real-Time Chat

* One-to-one private messaging
* Instant message delivery using **Socket.IO**
* Edit & delete messages
* Read receipts (Seen / Unseen messages)
* Online / Offline presence indicator
* Last message preview in sidebar
* Unread message count badges
* Conversation management

### 👥 Friend System

* Send friend requests
* Accept / reject requests
* Real-time friend request notifications
* Friends list management
* Pending requests tracking
* Automatic conversation creation after acceptance

### 📸 Stories

* Upload image & video stories
* 24-hour automatic expiry using **MongoDB TTL Index**
* View friends' stories
* Delete your own stories
* Real-time story synchronization
* Cloudinary-powered media storage

### 🤖 AI Chat

* Integrated **Google Gemini API**
* Dedicated AI conversation window
* Context-aware responses

### 👤 User Profile

* Update profile information
* Change profile picture
* Add bio / about section
* Update location & phone number
* Change password securely

### ☁️ Media Uploads

* **Cloudinary Integration**
* Image uploads
* Video uploads
* Automatic temporary file cleanup
* Optimized media delivery

### 🌐 Deployment

* **Frontend:** Render
* **Backend:** Render
* **Database:** MongoDB Atlas
* **Media Storage:** Cloudinary

---

## 🛠️ Tech Stack

### Frontend

* **React.js**
* **React Router DOM**
* **Context API**
* **Axios**
* **Bootstrap 5**
* **Socket.IO Client**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **Socket.IO**
* **JWT (jsonwebtoken)**
* **bcryptjs**
* **Multer**
* **Cloudinary**

### Database & Services

* **MongoDB Atlas**
* **Cloudinary**
* **Google Gemini API**

---

## 📁 Project Structure

```
Tango/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── socket.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/PratikDAvhad/Tango.git
cd Tango
```

---

## 🔧 Backend Setup

```bash
cd server
npm install
npm run dev
```

Server will run on **http://localhost:5000** (or your configured port).

---

## 🎨 Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will run on **http://localhost:5173**.

---

## 🔑 Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📡 Real-Time Events

Tango uses **Socket.IO** for real-time communication.

### Implemented Events

| Event                     | Description                            |
| ------------------------- | -------------------------------------- |
| `setup`                   | Join user-specific room                |
| `user-online`             | Mark user as online                    |
| `online-users`            | Broadcast online users                 |
| `receive-message`         | Receive new message                    |
| `message-edited`          | Update edited message                  |
| `message-deleted`         | Remove deleted message                 |
| `messages-seen`           | Update read receipts                   |
| `friend-added`            | Refresh conversations after friendship |
| `friend-request-received` | Real-time incoming friend request      |
| `friend-request-declined` | Real-time decline notification         |

---

## 📸 Screenshots

Add your screenshots inside a `screenshots/` folder and update the paths below.

### 🔐 Authentication

```md
![Login](screenshots/login.png)
```

### 💬 Real-Time Chat

```md
![Chat](screenshots/chat.png)
```

### 👥 Friend Requests

```md
![Friend Requests](screenshots/friend-requests.png)
```

### 📸 Stories

```md
![Stories](screenshots/stories.png)
```

### 🤖 AI Chat

```md
![AI Chat](screenshots/ai-chat.png)
```

### 👤 Profile Page

```md
![Profile](screenshots/profile.png)
```

---

## 🧪 API Highlights

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Messages

```http
GET    /api/message/:conversationId
POST   /api/message/send
PUT    /api/message/:messageId
DELETE /api/message/:messageId
PUT    /api/message/seen/:conversationId
```

### Friends

```http
POST /api/friend/send
GET  /api/friend/pending
POST /api/friend/accept
POST /api/friend/decline
```

### Stories

```http
POST   /api/story
GET    /api/story/friends
DELETE /api/story/:storyId
```

---

## 🔮 Future Improvements

* 👨‍👩‍👧‍👦 Group Chats
* 😄 Message Reactions & Emojis
* 🔔 Push Notifications
* ❤️ Story Likes & Replies
* 🔒 End-to-End Encryption
* 📱 Progressive Web App (PWA)
* 🔍 Message Search & Filters

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes

```bash
git commit -m "Add your feature"
```

4. Push to the branch

```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request

---

## 👨‍💻 Author

**Pratik Avhad**

* 🌐 GitHub: https://github.com/PratikDAvhad
* 💼 LinkedIn: https://www.linkedin.com/in/pratik-avhad

---

## ⭐ Support

If you like this project, consider giving it a **⭐ Star** on GitHub — it helps others discover the project and motivates further development! 🚀

---

## 📄 License

This project is licensed under the **MIT License**.
