import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { createContext } from "react";
import { api } from "../api/axiosConfig";

export const ProfileContext = createContext();

const ProfilePageContextProvider = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);

  const currentUser = user?.user;
  console.log("Current user in Profile Context", currentUser);

  const [profile, setProfile] = useState(null);

  const [profilePic, setProfilePic] = useState(null);

  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
      console.log("Current user in Profile Context", profile);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      console.log("Update profile is called");

      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("about", profile.about || "");
      formData.append("phone", profile.phone || "");
      formData.append("location", profile.location || "");

      if (profilePic) {
        formData.append("files", profilePic);
      }

      const { data } = await api.put("/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(data);

      const updatedUser = {
        ...user,
        user: data,
      };

      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      setUser(updatedUser);

      alert("Profile Updated");
      setProfilePic(null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      await api.put("/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert("Password changed successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Unable to change password");
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        profilePic,
        setProfilePic,
        handleChange,
        updateProfile,

        passwordData,
        handlePasswordChange,
        changePassword,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfilePageContextProvider;
