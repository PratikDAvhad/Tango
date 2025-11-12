import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <socketContext.Provider value={socket}>
      {children}
    </socketContext.Provider>
  );
};

export const useSocket = () => useContext(socketContext);
