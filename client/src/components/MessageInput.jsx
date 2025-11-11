import React, { useState } from "react";
import {api} from "../api/axiosConfig";
import { useSocket } from "../context/socketContext";

export const MessageInput = ({ selectedUser, currentUser, onSentMessage }) => {
  const [text, setText] = useState("");
  const socket = useSocket();

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    const payload = {
      recipient: selectedUser._id,
      content: text.trim(),
    };

    try {
      const { data } = await api.post("/message/send", payload);

      const messageForUI = {
        ...data,
        sender: currentUser._id,
      };

      socket.emit("send-message", {
        sender: currentUser._id,
        recipient: selectedUser._id,
        content: text.trim(),
      });

      onMessageSent(messageForUI);

      setText("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="p-3 border-top" onSubmit={sendMessage}>
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
