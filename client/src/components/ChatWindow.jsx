import React, { useEffect, useState, useRef, useContext } from "react";
import { api } from "../api/axiosConfig";
import { useSocket } from "../context/socketContext";
import { AuthContext } from "../context/authContext";
import { ChatsContext } from "../context/chatsContext";

export const ChatWindow = () => {
  const { user } = useContext(AuthContext);
  const currentUser = user.user;
  const { selectedUser, endRef, chatMessages } = useContext(ChatsContext);

  console.log("Chat Messages ", chatMessages);

  if (!selectedUser) {
    return (
      <div className="chat-empty d-flex align-items-center justify-content-center flex-grow-1">
        Select a contect to start chat
      </div>
    );
  }

  return (
    <div className="chat-window d-flex flex-column flex-grow-1">
      <div className="chat-header border-bottom px-3 py-2">
        <strong>{selectedUser.name}</strong>
      </div>

      <div
        className="chat-messages flex-grow-1 overflow-auto px-3 py-2"
      >
        {chatMessages.map((m, index) => {
          const mine =
            m.sender.toString() === currentUser._id.toString() ||
            m.senderId === currentUser._id; // accommodate both shapes
          return (
            <div
              key={index}
              className={`d-flex mb-2 ${
                mine ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`chat-bubble ${
                  mine ? "mine" : "theirs"
                }`}
                style={{ maxWidth: "70%" }}
              >
                {m.content}
                <div
                  className="chat-time"
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
