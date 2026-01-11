import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Register = () => {
  const { registerInfo, handleRegisterInfo, registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  

  return (
    <div className="container col-4 mt-5">
      <h3>Register</h3>
      <form onSubmit={registerUser}>
        <input
          className="form-control my-2"
          placeholder="Name"
          name="name"
          value={registerInfo.name}
          onChange={handleRegisterInfo}
        />

        <input
          className="form-control my-2"
          placeholder="Email"
          name="email"
          value={registerInfo.email}
          onChange={handleRegisterInfo}
        />

        <input
          type="password"
          className="form-control my-2"
          placeholder="Password"
          name="password"
          value={registerInfo.password}
          onChange={handleRegisterInfo}
        />

        <button className="btn btn-success w-100 mt-2" type="submit">Register</button>
      </form>
      <p className="mt-2">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
