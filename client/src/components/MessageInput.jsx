import React, { useContext, useState } from "react";
import { api } from "../api/axiosConfig";
import { useSocket } from "../context/socketContext";
import { ChatsContext } from "../context/chatsContext";

export const MessageInput = () => {
  const { sendMessage, setText, selectedUser,text } = useContext(ChatsContext);
  return (
    <form className="chat-input border-top" onSubmit={sendMessage}>
      <div className="input-group">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="form-control"
          placeholder={`Message ${selectedUser?.name || ""}`}
        />
        <button className="btn btn-primary" type="submit">
          Send
        </button>
      </div>
    </form>
  );
};
