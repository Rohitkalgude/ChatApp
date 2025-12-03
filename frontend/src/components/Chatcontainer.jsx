import React, { useContext, useEffect, useState } from "react";
import { MoreVertical, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Image1 from "../assets/icons8-chat-96 (1).png";
import { ChatContext } from "../Context/ChatContext";
import { AuthContext } from "../Context/AuthContext";

function Chatcontainer({ onSelectUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { users, unseensMessage, allUser, getMessage, markRead } =
    useContext(ChatContext);

  const { logoutUser, onlineUser } = useContext(AuthContext);

  useEffect(() => {
    allUser();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();

    await logoutUser();
    navigate("/login");
  };

  const handleSelect = (user) => {
    onSelectUser(user);
    getMessage(user._id);
  };

  const filterUser = users.filter((user) =>
    user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col text-white">
      <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <img
            src={Image1}
            alt="Quickchat"
            className="h-10 w-10 object-cover rounded-lg"
          />
          <h1 className="text-2xl font-semibold">Quickchat</h1>
        </div>
        <div className="flex items-center gap-3 relative">
          <MoreVertical
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-5 h-5 cursor-pointer hover:text-green-500 transition-colors"
          />
          {menuOpen && (
            <div className="absolute top-8 right-0 w-40 bg-[#2d2d2d] shadow-lg rounded-lg border border-[#444] p-2 z-50">
              <Link
                to="/profile"
                className="w-full text-left px-3 py-2 hover:bg-[#3b3b3b] rounded-md"
              >
                Edit Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 hover:bg-[#3b3b3b] rounded-md text-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center mt-3 mx-3 p-3 bg-[#1f1f1f] rounded-full">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search or start a new chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 w-full bg-transparent outline-none text-gray-200"
        />
      </div>

      <div className="mt-3 overflow-y-auto">
        {filterUser.length === 0 ? (
          <p className="text-center text-gray-400 mt-5">No users found</p>
        ) : (
          filterUser.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelect(user)}
              className="flex items-center gap-4 p-4 mx-2 rounded-xl cursor-pointer 
                       hover:bg-[#2a2a2a] transition-all"
            >
              <img
                src={user.profilePic}
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-lg font-medium">{user.fullName}</span>
                {onlineUser.includes(user._id) ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-neutral-400 text-xs">offline</span>
                )}
              </div>

              {unseensMessage[user._id] > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  {unseensMessage[user._id]}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Chatcontainer;
