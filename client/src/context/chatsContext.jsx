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
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const selectedConversationRef = useRef(null);

  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  const currentUser = user.user;
  console.log(currentUser, " Current user in the chatsContext");

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // handling selection of user in sidebar
  const handleSelectedUser = useCallback(
    async (user) => {
      setSelectedUser(user);

      try {
        const { data: conversation } = await api.post("/conversations", {
          userId: currentUser._id,
          receiverId: user._id,
        });

        setSelectedConversation(conversation);
      } catch (err) {
        console.log(err);
      }
    },
    [currentUser],
  );

  const startChatWithUser = useCallback(
    async (user) => {
      try {
        const { data: conversation } = await api.post("/conversations", {
          userId: currentUser._id,
          receiverId: user._id,
        });
        await fetchConversations();
      } catch (err) {
        console.log(err);
      }
    },
    [conversations],
  );

  const handleSelectedConversation = (convo) => {
    console.log("Selected Conversation in the sidebar : ", convo);
    setSelectedConversation(convo);
    setSelectedUser(convo.participants.find((p) => p._id !== currentUser._id));
  };

  const fetchConversations = async () => {
    try {
      const { data } = await api.get(`/conversations/${currentUser._id}`);
      console.log(data, " Data in the fetch conversations");
      setConversations(data);
    } catch (err) {
      console.log("Error fetching conversation", err);
    }
  };

  useEffect(() => {
    if (!currentUser._id) return;
    fetchConversations();
  }, [currentUser._id]);

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
      console.log("Recieved message in socket io in console : ", message);
      console.log("Selected convertation in ", selectedConversationRef.current);
      if (message.conversation === selectedConversationRef.current?._id) {
        setChatMessages((prev) => [...prev, message]);
      }

      setConversations((prev) =>
        prev.map((convo) =>
          convo._id === message.conversation
            ? {
                ...convo,
                lastMessage: message,
                updatedAt: Date.now(),
              }
            : convo,
        ),
      );
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket]);

  //getOnline Users
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => socket.off("online-users", handleOnlineUsers);
  }, [socket]);

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  //getting chat messages in the chat window
  useEffect(() => {
    if (!selectedConversation) return;
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/message/${selectedConversation._id}`);
        console.log("Messages in the sidebar : ", data);
        setChatMessages(data);
        setTimeout(() => scrollToBottom(), 100);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, [selectedConversation]);

  // for sending the message from the message input
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    const payload = {
      senderId: currentUser._id,
      conversationId: selectedConversation._id,
      content: text.trim(),
    };

    try {
      const { data } = await api.post("/message/send", payload);

      console.log(data, " data of the send message");
      socket.emit("send-message", {
        conversation: selectedConversation._id,
        content: text.trim(),
        sender: currentUser._id,
        recipient: selectedUser._id,
        createdAt: Date.now(),
      });
      setChatMessages([
        ...chatMessages,
        {
          ...data,
          sender: currentUser,
        },
      ]);

      setConversations((prev) =>
        prev.map((convo) =>
          convo._id === selectedConversation._id
            ? {
                ...convo,
                lastMessage: {
                  ...data,
                  sender: currentUser,
                },
                updatedAt: Date.now(),
              }
            : convo,
        ),
      );

      setText("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ChatsContext.Provider
      value={{
        selectedUser,
        selectedConversation,
        conversations,
        chatMessages,
        handleSelectedUser,
        sendMessage,
        fetchConversations,
        setText,
        text,
        endRef,
        handleSelectedConversation,
        allUsers,
        startChatWithUser,
        currentUser,
        isUserOnline,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
