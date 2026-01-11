import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";
import { MessageInput } from "../components/MessageInput";
import { MenuBar } from "../components/MenuBar";
import { ChatsPage } from "./ChatsPage";
import { setAuthToken } from "../api/axiosConfig";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { ChatContextProvider } from "../context/chatsContext";

export const MainPage = () => {
  const { user } = useContext(AuthContext);
  console.log(user.token);
  setAuthToken(user.token);

  return (
    <div>
      <div>
        <MenuBar />
        <ChatContextProvider>
          <ChatsPage />
        </ChatContextProvider>
      </div>
    </div>
  );
};
