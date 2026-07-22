import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./authContext";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, refreshUser } = useContext(AuthContext); // 👈 get user
  const currentUser = user?.user;
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL);
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

  useEffect(() => {
    if (!socket) return;

    const handleFriendAdded = async () => {
      console.log("Friend added event received");
      await refreshUser();
    };

    socket.on("friend-added", handleFriendAdded);

    return () => {
      socket.off("friend-added", handleFriendAdded);
    };
  }, [socket, refreshUser]);

  // 2️ Emit online status when user is ready
  useEffect(() => {
    if (!socket || !currentUser?._id) return;

    socket.emit("user-online", currentUser._id);
    console.log("User online emitted:", currentUser._id);
  }, [socket, currentUser?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
