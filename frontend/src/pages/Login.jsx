import React, { useContext, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

function Login() {
  const { loginUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await loginUser(formData.email, formData.password);

    if (res?.success) {
      navigate("/profile");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="bg-[#1f1f1f] p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md sm:max-w-md md:max-w-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-green-500 font-bold text-center mb-8 tracking-wide">
          QuickChat
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex items-center rounded-lg bg-[#2a2a2a] px-3 h-12 sm:h-14">
            <Mail className="text-green-400 w-5 h-5" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email(optional)"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-full pl-3 bg-transparent outline-none placeholder-gray-400 text-white text-base"
            />
          </div>

          <div className="flex items-center rounded-lg bg-[#2a2a2a] px-3 h-12 sm:h-14">
            <Lock className="text-green-400 w-5 h-5" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-full pl-3 bg-transparent outline-none placeholder-gray-400 text-white text-base"
            />
          </div>

          <Link
            to="/resetpassword"
            className="text-sm text-green-500 hover:text-green-400 cursor-pointer transition"
          >
            Forget password
          </Link>

          <button
            type="submit"
            className="w-full h-12 p-3 rounded-lg font-semibold bg-green-700 hover:bg-green-500 transition"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 text-sm sm:text-md md:text-md text-start mt-4">
          Don't have an account?{" "}
          <Link to="/" className="text-green-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
