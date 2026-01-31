import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Route, Routes, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { MainPage } from "./pages/MainPage";
import { setAuthToken } from "./api/axiosConfig";
import { useSocket } from "./context/socketContext";
import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./context/authContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";
import FriendRequests from "./pages/FriendsRequest";
import AddFriend from "./pages/AddFriend";

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
          path="/chats"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
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
        <Route path="*" element={<Navigate to={"/chats"} replace />} />
      </Routes>
    </>
  );
}

export default App;
