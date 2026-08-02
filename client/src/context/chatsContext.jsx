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
import { GeneralContext } from "./generalContext";

export const ChatsContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [text, setText] = useState("");
  const selectedConversationRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);

  const { socket, onlineUsers  } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const { activePage } = useContext(GeneralContext);

  const currentUser = user.user;
  console.log(currentUser, " Current user in the chatsContext");

  useEffect(() => {
    if (!selectedConversation) return;
    selectedConversationRef.current = selectedConversation;
    const markSeen = async () => {
      try {
        await api.put(`/message/seen/${selectedConversation._id}`);
      } catch (err) {
        console.error(err);
      }
    };

    markSeen();
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

    // RESET UNREAD COUNT
    setConversations((prev) =>
      prev.map((c) => (c._id === convo._id ? { ...c, unreadCount: 0 } : c)),
    );
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
  }, [chatMessages, activePage]);

  useEffect(() => {
    if (!socket) return;

    socket.on("friend-added", async () => {
      console.log("Friend added event received");

      try {
        await fetchConversations();
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("receive-message", async (message) => {
      console.log("Received message:", message);

      const isCurrentConversation =
        message.conversation._id === selectedConversationRef.current?._id;

      if (isCurrentConversation) {
        // Add message to chat window
        setChatMessages((prev) => [...prev, message]);

        // If the message is from another user, mark it as seen immediately
        if (message.sender._id !== currentUser._id) {
          try {
            await api.put(`/message/seen/${message.conversation._id}`);
          } catch (err) {
            console.error("Error marking message as seen:", err);
          }
        }
      }

      // Update sidebar conversations
      setConversations((prev) => {
        const updated = prev.map((convo) => {
          if (convo._id !== message.conversation._id) return convo;

          return {
            ...convo,
            lastMessage: message,
            updatedAt: Date.now(),
            unreadCount:
              message.conversation._id !==
                selectedConversationRef.current?._id &&
              message.sender._id !== currentUser._id
                ? (convo.unreadCount || 0) + 1
                : convo.unreadCount || 0,
          };
        });

        return updated.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        );
      });
    });

    socket.on("message-edited", (updatedMsg) => {
      updatedMsg.edited = true;

      // Update open chat
      setChatMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg)),
      );

      // Update conversation list
      setConversations((prev) =>
        prev.map((convo) =>
          convo._id === updatedMsg.conversation._id
            ? {
                ...convo,
                lastMessage:
                  convo.lastMessage?._id === updatedMsg._id
                    ? updatedMsg
                    : convo.lastMessage,
              }
            : convo,
        ),
      );
    });

    socket.on("message-deleted", ({ messageId, lastMessage }) => {
      setChatMessages((prev) => {
        return prev.filter((msg) => msg._id != messageId);
      });

      setConversations((prev) =>
        prev.map((convo) =>
          convo.lastMessage?._id === messageId
            ? {
                ...convo,
                lastMessage,
              }
            : convo,
        ),
      );
    });

    socket.on("messages-seen", ({ conversationId, userId }) => {
      setChatMessages((prev) =>
        prev.map((msg) => {
          // only update messages from this conversation
          if (msg.conversation._id !== conversationId) return msg;

          // receiver's own messages don't need updating
          if (msg.sender._id === userId) return msg;

          // avoid duplicates
          if (msg.seenBy?.includes(userId)) return msg;

          return {
            ...msg,
            seenBy: [...(msg.seenBy || []), userId],
          };
        }),
      );  
    });

    return () => {
      socket.off("receive-message");
      socket.off("message-edited");
      socket.off("message-deleted");
      socket.off("messages-seen");
      socket.off("friend-added");
    };
  }, [socket]);

  

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
    setSending(true);

    if (!text.trim() && attachments.length === 0) return;

    const formData = new FormData();

    formData.append("senderId", currentUser._id);
    formData.append("conversationId", selectedConversation._id);
    formData.append("content", text);

    attachments.forEach((file) => {
      formData.append("files", file.file);
    });

    try {
      const { data } = await api.post("/message/send", formData);

      console.log(" data of the send message ", data);
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
      setAttachments([]);
      setText("");
      setSending(false);
    } catch (err) {
      console.log(err);
    }
  };

  // Edit handler
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const handleEdit = async (message) => {
    setEditingMessageId(message._id);
    setEditedText(message.content);
  };

  const saveEditedMessage = async (messageId) => {
    console.error("Message id not reached: ", messageId);
    const { data } = await api.put(`/message/${messageId}`, {
      content: editedText,
    });

    //check for data while editing msg
    console.error("Data in edited", data);

    setEditingMessageId(null);
  };

  //message delete handler
  const handleDelete = async (mId) => {
    try {
      const { message } = await api.delete(`message/${mId}`);
      console.log("Message deleted successfully : " + message);
      setChatMessages((prev) => {
        return prev.filter((msg) => msg._id != mId);
      });
    } catch (e) {
      console.error(e);
    }
  };

  // message reaction handler
  const handleReaction = async (message) => {
    console.log(message);
  };

  // handling attachments
  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);

    const newAttachments = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);

    e.target.value = "";
  };

  //removing attachments
  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((file) => file.id !== id));
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
        onlineUsers,
        handleEdit,
        editingMessageId,
        setEditedText,
        editedText,
        setEditingMessageId,
        saveEditedMessage,
        handleDelete,
        attachments,
        setAttachments,
        handleAttachmentChange,
        removeAttachment,
        sending,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
