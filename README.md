# 💬 Tango

Tango is a full-stack real-time web application built with a modern JavaScript stack.  
It consists of a separate **client** (frontend) and **server** (backend) architecture.

This project demonstrates authentication, API integration, real-time communication, and clean UI structure.

---

## 🚀 Features

- 🔐 User Authentication
- 👥 User Interaction / Social Features
- 💬 Real-Time Communication
- 📡 REST API Integration
- 🗂 Modular Client–Server Architecture
- ⚡ Responsive UI

---

## 🏗 Project Structure

```
Tango/
│
├── client/        # Frontend (React / Vite / etc.)
├── server/        # Backend (Node.js / Express / etc.)
├── package.json
└── README.md
```

---

## 🛠 Tech Stack

### Frontend (client)
- JavaScript
- React 
- HTML5 / CSS3
- Axios / Fetch API

### Backend (server)
- Node.js
- Express.js
- MongoDB
- JWT Authentication 
- Socket.io 

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/PratikDAvhad/Tango.git
cd Tango
```

---

## 🔹 Backend Setup

```bash
cd server
npm install
npm run dev
```

If you are using environment variables, create a `.env` file inside `server/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 🔹 Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will usually run on:

```
http://localhost:5173
```

The backend will usually run on:

```
http://localhost:5000
```

---

## 🌐 API Integration

The frontend communicates with the backend using REST APIs.

Example:

```javascript
axios.post("/api/login", data)
```

Make sure the backend server is running before starting the client.

---

## 📦 Available Scripts

### Server
```bash
npm run dev     # Start development server
npm start       # Start production server
```

### Client
```bash
npm run dev     # Start development build
npm run build   # Production build
```

---

## 📌 Learning Outcomes

This project helped in understanding:

- Full-stack architecture
- API design & integration
- Authentication flow
- State management
- Real-time communication
- Deployment concepts

---

## 🚀 Future Improvements

- Add notifications system
- Improve UI animations
- Add message read receipts
- Add profile customization
- Deploy with Docker
- CI/CD integration

---

## 👨‍💻 Author

**Pratik D Avhad**

If you like this project, consider giving it a ⭐ on GitHub!

---
