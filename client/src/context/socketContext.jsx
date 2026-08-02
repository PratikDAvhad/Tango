import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./authContext";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { user, refreshUser } = useContext(AuthContext);
  const currentUser = user?.user;

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!socket || !currentUser?._id) return;

    const announce = () => {
      socket.emit("setup", currentUser._id);
      socket.emit("user-online", currentUser._id);
    };

    if (socket.connected) announce();

    socket.on("connect", announce);

    return () => socket.off("connect", announce);
  }, [socket, currentUser?._id]);

  // GLOBAL online users listener
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (users) => {
      console.log("Online users:", users);
      setOnlineUsers(users);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleFriendAdded = async () => {
      await refreshUser();
    };

    socket.on("friend-added", handleFriendAdded);

    return () => socket.off("friend-added", handleFriendAdded);
  }, [socket, refreshUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);