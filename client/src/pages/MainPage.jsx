import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";
import { MessageInput } from "../components/MessageInput";
import { MenuBar } from "../components/MenuBar";
import { setAuthToken } from "../api/axiosConfig";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { ChatContextProvider } from "../context/chatsContext";
import MainContent from "../components/MainContent";
import { Route, Routes, Navigate } from "react-router-dom";
import { ChatsPage } from "./ChatsPage";
import StoriesPage from "./StoriesPage";
import AiPage from "./AiPage";
import SettingsPage from "./SettingsPage";
import ProfilePage from "./ProfilePage";
import ProfilePageContextProvider from "../context/ProfileContext";
import { StoryContextProvider } from "../context/storyContext";
export const MainPage = () => {
  const { user } = useContext(AuthContext);
  console.log(user.token);
  setAuthToken(user.token);

  return (
    <div>
      {/* <div>
        <MenuBar />
        <ChatContextProvider>
          <ChatsPage />
        </ChatContextProvider>
      </div> */}

      <div className="main-layout">
        <MenuBar />

        <div className="content-area">
          <Routes>
            <Route
              path="/chats"
              element={
                <ChatContextProvider>
                  <ChatsPage />
                </ChatContextProvider>
              }
            />

            <Route
              path="/stories"
              element={
                <StoryContextProvider>
                  <StoriesPage />
                </StoryContextProvider>
              }
            />

            <Route path="/ai" element={<AiPage />} />

            <Route
              path="/profile"
              element={
                <ProfilePageContextProvider>
                  <ProfilePage />{" "}
                </ProfilePageContextProvider>
              }
            />

            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};
