import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const LoginPage = () => {
  const {loginInfo, handleLoginInfo, loginUser} = useContext(AuthContext);

  return (
    <div className="container col-4 mt-5">
      <h3>Login</h3>
      <form onSubmit={loginUser}>
        <input
          type="email"
          className="form-control my-2"
          placeholder="Email"
          name="email"
          value={loginInfo.email}
          onChange={handleLoginInfo}
        />

        <input
          type="password"
          className="form-control my-2"
          placeholder="Password"
          name="password"
          value={loginInfo.password}
          onChange={handleLoginInfo}
        />

        <button className="btn btn-primary w-100 mt-2" type="submit">Login</button>
      </form>
      <p className="mt-2">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
