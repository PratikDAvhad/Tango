import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ChatsPage } from "./pages/ChatsPage";
import { setAuthToken } from "./api/axiosConfig";
import { useSocket } from "./context/socketContext";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function App() {
  const socket = useSocket();
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userInfo"));
    const token = stored?.token;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem("userInfo");
          setAuthToken(null);
          navigate("/login");
        } else {
          setAuthToken(token);

          // wait for the token set
          setIsReady(true);
        }
      } catch (err) {
        console.log("Error in auth in app ", err);
        localStorage.removeItem("userInfo");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (socket && stored?.user?._id) {
      socket.emit("setup", stored.user._id);
      socket.on("connected", () =>
        console.log("✅ Socket connected to server")
      );
    }

    // cleanup
    return () => {
      if (socket) socket.off("connected");
    };
  }, [socket]);

  
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chats" element={<ChatsPage />} />
      </Routes>
    </>
  );
}

export default App;
