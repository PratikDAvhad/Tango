import React, { useContext } from "react";
import { StoryContext } from "../context/storyContext";

const UploadStoryModal = ({ show, onClose }) => {
  const { storyFile, setStoryFile, caption, setCaption, uploadStory, loading } =
    useContext(StoryContext);

  if (!show) return null;

  const handleUpload = async () => {
    await uploadStory();
    onClose();
  };

  return (
    <div className="story-modal-overlay">
      <div className="story-modal">
        <h3>Add Story</h3>

        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setStoryFile(e.target.files[0])}
        />

        {storyFile && (
          <div className="story-preview">
            {storyFile.type.startsWith("image") ? (
              <img src={URL.createObjectURL(storyFile)} alt="preview" />
            ) : (
              <video src={URL.createObjectURL(storyFile)} controls />
            )}
          </div>
        )}

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <div className="story-modal-buttons">
          <button onClick={onClose}>Cancel</button>

          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadStoryModal;
