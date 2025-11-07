import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("userInfo", JSON.stringify({
        user: data.user,
        token: data.token
      }));
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="container col-4 mt-5">
      <h3>Register</h3>
      <form onSubmit={submitHandler}>
        <input className="form-control my-2" placeholder="Name"
          value={name} onChange={e => setName(e.target.value)} />

        <input className="form-control my-2" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)} />

        <input type="password" className="form-control my-2" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)} />

        <button className="btn btn-success w-100 mt-2">Register</button>
      </form>
      <p className="mt-2">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;
