import React, { useContext, useEffect, useRef, useState } from "react";
import { Send, Plus, Info, Trash2 } from "lucide-react";
import BgImage from "../assets/bg.jpg";
import { ChatContext } from "../Context/ChatContext";

function Message({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");

  const {
    messages,
    sendMessage,
    getMessage,
    deleteMessage,
    users,
  } = useContext(ChatContext);

  const scrollRef = useRef();

  // Fetch messages & mark as read
  useEffect(() => {
    if (user) getMessage(user._id);
  }, [user]);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !user) return;
    sendMessage(user._id, text);
    setText("");
  };

  const handleDelete = (messageId) => {
    deleteMessage(messageId);
  };

  const userStatus = users.find((u) => u._id === user?._id)?.online;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="p-4 bg-[#262626] border-b border-[#333] flex items-center justify-between text-white">
        <div onClick={() => setIsOpen(true)} className="flex items-center gap-3">
          <img
            src={BgImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h1 className="text-xl font-semibold">{user?.fullName || "Chat"}</h1>
            <span
              className={`text-xs ${
                userStatus ? "text-green-400" : "text-red-400"
              }`}
            >
              {userStatus ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <div className="p-2 rounded-full hover:bg-gray-700 cursor-pointer transition">
          <Info className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Info panel */}
      {isOpen && (
        <div className="fixed top-0 right-0 w-[350px] h-full bg-[#1c1c1c] text-white shadow-xl border-l border-gray-700 animate-slideLeft z-50">
          <div className="flex justify-between items-center p-4 border-b border-gray-600">
            <h2 className="text-xl font-semibold">Contact info</h2>
            <button onClick={() => setIsOpen(false)} className="text-xl">
              ✖
            </button>
          </div>
          <div className="flex flex-col items-center p-4">
            <img src={BgImage} className="w-24 h-24 rounded-full object-cover" />
            <h3 className="text-lg font-bold mt-3">{user?.fullName}</h3>
            <span
              className={`text-sm mt-1 ${
                userStatus ? "text-green-400" : "text-red-400"
              }`}
            >
              {userStatus ? "Online" : "Offline"}
            </span>
          </div>
          <div className="p-4">
            <h4 className="text-sm text-gray-300">About</h4>
            <p className="text-white mt-1">
              {user?.about || "Hey there! I am using this chat app."}
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#1d1d1d] relative">
        <img src={BgImage} className="absolute inset-0 w-full h-full opacity-5 object-cover" />
        <div className="relative space-y-5">
          {messages.map((msg) => (
            <div
              key={msg._id}
              ref={scrollRef}
              className={`flex items-end gap-2 ${
                msg.senderId === user?._id ? "justify-start" : "justify-end"
              }`}
            >
              {msg.senderId === user?._id && (
                <img src={BgImage} alt="User" className="w-9 h-9 rounded-full object-cover" />
              )}

              <div className={`relative max-w-[60%] p-3 rounded-2xl text-sm shadow
                ${msg.senderId === user?._id ? "bg-[#2d2d2d] text-gray-200 rounded-bl-none" : "bg-green-600 text-white rounded-br-none"}`}>
                <p>{msg.text}</p>
                <p className="text-[10px] text-gray-300 text-right mt-1">
                  {msg.seen ? "Seen" : "Delivered"}
                </p>

                {/* Delete button for own messages */}
                {msg.senderId !== user?._id && (
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {msg.senderId !== user?._id && (
                <img src={BgImage} alt="Me" className="w-9 h-9 rounded-full object-cover" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-[#262626] border-t border-[#333] flex items-center gap-3">
        <div className="p-1 rounded-full hover:bg-gray-700 cursor-pointer">
          <Plus className="text-gray-300 hover:text-white" />
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Send message"
          className="flex-1 p-3 pr-12 rounded-xl bg-[#333] text-white outline-none"
        />
        <Send
          onClick={handleSend}
          className="w-10 h-10 p-2 bg-green-500 rounded-full cursor-pointer hover:bg-green-600 text-black"
        />
      </div>
    </div>
  );
}

export default Message;
