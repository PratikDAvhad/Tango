const { useEffect, useState } = require("react");
const api = require("../api/axiosConfig");

const Sidebar = ({ onSelectUser, selectedUserId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/user/all");
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div
      className="border-end vh-100"
      style={{ width: "280px", overflowY: "auto" }}
    >
      <div className="p-3">
        <h5>Contacts</h5>
      </div>
      <ul className="list-group list-group-flush">
        {users.map((u) => (
          <li
            key={u._id}
            className={`list-group-item d-flex align-items-center ${
              selectedUserId === u._id ? "active" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => onSelectUser(u)}
          >
            <img
              src={u.profilePic || "/placeholder.png"}
              alt=""
              className="rounded-circle me-3"
              style={{ width: 40, height: 40, objectFit: "cover" }}
            />
            <div>
              <div className="fw-bold">{u.name}</div>
              <div className="small text-muted">{u.email}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
