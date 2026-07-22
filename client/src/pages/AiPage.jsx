import React from "react";
import AiChatWindow from "../components/AiChatWindow";
import AiMessageInput from "../components/AiMessageInput";
import { AiContextProvider } from "../context/AiContext";

const AiPage = () => {
  return (
    <AiContextProvider>
      <div
        className="d-flex flex-column"
        style={{
          height: "100%",
        }}
      >
        {/* Header */}

        <div
          className="border-bottom px-4 py-3 bg-white"
          style={{
            fontWeight: "600",
            fontSize: "20px",
          }}
        >
          🤖 Tango AI
        </div>

        {/* Messages */}

        <AiChatWindow />

        {/* Input */}

        <AiMessageInput />
      </div>
    </AiContextProvider>
  );
};

export default AiPage;
