
import { useContext } from "react";
import { api } from "../api/axiosConfig";
import { AuthContext } from "../context/authContext";

export default function FriendRequests({
  requests,
  setRequests,
}) {
  const { refreshUser } = useContext(AuthContext);

  console.log("FriendRequests received:", requests);

  // ==========================
  // Accept request
  // ==========================
  const accept = async (id) => {
    try {
      await api.post("/friend/accept", {
        requestId: id,
      });

      // remove locally
      setRequests((prev) =>
        prev.filter((r) => r._id !== id)
      );

      // // refresh logged in user data
      // await refreshUser();

      // notify chats sidebar
      window.dispatchEvent(new Event("friend-added"));
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // Decline request
  // ==========================
  const decline = async (id) => {
    try {
      await api.post("/friend/decline", {
        requestId: id,
      });

      // remove locally
      setRequests((prev) =>
        prev.filter((r) => r._id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Nothing to show
  if (!requests || requests.length === 0) {
    return null;
  }

  return (
    <>
      {requests.map((req) => (
        <div
          key={req._id}
          className="d-flex justify-content-between align-items-center gap-3 border-bottom pb-2 mb-2"
        >
          <div className="d-flex align-items-center gap-2">
            <img
              src={req.sender.profilePic}
              alt={req.sender.name}
              width={35}
              height={35}
              className="rounded-circle object-fit-cover"
            />

            <div>
              <div className="fw-semibold">
                {req.sender.name}
              </div>

              <small className="text-muted">
                sent you a friend request
              </small>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-success"
              onClick={() => accept(req._id)}
            >
              Accept
            </button>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => decline(req._id)}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </>
  );
}