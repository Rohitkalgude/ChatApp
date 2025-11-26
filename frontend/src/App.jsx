import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Homepage from "./pages/Homepage.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import OTP from "./pages/OTP.jsx";
import ResetOTP from "./pages/ResetOTP.jsx";
import Resetpassword from "./pages/Resetpassword.jsx";
import NewPassword from "./pages/NewPassword.jsx";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/Homepage" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/resetotp" element={<ResetOTP />} />
          <Route path="/resetpassword" element={<Resetpassword />} />
          <Route path="/newPassword" element={<NewPassword />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
