import { useState } from "react";
import { api } from "../api/axiosConfig";

export default function AddFriend({ onSuccess }) {
  const [email, setEmail] = useState("");

  const sendRequest = async () => {
    try {
      const res = await api.post("/friend/request", { email });
      alert(res.data.message);
      setEmail("");
      onSuccess?.();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="add-friend-box">
      <input
        type="email"
        placeholder="Friend's email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendRequest}>Send</button>
    </div>
  );
}
