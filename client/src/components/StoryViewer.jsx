import React, { useContext, useEffect, useState } from "react";
import { StoryContext } from "../context/storyContext";
import { AuthContext } from "../context/authContext";

const StoryViewer = () => {
  const { selectedStory, setSelectedStory, deleteStory } =
    useContext(StoryContext);

  const { user } = useContext(AuthContext);

  const currentUser = user.user;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedStory) {
      setCurrentIndex(0);
    }
  }, [selectedStory]);

  if (!selectedStory) return null;

  const stories = selectedStory.stories;

  const story = stories[currentIndex];

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    setSelectedStory(null);
  };

  const previousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="story-viewer-overlay">
      <div className="story-viewer">
        {/* Header */}

        <div className="story-header">
          <div className="story-user">
            <img
              src={selectedStory.user.profilePic}
              alt={selectedStory.user.name}
            />

            <span>{selectedStory.user.name}</span>
          </div>

          <div className="story-actions">
            {selectedStory.user._id === currentUser._id && (
              <button onClick={() => deleteStory(story._id)}>Delete</button>
            )}

            <button onClick={() => setSelectedStory(null)}>✕</button>
          </div>
        </div>

        {/* Story */}

        <div className="story-content">
          {story.media.type === "image" ? (
            <img src={story.media.url} alt="" />
          ) : (
            <video src={story.media.url} controls autoPlay />
          )}
        </div>

        {story.caption && <div className="story-caption">{story.caption}</div>}

        {/* Navigation */}

        <button className="story-prev" onClick={previousStory}>
          ◀
        </button>

        <button className="story-next" onClick={nextStory}>
          ▶
        </button>
      </div>
    </div>
  );
};

export default StoryViewer;
