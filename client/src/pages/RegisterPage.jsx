import React, { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Register = () => {
  const {
    registerInfo,
    handleRegisterInfo,
    registerUser,
    profilePic,
    setProfilePic,
  } = useContext(AuthContext);

  const fileInputRef = useRef();

  return (
    <div className="container col-4 mt-5">
      <h3 className="mb-4 text-center">Create your account</h3>

      <form onSubmit={registerUser}>
        {/* Profile Picture */}
        <div className="text-center mb-4">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            ref={fileInputRef}
            hidden
            onChange={(e) => {
              const file = e.target.files[0];

              if (!file) return;

              const allowed = [
                "image/jpg",
                "image/jpeg",
                "image/png",
                "image/webp",
              ];

              if (!allowed.includes(file.type)) {
                alert("Only JPG, JPEG, PNG and WEBP images are allowed.");
                return;
              }

              if (file.size > 5 * 1024 * 1024) {
                alert("Maximum image size is 5MB.");
                return;
              }

              setProfilePic(file);
            }}
          />

          <img
            src={
              profilePic
                ? URL.createObjectURL(profilePic)
                : "https://ui-avatars.com/api/?name=User&background=random&size=150"
            }
            alt="Profile"
            width={110}
            height={110}
            className="rounded-circle border"
            style={{
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => fileInputRef.current.click()}
          />

          <div
            className="mt-2 text-primary"
            style={{ cursor: "pointer", fontWeight: "500" }}
            onClick={() => fileInputRef.current.click()}
          >
            {profilePic ? "Change picture" : "Add profile picture"}
          </div>

          <small className="text-muted d-block">
            Optional • JPG, PNG, WEBP • Max 5 MB
          </small>
        </div>

        {/* Name */}
        <input
          className="form-control my-2"
          placeholder="Name"
          name="name"
          value={registerInfo.name}
          onChange={handleRegisterInfo}
        />

        {/* Email */}
        <input
          className="form-control my-2"
          placeholder="Email"
          name="email"
          value={registerInfo.email}
          onChange={handleRegisterInfo}
        />

        {/* Password */}
        <input
          type="password"
          className="form-control my-2"
          placeholder="Password"
          name="password"
          value={registerInfo.password}
          onChange={handleRegisterInfo}
        />

        <button className="btn btn-success w-100 mt-3" type="submit">
          Register
        </button>
      </form>

      <p className="mt-3 text-center">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;