import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function ResetOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRef = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRef.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").slice(0, 6);

    if (!/^[0-9]+$/.test(pasteData)) return;

    const pasteArray = pasteData.split("");
    const newOtp = [...otp];

    pasteArray.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });

    setOtp(newOtp);

    inputRef.current[pasteArray.length - 1].focus();
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    const ForgetpasswordData = JSON.parse(
      localStorage.getItem("ForgetPassword")
    );

    if (!ForgetpasswordData) {
      toast.error("Email not found, please start password reset again");
      return;
    }

    if (otpString.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    try {
      const body = { email: ForgetpasswordData.email, emailOtp: otpString };

      const result = await axios.post(
        "http://localhost:7000/api/v1/auth/verifyPasswordOtp",
        body
      );

      toast.success(result.data.message || "OTP verified successfully");

      localStorage.setItem(
        "ForgetPassowordVerfiy",
        JSON.stringify({
          email: ForgetpasswordData.email,
          token: result.data.data.resetToken,
        })
      );

      navigate("/newpassword");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="bg-[#181818] p-6 sm:p-8 md:p-10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-full max-w-md sm:max-w-md md:max-w-md border border-[#2a2a2a] text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-500 mb-6">
          Verify OTP
        </h1>

        <form
          onSubmit={verifyOtp}
          className="flex flex-col items-center gap-6 sm:gap-8"
        >
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 flex-nowrap overflow-x-auto no-scrollbar">
            {otp.map((value, i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                ref={(el) => (inputRef.current[i] = el)}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#242424] text-white text-center text-lg font-semibold rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-500 transition duration-200 shadow-md"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetOTP;
