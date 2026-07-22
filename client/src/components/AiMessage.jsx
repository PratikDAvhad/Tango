import React from "react";

const AiMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`d-flex mb-3 ${
        isUser ? "justify-content-end" : "justify-content-start"
      }`}
    >
      <div
        className={`chat-bubble ${isUser ? "mine" : "theirs"}`}
        style={{
          maxWidth: "75%",
        }}
      >
        {message.content}
      </div>
    </div>
  );
};

export default AiMessage;