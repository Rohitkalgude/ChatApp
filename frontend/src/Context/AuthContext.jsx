import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginUser = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });

      if (res.data.success) {
        setUser(res.data.data.user);
        toast.success("Login successful");
      }

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const registerUser = async (fullName, email, password) => {
    try {
      const res = await axios.post("/auth/register", {
        fullName,
        email,
        password,
      });
      toast.success("register successful");

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const verifyOtp = async (emailOtp) => {
    try {
      const res = await axios.post("/auth/verfiyOpt", {
        emailOtp,
      });

      if (res.data.success) {
        setUser(res.data.data.user);
        toast.success("OTP Verified");
      }

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  const logoutUser = async () => {
    try {
      const res = await axios.post("/auth/logout");
      if (res.data.success) {
        setUser(null);
        toast.success("Logged out");
      }
      return res.data;
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const getCurrentUser = async () => {
    try {
      const res = await axios.post("/auth/currentuser");

      if (res.data.success) {
        setUser(res.data.data);
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
