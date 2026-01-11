import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GeneralContext } from "../context/generalContext";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const { menu, handleMenu } = useContext(GeneralContext);
  const {user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
 
  return (
    <nav
      className="d-flex align-items-center justify-content-between  px-2"
      style={{ backgroundColor: "#D3D3D3", position:"relative" }}
    >
      <div className="d-flex align-items-center justify-content-center  gap-3">
        {user &&
          (menu ? (
            <i className="fa-solid fa-bars" onClick={() => handleMenu()}></i>
          ) : (
            <i className="fa-solid fa-xmark" onClick={() => handleMenu()}></i>
          ))}
        <h6 className="text-dark fs-5">Tango</h6>
      </div>

      <div className="d-flex gap-5">
        {user && <h6 onClick={logoutUser}>Logout</h6>}

        {!user && <h6 onClick={() => navigate("/login")}>Login</h6>}

        {!user && <h6 onClick={() => navigate("/register")}>Register</h6>}
      </div>
    </nav>
  );
};

export default Navbar;
