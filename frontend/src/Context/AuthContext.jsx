import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io as ClientIo } from "socket.io-client";

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:7000";
console.log("Backend URL:", backendURL);

axios.defaults.baseURL = backendURL;
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [onlineUser, setonlineUser] = useState([]);

  const connectSocket = (userId) => {
    if (socket) return;

    const newSocket = ClientIo(backendURL, {
      query: { userId },
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("getOnlineUsers", (users) => {
      console.log("Online users:", users);
      setonlineUser(users);
    });

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const registerUser = async (fullName, email, password) => {
    try {
      const res = await axios.post("/api/v1/auth/register", {
        fullName,
        email,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("userData", JSON.stringify(res.data.data));
        connectSocket(res.data.data.user?._id);
        toast.success("Register successfully");
      }

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const verifyOtp = async (emailOtp) => {
    try {
      const res = await axios.post("/api/v1/auth/verfiyOpt", {
        emailOtp,
      });

      if (res.data.success) {
        const user = res.data.data.user;

        localStorage.setItem("userData", JSON.stringify(user));
        localStorage.setItem("token", res.data.data.token);
        setUser(user);
        toast.success("OTP Verified");

        connectSocket(res.data.data.user?._id);
      }

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  const updateProfile = async (fullName, bio, profilePic) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "/api/v1/auth/updateProfile",
        {
          fullName,
          bio,
          profilePic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const updatedUser = res.data.data;

        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        toast.success("Profile Update successfully");
        return { success: true, data: updatedUser };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update Profile failed");
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await axios.post("/api/v1/auth/login", { email, password });

      if (res.data.success) {
        const { user, token } = res.data.data;

        toast.success("Login successfully");

        setUser(user);
        localStorage.setItem("userData", JSON.stringify(user));
        localStorage.setItem("token", token);

        connectSocket(res.data.data.user?._id);
      }

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const logoutUser = async () => {
    try {
      const res = await axios.post("/api/v1/auth/logout");
      if (res.data.success) {
        disconnectSocket();

        setUser(null);
        toast.success("Logout sucessfully");

        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      }
      return res.data;
    } catch (error) {
      toast.error("Logout failed", error.message);
    }
  };

  const getCurrentUser = async () => {
    try {
      const res = await axios.get("/api/v1/auth/currentuser");

      if (res.data.success) {
        setUser(res.data.data);

        if (!socket) {
          connectSocket(res.data.data._id);
        }
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);
    }
  }, [user]);

  const value = {
    axios,
    user,
    socket,
    loading,
    onlineUser,
    loginUser,
    registerUser,
    updateProfile,
    getCurrentUser,
    verifyOtp,
    logoutUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
