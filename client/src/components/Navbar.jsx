import React, { useContext, useState, useEffect, useRef } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { GeneralContext } from "../context/generalContext";
import { AuthContext } from "../context/authContext";
import FriendRequests from "../pages/FriendsRequest";
import AddFriend from "../pages/AddFriend";
const Navbar = () => {
  const { menu, handleMenu } = useContext(GeneralContext);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const ref = useRef();

  const fetchCount = async () => {
    const { data } = await api.get("/friend/pending");
    setCount(data.length);
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const [openNotif, setOpenNotif] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const notifRef = useRef();
  const addRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotif(false);
      }
      if (addRef.current && !addRef.current.contains(e.target)) {
        setOpenAdd(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav
      className="d-flex align-items-center justify-content-between  px-2"
      style={{ backgroundColor: "#D3D3D3", position: "relative" }}
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

      <div className="d-flex gap-4">
        {user && <h6 onClick={logoutUser}>Logout</h6>}

        {!user && <h6 onClick={() => navigate("/login")}>Login</h6>}

        {!user && <h6 onClick={() => navigate("/register")}>Register</h6>}

        {user && (
          <div className="notification-wrapper" ref={ref}>
            <button className="bell-btn" onClick={() => setOpen((p) => !p)}>
              🔔
              {count > 0 && <span className="badge">{count}</span>}
            </button>

            {open && (
              <div className="notification-dropdown">
                <h6>Friend Requests</h6>
                <FriendRequests onAccept={fetchCount} />
              </div>
            )}
          </div>
        )}

        {/* ➕ Add Friend */}
        {user && (
          <div className="dropdown-wrapper" ref={addRef}>
            <button onClick={() => setOpenAdd((p) => !p)}>➕</button>
            {openAdd && (
              <div className="notification-dropdown">
                <h6>Add Friend</h6>
                <AddFriend onSuccess={() => setOpenAdd(false)} />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
