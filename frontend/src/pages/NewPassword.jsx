import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

function NewPassword() {
  const [password, Setpassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();

  const handleCheck = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Password and Confirm Password do not match!");
      return;
    }

    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="bg-[#181818] p-6 sm:p-8 md:p-10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-full max-w-md sm:max-w-md md:max-w-md border border-[#2a2a2a]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-500 text-center mb-10">
          New Password
        </h1>

        <form onSubmit={handleCheck} className="flex flex-col gap-6">
          <div className="flex items-center bg-[#242424] rounded-lg px-4 h-12 sm:h-14">
            <Lock className="text-green-500 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => Setpassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full h-full pl-3 bg-transparent outline-none placeholder-gray-400 text-white text-base"
              required
            />
          </div>

          <div className="flex items-center bg-[#242424] rounded-lg px-4 h-12 sm:h-14">
            <Lock className="text-green-500 w-5 h-5" />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className="w-full h-full pl-3 bg-transparent outline-none placeholder-gray-400 text-white text-base"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-lg font-semibold bg-green-600 hover:bg-green-500 shadow-md"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
