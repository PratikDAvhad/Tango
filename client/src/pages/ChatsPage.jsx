import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";
import { MessageInput } from "../components/MessageInput";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { ChatsContext } from "../context/chatsContext";

export const ChatsPage = () => {
  const userInfo = useContext(AuthContext);
  const user = userInfo.user.user;

  const { selectedUser } = useContext(ChatsContext);
  return (
    <div
      className="chat-layout"
    >
      <Sidebar />

      <div
        className="chat-section"
      >
        <ChatWindow />

        {selectedUser && <MessageInput />}
      </div>
    </div>
  );
};
