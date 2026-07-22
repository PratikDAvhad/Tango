import React from "react";
import AiMessage from "./AiMessage";
import { useContext } from "react";
import { AiContext } from "../context/AiContext";

const dummyMessages = [
  {
    role: "assistant",
    content: "Hello 👋 I'm Tango AI.",
  },
  {
    role: "user",
    content: "Hi!",
  },
  {
    role: "assistant",
    content: "How can I help you today?",
  },
];

const AiChatWindow = () => {
  const { messages, endRef } = useContext(AiContext);
  return (
    <div
      className="flex-grow-1 overflow-auto px-4 py-3"
      style={{
        background: "#efeae2",
      }}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`d-flex mb-3 ${
            message.role === "user"
              ? "justify-content-end"
              : "justify-content-start"
          }`}
        >
          <div
            className={`p-3 rounded shadow-sm ${
              message.role === "user" ? "bg-success text-white" : "bg-light"
            }`}
            style={{
              maxWidth: "70%",
            }}
          >
            {/* Text */}

            {message.content && <p className="mb-2">{message.content}</p>}

            {/* Attachments */}

            {message.attachments?.length > 0 && (
              <div className="d-flex flex-wrap gap-2">
                {message.attachments.map((file) => (
                  <div key={file.id}>
                    {/* Image */}

                    {file.type.startsWith("image/") ? (
                      <img
                        src={file.preview || file.url}
                        alt={file.name}
                        width={150}
                        className="rounded border"
                      />
                    ) : (
                      <div
                        className="border rounded p-2 bg-white text-dark"
                        style={{
                          minWidth: 160,
                        }}
                      >
                        📄 {file.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <div ref={endRef}></div>
    </div>
  );
};

export default AiChatWindow;
