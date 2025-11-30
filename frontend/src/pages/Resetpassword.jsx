import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { email };

      const result = await axios.post(
        "http://localhost:7000/api/v1/auth/requestPasswordReset",
        body
      );

      toast.success(result.data?.message || "OTP sent successfully");
      localStorage.setItem(
        "ForgetPassword",
        JSON.stringify({
          email: result.data.data.email,
          fullName: result.data.data.fullName,
        })
      );
      navigate("/resetotp");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="bg-[#181818] p-6 sm:p-8 md:p-10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-full max-w-md sm:max-w-md md:max-w-md border border-[#2a2a2a]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-500 text-center mb-10">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center bg-[#242424] rounded-lg px-4 h-12 sm:h-14">
            <Mail className="text-green-500 w-5 h-5" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              className="w-full h-full pl-3 bg-transparent outline-none placeholder-gray-400 text-white text-base"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-lg font-semibold bg-green-600 hover:bg-green-500 shadow-md"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
