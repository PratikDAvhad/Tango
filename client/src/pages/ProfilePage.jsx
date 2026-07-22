import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { ProfileContext } from "../context/ProfileContext";

const ProfilePage = () => {
  const {
    profile,
    handleChange,
    updateProfile,
    profilePic,
    setProfilePic,
    loading,

    passwordData,
    handlePasswordChange,
    changePassword,
  } = useContext(ProfileContext);

  console.log("Current user in profile page ", profile);

  return (
    <div className="container-fluid p-4 h-100">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body overflow-auto">
          <h2 className="text-center mb-4">My Profile</h2>

          {/* Profile Section */}
          <div className="text-center mb-4">
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              hidden
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
            <img
              src={
                profilePic
                  ? URL.createObjectURL(profilePic)
                  : profile?.profilePic
                    ? profile.profilePic
                    : "https://res.cloudinary.com/dp70s4qu7/image/upload/v1784470092/pexels-batitay-japheth-43379766-16333664_wqhlvp.jpg"
              }
              alt="Profile"
              className="rounded-circle border"
              style={{
                width: "140px",
                height: "140px",
                objectFit: "cover",
              }}
            />

            <div className="mt-3">
              <label
                htmlFor="profilePic"
                className="btn btn-outline-primary btn-sm"
              >
                Change Photo
              </label>
            </div>

            <h3 className="mt-3 mb-1">{profile?.name || "Your Name"}</h3>
          </div>

          <hr />

          {/* About */}
          <div className="mb-4">
            <h5>About</h5>

            <textarea
              className="form-control"
              rows="3"
              name="about"
              value={profile?.about || ""}
              onChange={handleChange}
            />
          </div>

          <hr />

          {/* Personal Details */}
          <div className="mb-4">
            <h5>Personal Details</h5>

            <div className="row mt-3">
              <div className="col-md-6 mb-3">
                <label className="form-label">👤 Name</label>

                <input
                  className="form-control"
                  name="name"
                  value={profile?.name || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">📧 Email</label>

                <input
                  className="form-control"
                  name="email"
                  defaultValue={profile?.email || ""}
                  disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">📱 Phone</label>

                <input
                  className="form-control"
                  name="phone"
                  value={profile?.phone || ""}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">📍 Location</label>

                <input
                  className="form-control"
                  name="location"
                  value={profile?.location || ""}
                  onChange={handleChange}
                  placeholder="Enter location"
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Activity */}
          <div className="mb-4">
            <h5>Activity</h5>

            <div className="row text-center mt-3">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h3>{profile?.friends?.length || 0}</h3>
                    <small>Friends</small>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h3>{profile?.createdAt?.split("-")[0]}</h3>
                    <small>Joined</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />

          {/* Security */}
          <div className="mb-4">
            <h5>Security</h5>

            <button
              className="btn btn-outline-secondary me-3"
              data-bs-toggle="modal"
              data-bs-target="#changePasswordModal"
            >
              🔑 Change Password
            </button>
          </div>

          <div className="text-center mt-5">
            <button
              className="btn btn-primary px-5"
              onClick={updateProfile}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <div className="modal fade" id="changePasswordModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Change Password</h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              />
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Current Password</label>

                <input
                  type="password"
                  className="form-control"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">New Password</label>

                <input
                  type="password"
                  className="form-control"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>

                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>

              <button className="btn btn-primary" onClick={changePassword}>
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
