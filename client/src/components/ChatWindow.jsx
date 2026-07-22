import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { ChatsContext } from "../context/chatsContext";

export const ChatWindow = () => {
  const { user } = useContext(AuthContext);
  const currentUser = user.user;
  console.log(" in the chatWindow ", currentUser);
  const {
    selectedUser,
    endRef,
    chatMessages,
    isUserOnline,
    handleEdit,
    editingMessageId,
    setEditedText,
    editedText,
    setEditingMessageId,
    saveEditedMessage,
    handleDelete,
  } = useContext(ChatsContext);

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
    <div className="chat-window">
      {/* HEADER */}
      <div className="chat-header border-bottom px-3 py-2 d-flex justify-content-between">
        <strong>{selectedUser.name}</strong>
        <h6>{isUserOnline(selectedUser?._id) ? "Online" : "Offline"}</h6>
      </div>

      {/* MESSAGES */}
      <div className="chat-messages flex-grow-1 overflow-auto px-3 py-2">
        {chatMessages.map((m, index) => {
          const isMine = m.sender._id === currentUser._id;

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
                {editingMessageId === m._id ? (
                  <>
                    <input
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-100 bg-transparent border-0 text-white p-0 m-0 shadow-none"
                      autoFocus
                    />

                    <div className="mt-1 d-flex gap-2">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => saveEditedMessage(m._id)}
                      >
                        Save
                      </button>

                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditingMessageId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    {m.content && <div className="mb-2">{m.content}</div>}

                    {m.attachments?.length > 0 && (
                      <div className="d-flex flex-wrap gap-2">
                        {m.attachments?.map((file) => (
                          <div key={file.url}>
                            {file?.mimeType?.startsWith("image/") ? (
                              <img
                                src={file.preview || file.url}
                                alt={file.name}
                                width={150}
                                className="rounded border"
                              />
                            ) : (
                              <a
                                href={file?.url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-light btn-sm"
                              >
                                📄 {file?.fileName}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div
                  className="chat-time text-muted"
                  style={{ fontSize: "10px" }}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <div className="message-actions">
                  <button onClick={() => handleReaction(m)}>😊</button>

                  {isMine && (
                    <>
                      <button onClick={() => handleEdit(m)}>✏️</button>
                      <button onClick={() => handleDelete(m._id)}>🗑️</button>
                    </>
                  )}
                </div>

                {m.edited && (
                  <small className="d-block text-end fst-italic opacity-75">
                    (edited)
                  </small>
                )}
              </div>
            </div>
          );
        })}

        <div ref={endRef} />
      </div>
    </div>
  );
};
