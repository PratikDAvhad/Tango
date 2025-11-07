import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <h4 className="text-light">Chat App</h4>

      {userInfo && (
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
