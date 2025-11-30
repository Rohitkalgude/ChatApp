import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

function OTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);

  const navigate = useNavigate();

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] !== "") {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        return;
      }

      if (otp[index] === "" && index > 0) {
        inputRef.current[index - 1].focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRef.current[index - 1].focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").slice(0, 6);
    const newOtp = [...otp];

    pasteData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });

    setOtp(newOtp);

    const lastIndex = pasteData.length - 1;
    inputRef.current[lastIndex]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    navigate("/profile");
  };

  const resendOtp = async () => {
    const UserData = JSON.parse(localStorage.getItem("UserData"));

    if (!UserData) {
      toast.error("Email not found");
      return;
    }

    try {
      const body = {
        email: UserData.email,
      };

      const result = await axios.post(
        "http://localhost:7000/api/v1/auth/resendOtp",
        body
      );

      toast.success(result.data.message || "OTP resent successfully!");

      localStorage.setItem("UserData", JSON.stringify(UserData));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="bg-[#181818] p-6 sm:p-8 md:p-10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-full max-w-md sm:max-w-md md:max-w-md border border-[#2a2a2a] text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-500 mb-4">
          Verify OTP
        </h1>

        <p className="text-gray-400 mb-8 text-sm sm:text-base">
          Please enter the 6-digit OTP
        </p>

        <form
          onSubmit={handleVerifyOtp}
          className="flex flex-col items-center gap-6 sm:gap-8"
        >
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 flex-nowrap overflow-x-auto no-scrollbar">
            {otp.map((value, i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                ref={(el) => (inputRef.current[i] = el)}
                value={value}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#242424] text-white text-center text-lg font-semibold rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            ))}
          </div>

          <button className="w-full py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-500 transition duration-200 shadow-md">
            Verify OTP
          </button>
        </form>

        <p
          onClick={resendOtp}
          className="cursor-pointer mt-6 text-center text-green-500 hover:text-green-400 transition text-sm sm:text-base"
        >
          Resend OTP
        </p>
      </div>
    </div>
  );
}

export default OTP;
