// src/context/storyContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axiosConfig";
import { SocketContext } from "./socketContext";

export const StoryContext = createContext();

export const StoryContextProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedStory, setSelectedStory] = useState(null);

  const [caption, setCaption] = useState("");
  const [storyFile, setStoryFile] = useState(null);

  // ===========================================
  // Group stories by user
  // ===========================================

  const groupStories = (stories) => {
    const grouped = {};

    stories.forEach((story) => {
      const userId = story.user._id;

      if (!grouped[userId]) {
        grouped[userId] = {
          user: story.user,
          stories: [],
        };
      }

      grouped[userId].stories.push(story);
    });

    return Object.values(grouped);
  };

  // ===========================================
  // Fetch Stories
  // ===========================================

  const fetchStories = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/story");

      setStories(groupStories(data));
    } catch (err) {
      console.error("Error fetching stories:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===========================================
  // Upload Story
  // ===========================================

  const uploadStory = async () => {
    if (!storyFile) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("caption", caption);
      formData.append("files", storyFile);

      await api.post("/story/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setCaption("");
      setStoryFile(null);

      // No manual update.
      // Backend socket will emit "story-added".
    } catch (err) {
      console.error("Upload Story Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===========================================
  // Delete Story
  // ===========================================

  const deleteStory = async (storyId) => {
    try {
      await api.delete(`/story/${storyId}`);

      setSelectedStory(null);

      // Backend socket will emit "story-deleted"
    } catch (err) {
      console.error(err);
    }
  };

  // ===========================================
  // Initial Fetch
  // ===========================================

  useEffect(() => {
    fetchStories();
  }, []);

  // ===========================================
  // Socket Listeners
  // ===========================================

  useEffect(() => {
    if (!socket) return;

    const handleStoryAdded = (story) => {
      setStories((prev) => {
        const copy = [...prev];

        const index = copy.findIndex(
          (group) => group.user._id === story.user._id,
        );

        if (index !== -1) {
          copy[index] = {
            ...copy[index],
            stories: [story, ...copy[index].stories],
          };

          return copy;
        }

        return [
          {
            user: story.user,
            stories: [story],
          },
          ...copy,
        ];
      });
    };

    const handleStoryDeleted = (storyId) => {
      setStories((prev) =>
        prev
          .map((group) => ({
            ...group,
            stories: group.stories.filter((story) => story._id !== storyId),
          }))
          .filter((group) => group.stories.length > 0),
      );
    };

    socket.on("story-added", handleStoryAdded);
    socket.on("story-deleted", handleStoryDeleted);

    return () => {
      socket.off("story-added", handleStoryAdded);
      socket.off("story-deleted", handleStoryDeleted);
    };
  }, [socket]);

  return (
    <StoryContext.Provider
      value={{
        stories,
        loading,

        fetchStories,

        uploadStory,
        deleteStory,

        selectedStory,
        setSelectedStory,

        caption,
        setCaption,

        storyFile,
        setStoryFile,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};
