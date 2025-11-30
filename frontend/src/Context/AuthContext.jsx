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

  const connectSocket = (userId) => {
    const newSocket = ClientIo(backendURL, {
      query: { userId },
      withCredentials: true,
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
        setUser(res.data.data.user);
        toast.success("OTP Verified");

        connectSocket(res.data.data.user?._id);
      }

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await axios.post("/api/v1/auth/login", { email, password });

      if (res.data.success) {
        toast.success("Login successfully");

        setUser(res.data.data.user);

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
        setUser(null);
        toast.success("Logged out");

        disconnectSocket();
      }
      return res.data;
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const getCurrentUser = async () => {
    try {
      const res = await axios.get("/api/v1/auth/currentuser");

      if (res.data.success) {
        setUser(res.data.data);

        connectSocket(res.data.data._id);
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

  const value = {
    axios,
    user,
    socket,
    loading,
    loginUser,
    registerUser,
    getCurrentUser,
    verifyOtp,
    logoutUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
