import { useEffect, useState } from "react";
import { api } from "../api/axiosConfig";

export default function FriendRequests({ onAccept }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get("/friend/pending");
      setRequests(data);
    };
    fetch();
  }, []);

  const accept = async (id) => {
    await api.post("/friend/accept", { requestId: id });
    setRequests((prev) => prev.filter((r) => r._id !== id));
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
