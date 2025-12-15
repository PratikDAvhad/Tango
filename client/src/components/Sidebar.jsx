import { useEffect, useState } from "react";
import { api } from "../api/axiosConfig";

export const Sidebar = ({ onSelectUser, selectedUserId, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/user/all");
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="d-flex flex-column border-end "
      style={{ height: "100%", width: "300px" }}
    >
      {/* Header */}
      <div
        className="p-3 border-bottom bg-white shadow-sm"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 2,
        }}
      >
        <div className="d-flex">
          <h5 className="mb-2 fw-semibold text-primary">Contacts</h5>
          <h3 style={{ fontSize: "0.95rem" , padding: "5px"}}>{currentUser.name}</h3>
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control form-control-sm"
        />
      </div>

      {/* Contacts list */}
      <ul
        className="list-group list-group-flush flex-grow-1"
        style={{
          overflowY: "auto",
          backgroundColor: "#fdfdfd",
        }}
      >
        {filteredUsers.map((u) => (
          <li
            key={u._id}
            className={`list-group-item d-flex align-items-center border-0 border-bottom ${
              selectedUserId === u._id ? "active" : ""
            }`}
            style={{
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor:
                selectedUserId === u._id ? "#0d6efd" : "transparent",
              color: selectedUserId === u._id ? "white" : "inherit",
            }}
            onClick={() => onSelectUser(u)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                selectedUserId === u._id ? "#0d6efd" : "#e9ecef")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                selectedUserId === u._id ? "#0d6efd" : "transparent")
            }
          >
            <img
              src={u.profilePic || "/placeholder.png"}
              alt=""
              className="rounded-circle me-3 border"
              style={{
                width: 45,
                height: 45,
                objectFit: "cover",
                borderColor:
                  selectedUserId === u._id ? "white" : "rgba(0,0,0,0.1)",
              }}
            />
            <div
              style={{
                flex: 1,
                overflow: "hidden",
              }}
            >
              <div
                className="fw-semibold text-truncate"
                style={{ fontSize: "0.95rem" }}
              >
                {u.name}
              </div>
              <div
                className="small text-muted text-truncate"
                style={{
                  fontSize: "0.8rem",
                  color: selectedUserId === u._id ? "#e6e6e6" : "#6c757d",
                }}
              >
                {u.email}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
