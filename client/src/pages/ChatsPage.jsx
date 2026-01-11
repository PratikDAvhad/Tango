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
      className="d-flex"
      style={{
        height:"95vh",
        overflow:"hidden"
      }}
    >
      <div>
        <Sidebar />
      </div>
      <div className="d-flex flex-column w-100 h-80">
        <ChatWindow />

        {selectedUser && <MessageInput />}
      </div>
    </div>
  );
};
