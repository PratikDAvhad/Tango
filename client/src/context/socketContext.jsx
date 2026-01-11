import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./authContext";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext); // 👈 get user
  const currentUser = user?.user;
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected", newSocket.id);
      if (currentUser?._id) {
        newSocket.emit("setup", currentUser._id);
        console.log("Setup emitted for user:", currentUser._id);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
