import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { ChatsContext } from "../context/chatsContext";

export const ChatWindow = () => {
  const { user } = useContext(AuthContext);
  const currentUser = user.user;
  const { selectedUser, endRef, chatMessages, isUserOnline } =
    useContext(ChatsContext);

  if (!selectedUser) {
    return (
      <div className="chat-empty d-flex align-items-center justify-content-center flex-grow-1">
        Select a contact to start chat
      </div>
    );
  }
  console.log(chatMessages, "Chat Messages in the chatWindow");
  console.log("Current user in the chatWindow ", currentUser);
  return (
    <div className="chat-window d-flex flex-column flex-grow-1">
      {/* HEADER */}
      <div className="chat-header border-bottom px-3 py-2 d-flex justify-content-between">
        <strong>{selectedUser.name}</strong>
        <h6>{isUserOnline(selectedUser?._id) ? "Online" : "Offline"}</h6>
      </div>

      {/* MESSAGES */}
      <div className="chat-messages flex-grow-1 overflow-auto px-3 py-2">
        {chatMessages.map((m, index) => {
          const isMine = m.sender?._id === currentUser._id;

          return (
            <div
              key={m._id || index}
              className={`d-flex mb-2 ${
                isMine ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`chat-bubble ${isMine ? "mine" : "theirs"}`}
                style={{ maxWidth: "70%" }}
              >
                <div>{m.content}</div>

                <div
                  className="chat-time text-muted"
                  style={{ fontSize: "10px" }}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
