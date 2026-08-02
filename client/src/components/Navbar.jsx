import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralContext } from "../context/generalContext";
import { AuthContext } from "../context/authContext";
import { SocketContext } from "../context/socketContext";
import FriendRequests from "../pages/FriendsRequest";
import AddFriend from "../pages/AddFriend";
import { api } from "../api/axiosConfig";

const Navbar = () => {
  const { menu, handleMenu } = useContext(GeneralContext);
  const { user, logoutUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [requests, setRequests] = useState([]);

  const ref = useRef();
  const addRef = useRef();

  // ==============================
  // Fetch pending requests
  // ==============================

  // Initial fetch
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get("/friend/pending");
        console.log("Fetched requests:", data);

        setRequests(data || []);
      } catch (err) { 
        console.error(err);
      }
    };

    console.log("Navbar user:", user);
    console.log("Actual user:", user?.user);
    if (user) {
      fetchRequests();
    }
  }, [user]);

  // ==============================
  // Socket notifications
  // ==============================
  useEffect(() => {
    if (!socket) return;

    const handleDeclined = (data) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: data.message,
        },
        ...prev,
      ]);
    };

    socket.on("friend-request-declined", handleDeclined);

    return () => {
      socket.off("friend-request-declined", handleDeclined);
    };
  }, [socket]);

  // ==============================
  // Remove notification
  // ==============================
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ==============================
  // Close dropdowns
  // ==============================
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }

      if (addRef.current && !addRef.current.contains(e.target)) {
        setOpenAdd(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const totalNotifications = requests.length + notifications.length;

  return (
    <nav
      className="d-flex align-items-center justify-content-between px-2"
      style={{
        backgroundColor: "#D3D3D3",
        position: "relative",
      }}
    >
      {/* Left */}
      <div className="d-flex align-items-center gap-3">
        {user &&
          (menu ? (
            <i className="fa-solid fa-bars" onClick={handleMenu} />
          ) : (
            <i className="fa-solid fa-xmark" onClick={handleMenu} />
          ))}

        <h6 className="text-dark fs-5 m-0">Tango</h6>
      </div>

      {/* Right */}
      <div className="d-flex align-items-center gap-4">
        {user ? (
          <h6 className="m-0" onClick={logoutUser}>
            Logout
          </h6>
        ) : (
          <>
            <h6 className="m-0" onClick={() => navigate("/login")}>
              Login
            </h6>

            <h6 className="m-0" onClick={() => navigate("/register")}>
              Register
            </h6>
          </>
        )}

        {/* Notifications */}
        {user && (
          <div className="notification-wrapper position-relative" ref={ref}>
            <button
              className="btn btn-light position-relative"
              onClick={() => setOpen((p) => !p)}
            >
              🔔
              {totalNotifications > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalNotifications}
                </span>
              )}
            </button>

            {open && (
              <div className="notification-dropdown shadow bg-white p-3 rounded">
                <h6 className="mb-3">Notifications</h6>

                {/* Friend Requests */}
                <FriendRequests requests={requests} setRequests={setRequests} />

                {/* Decline notifications */}
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="border-top pt-2 mt-2 d-flex justify-content-between align-items-start gap-2"
                  >
                    <span>{n.message}</span>

                    <button
                      className="btn btn-sm btn-link text-danger p-0"
                      onClick={() => removeNotification(n.id)}
                    >
                      &times;
                    </button>
                  </div>
                ))}

                {requests.length === 0 && notifications.length === 0 && (
                  <p className="text-muted mb-0">No notifications</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Add Friend */}
        {user && (
          <div className="position-relative" ref={addRef}>
            <button
              className="btn btn-light"
              onClick={() => setOpenAdd((p) => !p)}
            >
              ➕
            </button>

            {openAdd && (
              <div className="notification-dropdown shadow bg-white p-3 rounded">
                <h6 className="mb-3">Add Friend</h6>

                <AddFriend
                  onSuccess={() => {
                    setOpenAdd(false);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
