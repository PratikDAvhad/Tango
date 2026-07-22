import {
  createContext,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { api } from "../api/axiosConfig";

export const AiContext = createContext();

export const AiContextProvider = ({ children }) => {
  // all messages
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello 👋 I'm Tango AI. How can I help you today?",
    },
  ]);

  //current input
  const [text, setText] = useState("");

  // loading state
  const [loading, setLoading] = useState(false);

  //for attachments
  const [attachments, setAttachments] = useState([]);

  // scroll to bottom
  const endRef = useRef(null);

  useLayoutEffect(() => {
    endRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  // temporary send function
  const sendMessage = async (e) => {
    e.preventDefault();
    const userText = text.trim();

    if (!userText && attachments.length === 0) return;

    // Create user message
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userText,
      attachments: attachments,
      createdAt: Date.now(),
    };

    // Remove initial greeting once user starts chatting
    const updatedMessages = [
      ...messages.filter(
        (m) =>
          !(
            m.role === "assistant" &&
            m.content === "Hello 👋 I'm Tango AI. How can I help you today?"
          ),
      ),
      userMessage,
    ];
    // add users msg
    setMessages(updatedMessages);

    //clear textbox
    setText("");
    setAttachments([]);

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("text", userText);

      // send only last few messages as context
      // Previous messages (last 6)
      formData.append(
        "history",
        JSON.stringify(
          updatedMessages.slice(-6).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        ),
      );

      attachments.forEach((item) => {
        formData.append("files", item.file);
      });

      const { data } = await api.post("ai/chat", formData);

      const aiMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
        attachments: [],
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, something went wrong.",
          attachments: [],
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // clear chat
  const clearChat = useCallback(() => {
    setMessages([
      {
        role: "assistant",
        content: "Hello 👋 I'm Tango AI. How can I help you today?",
      },
    ]);
  }, []);

  //handle attachments
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

    console.log("New Attachments:", newAttachments);

    setAttachments((prev) => [...prev, ...newAttachments]);

    e.target.value = "";
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <AiContext.Provider
      value={{
        messages,
        setMessages,

        text,
        setText,

        loading,
        setLoading,

        sendMessage,

        clearChat,

        endRef,

        attachments,
        setAttachments,
        handleAttachmentChange,
        removeAttachment,
      }}
    >
      {children}
    </AiContext.Provider>
  );
};
