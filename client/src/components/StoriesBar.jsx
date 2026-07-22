import React, { useContext, useState } from "react";
import { StoryContext } from "../context/storyContext";
import { AuthContext } from "../context/authContext";
import UploadStoryModal from "./UploadStoryModal";

const StoriesBar = () => {
  const { stories, setSelectedStory } = useContext(StoryContext);
  const { user } = useContext(AuthContext);

  const currentUser = user.user;

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="stories-bar">
        {/* Your Story */}
        <div className="story-item" onClick={() => setShowModal(true)}>
          <div className="story-avatar own-story">
            <img src={currentUser.profilePic} alt={currentUser.name} />

            <span className="add-story">+</span>
          </div>

          <small>Your Story</small>
        </div>

        {/* Friends Stories */}
        {stories.map((group, index) => {
          console.log("Group:", group);
          console.log("User:", group.user);
          console.log("Profile Pic:", group.user?.profilePic);

          return (
            <div
              key={group.user?._id || index}
              className="story-item"
              onClick={() => setSelectedStory(group)}
            >
              <div className="story-avatar">
                <img src={group.user?.profilePic} alt={group.user?.name} />
              </div>

              <small>{group.user?.name}</small>
            </div>
          );
        })}
      </div>

      <UploadStoryModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default StoriesBar;
