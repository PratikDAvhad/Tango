import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import {Sidebar} from "../components/Sidebar";
import {ChatWindow} from "../components/ChatWindow";
import {MessageInput} from "../components/MessageInput";


export const ChatsPage = () => {
  const stored = JSON.parse(localStorage.getItem("userInfo"));
  
  if(!stored){
    const navigate = useNavigate();
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
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar
        onSelectUser={handleSelectUser}
        selectedUserId={selectedUser?._id}
      />
      <div className="flex-grow-1 d-flex flex-column">
        <ChatWindow selectedUser={selectedUser} currentUser={currentUser} />
        <MessageInput
          selectedUser={selectedUser}
          currentUser={currentUser}
          onMessageSent={handleMessageSent}
        />
      </div>
    </div>
  );
};
