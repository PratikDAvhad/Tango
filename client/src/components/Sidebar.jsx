import { useContext, useState } from "react";
import "../App.css";
import { ChatsContext } from "../context/chatsContext";

export const Sidebar = () => {
  const {
    conversations,
    handleSelectedConversation,
    currentUser,
    allUsers,
    startChatWithUser,
    isUserOnline,
  } = useContext(ChatsContext);

  console.log("All the conversations : ", conversations);
  const [showUsersList, setShowUsersList] = useState(false);
  console.log("Current user in the sidebar ", currentUser);

  const openUserList = () => {
    setShowUsersList(true);
  };

  const closeUserList = () => {
    setShowUsersList(false);
  };
  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="d-flex flex-column border-end"
      style={{
        position: "relative",
        height: "100%",
        width: "300px",
        marginLeft: "50px",
      }}
    >
      {/* Header */}
      <div
        className="p-3 border-bottom bg-white shadow-sm"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 2,
        }}
      >
        <div className="d-flex">
          <h5 className="mb-2 fw-semibold text-primary">Chats</h5>
        </div>
      </div>

      {/* Chat list */}
      <ul
        className="list-group list-group-flush flex-grow-1"
        style={{
          height: "85vh",
          overflowY: "auto",
          backgroundColor: "#fdfdfd",
        }}
      >
        {conversations.map((convo) => {
          const other = convo.participants.find(
            (p) => p._id !== currentUser._id,
          );
          console.log(other);
          return (
            <li
              key={convo._id}
              className="chat-item"
              onClick={() => handleSelectedConversation(convo)}
            >
              <div className="d-flex justify-content-between align-items-center px-3">
                <span className="chat-name">{other?.name}</span>

                {isUserOnline(other._id) && <span className="online-dot" />}
              </div>
              <div className="d-flex px-3 justify-content-between">
                <span className="chat-message">
                  {convo.lastMessage
                    ? convo.lastMessage.content
                    : "No messages yet"}
                </span>
                <span className="chat-date">
                  {convo.lastMessage
                    ? formatTime(convo.lastMessage.createdAt)
                    : ""}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
