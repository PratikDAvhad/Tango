import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatsPage from './pages/ChatsPage';
import {setAuthToken} from "./api/axiosConfig";
import {useSocket} from "./context/socketContext";
import { useEffect } from 'react';

function App() {
  const socket = useSocket();

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    console.log(stored);
    if(stored){
      const parsed = JSON.parse(stored);
      console.log("parsed " , parsed);
      setAuthToken(parsed.token);

    }
  },[]) 

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (socket && stored?.user?._id) {
      socket.emit("setup", stored.user._id);
      socket.on("connected", () => console.log("✅ Socket connected to server"));
    }

    // cleanup
    return () => {
      if (socket) socket.off("connected");
    };
  }, [socket]);

  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/register' element={<RegisterPage/>} />
      <Route path='/chats' element={<ChatsPage/>} />
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
