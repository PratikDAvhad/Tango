import { useContext, useEffect, useState } from "react";
import "../App.css";
import { ChatsContext } from "../context/chatsContext";

export const Sidebar = () => {
  const { allUsers, handleSelectedUser } = useContext(ChatsContext);

  return (
    <div
      className="d-flex flex-column border-end "
      style={{ height: "100%", width: "300px", marginLeft: "50px" }}
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
          <h5 className="mb-2 fw-semibold text-primary">Contacts</h5>
        </div>
      </div>

      {/* Contacts list */}
      <ul
        className="list-group list-group-flush flex-grow-1"
        style={{
          height: "85vh",
          overflowY: "auto",
          backgroundColor: "#fdfdfd",
        }}
      >
        {allUsers.map((u, index) => {
          return (
            <li
              key={index}
              className="chat-item"
              onClick={() => handleSelectedUser(u)}
            >
              <div className="d-flex justify-content-between align-items-center px-3">
                <span className="chat-name">{u.name}</span>
                <span className="chat-date">{"date"}</span>
              </div>
              <div className="d-flex px-3">
                <span className="chat-message">{"Latest Message"}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
