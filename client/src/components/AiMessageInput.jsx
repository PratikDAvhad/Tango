import React from "react";
import { useContext } from "react";
import { AiContext } from "../context/AiContext";

const AiMessageInput = () => {
  const {
    text,
    setText,
    sendMessage,
    loading,
    attachments,
    handleAttachmentChange,
    removeAttachment,
  } = useContext(AiContext);
  return (
    <form onSubmit={sendMessage} className="border-top p-3 bg-white">
      {attachments?.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-2">
          {attachments?.map((item) => (
            <div
              key={item?.id}
              className="border rounded p-2 position-relative"
            >
              {item?.type.startsWith("image/") ? (
                <img
                  src={item?.preview}
                  alt=""
                  width={80}
                  height={80}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div style={{ width: 80 }}>📄</div>
              )}

              <small className="d-block text-truncate">{item?.name}</small>

              <button
                type="button"
                className="btn-close position-absolute top-0 end-0"
                onClick={() => removeAttachment(item?.id)}
              />
            </div>
          ))}
        </div>
      )}
      <div className="d-flex align-items-end">
        {/* Attachment Button */}
        <label
          htmlFor="attachment-input"
          className="btn btn-outline-secondary me-2 mb-0"
          title="Attach Files"
        >
          📎
        </label>

        <input
          id="attachment-input"
          type="file"
          multiple
          hidden
          onChange={handleAttachmentChange}
        />

        {/* Text Input */}
        <textarea
          rows={1}
          className="form-control me-2"
          placeholder="Ask Tango AI..."
          value={text}
          disabled={loading}
          onChange={(e) => setText(e.target.value)}
          style={{
            resize: "none",
            minHeight: "46px",
            maxHeight: "150px",
          }}
        />

        {/* Send Button */}
        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
          style={{
            height: "46px",
            minWidth: "90px",
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </form>
  );
};

export default AiMessageInput;
