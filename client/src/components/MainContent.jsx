import { useContext } from "react";
import { GeneralContext } from "../context/generalContext";

import { ChatsPage } from "../pages/ChatsPage";
import StoriesPage from "../pages/StoriesPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import AiPage from "../pages/AiPage";

export default function MainContent() {
  const { activePage } = useContext(GeneralContext);

  switch (activePage) {
    case "stories":
      return <StoriesPage />;

    case "profile":
      return <ProfilePage />;

    case "settings":
      return <SettingsPage />;

    case "ai":
      return <AiPage />;

    default:
      return <ChatsPage />;
  }
}
