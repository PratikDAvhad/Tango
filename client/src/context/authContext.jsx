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

  const [profilePic, setProfilePic] = useState(null);

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
      const formData = new FormData();

      formData.append("name", registerInfo.name);
      formData.append("email", registerInfo.email);
      formData.append("password", registerInfo.password);
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      console.log("Image in profilePage : ProfilePic ====> ", profilePic);

      const res = await api.post("/auth/register", formData);
      console.log("response below res", res.data);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          user: res.data.user,
          token: res.data.token,
        }),
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
      // check for login error
      console.error("❌ check for login info: " + loginInfo.email);
      const res = await api.post("/auth/login", loginInfo);
      console.log("response below res", res.data.user);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          user: res.data.user,
          token: res.data.token,
        }),
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

  const refreshUser = async () => {
    console.log("1");

    try {
      const { data } = await api.get("/user/me");
      console.log("2");

      const updatedUser = {
        user: data,
        token: user.token,
      };

      setUser(updatedUser);
      console.log("3");

      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      console.log("4");
    } catch (err) {
      console.log("ERROR");
      console.error(err);
    }
  };

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
        profilePic,
        setProfilePic,
        setUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
