import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Route, Routes, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { MainPage } from "./pages/MainPage";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";
import FriendRequests from "./pages/FriendsRequest";
import AddFriend from "./pages/AddFriend";
import { ChatsPage } from "./pages/ChatsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import StoriesPage from "./pages/StoriesPage";
import AiPage from "./pages/AiPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
function App() {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/addFriend"
          element={
            <ProtectedRoute>
              <AddFriend />
            </ProtectedRoute>
          }
        />

        <Route
          path="/friendReq"
          element={
            <ProtectedRoute>
              <FriendRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />

        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>
    </>
  );
}

export default App;
