import { createContext, useCallback, useEffect, useState } from "react";
import { api } from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");

    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  console.log("register info : ", registerInfo);

  const handleRegisterInfo = useCallback((e) => {
    const { name, value } = e.target;

    setRegisterInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleLoginInfo = useCallback((e) => {
    const { name, value } = e.target;

    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "http://localhost:5000/api/auth/register",
        registerInfo
      );
      console.log("response below res", res.data.user);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          user: res.data.user,
          token: res.data.token,
        })
      );
      setUser(res.data);
    } catch (err) {
      console.log("error", err);
      alert(err?.response?.data?.message);
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "http://localhost:5000/api/auth/login",
        loginInfo
      );
      console.log("response below res", res.data.user);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          user: res.data.user,
          token: res.data.token,
        })
      );
      setUser(res.data);
    } catch (err) {
      console.log("error", err);
      alert(err?.response?.data?.message);
    }
  };

  const logoutUser = useCallback(() => {
    localStorage.removeItem("userInfo");
    
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        registerInfo,
        handleRegisterInfo,
        registerUser,
        user,
        logoutUser,
        loginInfo,
        handleLoginInfo,
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
