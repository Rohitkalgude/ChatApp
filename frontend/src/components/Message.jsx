import React, { useState } from "react";
import { Send, Plus, Info } from "lucide-react";
import BgImage from "../assets/bg.jpg";

function Message() {
  const [isOpen, setisOpen] = useState(false);

  const messages = [
    {
      id: 1,
      text: "Hey bro! How are you?",
      profilePic: BgImage,
      sender: "other",
      time: "10:05 AM",
    },
    {
      id: 2,
      text: "I'm good! What about you?",
      profilePic: BgImage,
      sender: "me",
      time: "10:06 AM",
    },
    {
      id: 3,
      text: "All good! Working on React project.",
      profilePic: BgImage,
      sender: "other",
      time: "10:07 AM",
    },
    {
      id: 4,
      text: "Nice! Show me when it's done.",
      profilePic: BgImage,
      sender: "me",
      time: "10:08 AM",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-4 bg-[#262626] border-b border-[#333] flex items-center justify-between text-white">
        <div
          onClick={() => setisOpen(true)}
          className="flex items-center gap-3"
        >
          <img
            src={BgImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h1 className="text-xl font-semibold">Rohit</h1>
        </div>

        <div className="p-2 rounded-full hover:bg-gray-700 cursor-pointer transition">
          <Info className="w-5 h-5 text-white" />
        </div>
      </div>

      {isOpen && (
        <div className="fixed top-0 right-0 w-[350px] h-full bg-[#1c1c1c] text-white shadow-xl border-l border-gray-700 animate-slideLeft z-50">
          <div className="flex justify-between items-center p-4 border-b border-gray-600">
            <h2 className="text-xl font-semibold">Contact info</h2>
            <button onClick={() => setisOpen(false)} className="text-xl">
              ✖
            </button>
          </div>

          <div className="flex flex-col items-center p-4">
            <img
              src={BgImage}
              className="w-24 h-24 rounded-full object-cover"
            />
            <h3 className="text-lg font-bold mt-3">Rohit</h3>
            <p className="text-gray-400 mt-1">+91 98765 43210</p>
          </div>

          <div className="p-4">
            <h4 className="text-sm text-gray-300">About</h4>
            <p className="text-white mt-1">
              Hey there! I am using this chat app.
            </p>
          </div>

          <div className="p-4">
            <h4 className="text-sm text-gray-300 mb-3">
              Media, links and docs
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <img
                src={BgImage}
                className="w-full h-20 rounded-lg object-cover"
              />
              <img
                src={BgImage}
                className="w-full h-20 rounded-lg object-cover"
              />
              <img
                src={BgImage}
                className="w-full h-20 rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5 bg-[#1d1d1d] relative">
        <img
          src={BgImage}
          className="absolute inset-0 w-full h-full opacity-5 object-cover"
        />

        <div className="relative space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "other" && (
                <img
                  src={msg.profilePic}
                  alt="User"
                  className="w-9 h-9 rounded-full object-cover"
                />
              )}

              <div
                className={`max-w-[60%] p-3 rounded-2xl text-sm shadow 
                  ${
                    msg.sender === "me"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-[#2d2d2d] text-gray-200 rounded-bl-none"
                  }
                `}
              >
                <p>{msg.text}</p>
                <p className="text-[10px] text-gray-300 text-right mt-1">
                  {msg.time}
                </p>
              </div>

              {msg.sender === "me" && (
                <img
                  src={msg.profilePic}
                  alt="Me"
                  className="w-9 h-9 rounded-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#262626] border-t border-[#333] flex items-center gap-3">
        <div className="p-1 rounded-full hover:bg-gray-700 cursor-pointer">
          <Plus className="text-gray-300 hover:text-white" />
        </div>
        <div className="relative w-full flex items-center">
          <input
            type="text"
            placeholder="Send message"
            className="w-full p-3 pr-12 rounded-xl bg-[#333] text-white outline-none"
          />
        </div>

        <Send className="w-10 h-10 p-2 bg-green-500 rounded-full cursor-pointer hover:bg-green-600 text-black" />
      </div>
    </div>
  );
}

export default Message;
