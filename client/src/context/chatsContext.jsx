import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SocketContext } from "./socketContext";
import { api } from "../api/axiosConfig";
import { AuthContext } from "./authContext";

export const ChatsContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [text, setText] = useState("");

  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const currentUser = user.user;

  // handling selection of user in sidebar
  const handleSelectedUser = useCallback((user) => {
    console.log(user);
    setSelectedUser(user);
  }, []);

  //fetching all users in the sidebar
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/user/all");
        console.log("data in the sidebar ", data);
        setAllUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  //handling the going smoothly down effect in the chat
  const endRef = useRef();

  useLayoutEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", (message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket]);

  //getting chat messages in the chat window
  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/message/${selectedUser._id}`);
        setChatMessages(data);
        setTimeout(() => scrollToBottom(), 100);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // for sending the message from the message input
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    const payload = {
      recipient: selectedUser._id,
      content: text.trim(),
    };

    try {
      const { data } = await api.post("/message/send", payload);

      socket.emit("send-message", {
        recipient: selectedUser._id,
        content: text.trim(),
        sender: currentUser._id,
      });
      setChatMessages([
        ...chatMessages,
        {
          ...data,
          sender: currentUser._id,
        },
      ]);

      setText("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ChatsContext.Provider
      value={{
        selectedUser,
        handleSelectedUser,
        allUsers,
        chatMessages,
        sendMessage,
        setText,
        text,
        endRef
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
