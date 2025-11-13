import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";
import { MessageInput } from "../components/MessageInput";

export const ChatsPage = () => {
  const stored = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  if (!stored) {
    navigate("/login");
  }
  const currentUser = stored?.user;

  const [selectedUser, setSelectedUser] = useState(null);
  const [localMessages, setLocalMessages] = useState([]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setLocalMessages([]);
  };

  const handleMessageSent = (msg) => {
    setLocalMessages((prev) => [...prev, msg]);
  };

  return (
    <div
      className="d-flex"
      style={{
        height: "100vh",
        overflow: "hidden", // prevent the whole page from scrolling
      }}
    >
      <div style={{ width: "300px",}}>
        <Sidebar
          onSelectUser={handleSelectUser}
          selectedUserId={selectedUser?._id}
        />
      </div>
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto", // only this area scrolls
          }}
        >
          <ChatWindow
            selectedUser={selectedUser}
            currentUser={currentUser}
            localMessages={localMessages}
          />
        </div>
        <div
          style={{
            borderTop: "1px solid #ccc",
            backgroundColor: "white",
          }}
        >
          <MessageInput
            selectedUser={selectedUser}
            currentUser={currentUser}
            handleMessageSent={handleMessageSent}
          />
        </div>
      </div>
    </div>
  );
};
