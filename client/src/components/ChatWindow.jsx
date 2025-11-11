import React, { useEffect, useState, useRef } from "react";
import { api } from "../api/axiosConfig";
import { useSocket } from "../context/socketContext";

export const ChatWindow = ({ selectedUser, currentUser }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const socket = useSocket();
  const endRef = useRef();

  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/message/${selectedUser}`);
        setChatMessages(data);
        scrollToBottom();
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    const handler = (msg) => {
      if (
        msg.sender === selectedUser?._id ||
        msg.recipient === selectedUser?._id
      ) {
        setChatMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    };

    socket.on("recieve-message", handler);
    return () => socket.off("recieve-message", handler);
  }, [socket, selectedUser]);

  const scrollToBottom = () => {
    endRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!selectedUser) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        Select a contect to start chat
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100">
      <div className="border-bottom p-3">
        <strong>{selectedUser.name}</strong>
      </div>

      <div
        className="flex-grow-1 p-3 overflow-auto"
        style={{ background: "#f7f7f7" }}
      >
        {chatMessages.map((m) => {
          const mine =
            m.sender.toString() === currentUser._id.toString() ||
            m.senderId === currentUser._id; // accommodate both shapes
          return (
            <div
              key={m._id || Math.random()}
              className={`d-flex mb-2 ${
                mine ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  mine ? "bg-primary text-white" : "bg-white border"
                }`}
                style={{ maxWidth: "70%" }}
              >
                {m.content}
                <div
                  className="small text-muted d-block text-end"
                  style={{ fontSize: 10 }}
                >
                  {new Date(
                    m.createdAt || m.timestamp || Date.now()
                  ).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
    </div>
  );
};


