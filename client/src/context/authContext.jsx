import { createContext, useCallback, useEffect, useState } from "react";
import { api } from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
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

  const [otpInfo, setOtpInfo] = useState({
    userId: "",
    email: "",
    otp: "",
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

  const handleOtpInfo = useCallback((e) => {
    const { name, value } = e.target;

    setOtpInfo((prev) => ({
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

      // console.log("response below res", res.data);
      // localStorage.setItem(
      //   "userInfo",
      //   JSON.stringify({
      //     user: res.data.user,
      //     token: res.data.token,
      //   }),
      // );
      // setUser(res.data);

      // SAVE OTP INFO
      setOtpInfo({
        userId: res.data.userId,
        email: registerInfo.email,
        otp: "",
      });

      alert("OTP sent to your email");

      // GO TO VERIFY PAGE
      navigate("/verify-email");
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
      navigate("/chats");
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        setOtpInfo({
          userId: err.response.data.userId,
          email: err.response.data.email,
          otp: "",
        });

        alert("Please verify your email. A new OTP has been sent.");

        navigate("/verify-email");
        return;
      }

      alert(err.response?.data?.message || "Login failed");
    }
  };

  const verifyOtp = async (navigate) => {
    try {
      const res = await api.post("/otp/verify-email", {
        userId: otpInfo.userId,
        otp: otpInfo.otp,
      });

      // SAVE TOKEN + USER
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          user: res.data.user,
          token: res.data.token,
        }),
      );

      setUser({
        user: res.data.user,
        token: res.data.token,
      });

      alert("Email verified successfully!");

      navigate("/chats");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "OTP verification failed");
    }
  };

  const resendOtp = async () => {
    try {
      await api.post("/otp/resend-otp", {
        email: otpInfo.email,
      });

      alert("OTP resent successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to resend OTP");
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

        otpInfo,
        setOtpInfo,
        handleOtpInfo,
        verifyOtp,
        resendOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
