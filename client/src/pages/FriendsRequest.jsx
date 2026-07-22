import { useContext, useEffect, useState } from "react";
import { api } from "../api/axiosConfig";
import { AuthContext } from "../context/authContext";

export default function FriendRequests({ onAccept }) {
  const [requests, setRequests] = useState([]);
  const { refreshUser } = useContext(AuthContext);
  console.log(refreshUser);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get("/friend/pending");
      setRequests(data);
    };
    fetch();
  }, []);

  const accept = async (id) => {
    console.log("Accepting:", id);

    await api.post("/friend/accept", { requestId: id });

    console.log("Accepted successfully");

    setRequests((prev) => {
      console.log("Previous requests:", prev);

      const updated = prev.filter((r) => r._id !== id);

      console.log("Updated requests:", updated);

      return updated;
    });

    await refreshUser();
    onAccept?.();
  };

  if (requests.length === 0) {
    return <p className="empty-text">No new requests</p>;
  }

  return (
    <>
      {requests.map((req) => (
        <div key={req._id} className="notification-item">
          <span>{req.sender.name}</span>
          <button onClick={() => accept(req._id)}>Accept</button>
        </div>
      ))}
    </>
  );
}
