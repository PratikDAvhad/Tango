import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/chats" replace />;
  }

  return children;
};
