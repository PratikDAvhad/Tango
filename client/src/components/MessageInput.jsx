import React, { useContext, useState } from "react";
import { api } from "../api/axiosConfig";
import { useSocket } from "../context/socketContext";
import { ChatsContext } from "../context/chatsContext";

export const MessageInput = () => {
  const {
    sendMessage,
    setText,
    selectedUser,
    text,
    attachments,
    handleAttachmentChange,
    removeAttachment,
    sending,
  } = useContext(ChatsContext);
  return (
    <form
      className="chat-input border-top"
      onSubmit={sendMessage}
      aria-disabled={sending}
    >
      {/* Attachment Preview */}
      {attachments?.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-2">
          {attachments.map((item) => (
            <div
              key={item.id}
              className="position-relative border rounded p-2 bg-white"
            >
              {item.type.startsWith("image/") ? (
                <img
                  src={item.preview}
                  alt={item.name}
                  width={90}
                  height={90}
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : item.type.startsWith("video/") ? (
                <div
                  style={{
                    width: 90,
                    height: 90,
                  }}
                  className="d-flex align-items-center justify-content-center bg-light rounded"
                >
                  🎥
                </div>
              ) : item.type.startsWith("audio/") ? (
                <div
                  style={{
                    width: 90,
                    height: 90,
                  }}
                  className="d-flex align-items-center justify-content-center bg-light rounded"
                >
                  🎵
                </div>
              ) : (
                <div
                  style={{
                    width: 90,
                    height: 90,
                  }}
                  className="d-flex align-items-center justify-content-center bg-light rounded"
                >
                  📄
                </div>
              )}

              <small
                className="d-block text-truncate mt-1"
                style={{ width: 90 }}
              >
                {item.name}
              </small>

              <button
                type="button"
                className="btn-close position-absolute top-0 end-0"
                onClick={() => removeAttachment(item.id)}
                disabled={sending}
              />
            </div>
          ))}
        </div>
      )}
      <div className="input-group">
        <input
          id="chat-files"
          hidden
          multiple
          type="file"
          onChange={handleAttachmentChange}
          disabled={sending}
        />

        <label htmlFor="chat-files" className="btn btn-light">
          📎
        </label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="form-control"
          placeholder={`Message ${selectedUser?.name || ""}`}
          disabled={sending}
        />
        <button className="btn btn-primary" type="submit" disabled={sending}>
          Send
        </button>
      </div>
    </form>
  );
};
