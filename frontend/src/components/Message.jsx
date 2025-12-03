import React, { useContext, useEffect, useRef, useState } from "react";
import { Send, Plus, Info, MoreVertical, Copy, Trash2 } from "lucide-react";
import BgImage from "../assets/bg.jpg";
import { ChatContext } from "../Context/ChatContext";
import { AuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";

function Message({ user }) {
  const [isOpen, setisOpen] = useState(false);
  const [text, setText] = useState("");
  const [selectedMsg, setSelectedMsg] = useState(null);

  const { messages, sendMessage, getMessage, deleteMessage, } =
    useContext(ChatContext);
  const scrollRef = useRef();

  const { onlineUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) getMessage(user._id);
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (image = null) => {
    if (!text.trim() && !image) return;
    sendMessage(user._id, text, image);
    setText("");
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select and image file");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      handleSend({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (messageId) => {
    deleteMessage(messageId);
  };

  useEffect(() => {
    const close = () => setSelectedMsg(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-4 bg-[#262626] border-b border-[#333] flex items-center justify-between text-white">
        <div
          onClick={() => setisOpen(true)}
          className="flex items-center gap-4 cursor-pointer"
        >
          <img
            src={user?.profilePic}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">
              {user?.fullName || "Chat"}
            </h1>
            {onlineUser.includes(user?._id) ? (
              <span className="text-green-400 text-xs">Online</span>
            ) : (
              <span className="text-neutral-400 text-xs">offline</span>
            )}
          </div>
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
            <h3 className="text-lg font-bold mt-3">{user?.fullName}</h3>
          </div>

          <div className="p-4">
            <h4 className="text-sm text-gray-300">About</h4>
            <p className="text-white mt-1">
              {user?.about || "Hey there! I am using this chat app."}
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
          {messages.map((msg, i) => (
            <div
              key={msg._id || i}
              ref={i === messages.length - 1 ? scrollRef : null}
              className={`flex items-end gap-2 ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Message Bubble */}
              <div
                className={`relative max-w-[60%] p-3 rounded-2xl text-sm shadow mt-10 flex justify-between ${
                  msg.sender === "me"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-[#2d2d2d] text-gray-200 rounded-bl-none"
                } group`} // <-- add 'group' for hover handling
              >
                <p>{msg.text}</p>

                <div className="flex flex-col items-center relative ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Three-dot Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMsg(selectedMsg === msg._id ? null : msg._id);
                    }}
                    className="text-gray-500 hover:text-white transition cursor-pointer"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                {msg.sender === "me" && (
                  <span className="absolute bottom-1 right-2 text-xs text-gray-200">
                    {msg.seen ? "✓✓" : "✓"}
                  </span>
                )}

                {/* Options Menu */}
                {selectedMsg === msg._id && (
                  <div
                    className="absolute min-w-[120px] bg-[#2a2a2a] text-white rounded-lg shadow-lg border border-gray-700 z-50 overflow-hidden animate-fadeIn"
                    style={{
                      top: "32px",
                      right: msg.sender === "me" ? "0px" : "auto",
                      left: msg.sender === "other" ? "0px" : "auto",
                    }}
                  >
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-600 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(msg.text);
                        setSelectedMsg(null);
                      }}
                    >
                      <Copy size={16} /> Copy
                    </button>

                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-600 transition-colors"
                      onClick={() => {
                        handleDelete(msg._id);
                        setSelectedMsg(null);
                      }}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#262626] border-t border-[#333] flex items-center gap-3">
        <label className="p-1 rounded-full hover:bg-gray-700 cursor-pointer">
          <Plus className="text-gray-300 hover:text-white" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />
        </label>
        <div className="relative w-full flex items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Send message"
            className="w-full p-3 pr-12 rounded-xl bg-[#333] text-white outline-none"
          />
        </div>

        <button
          onClick={handleSend}
          className="w-10 h-10 p-2 bg-green-500 rounded-full cursor-pointer hover:bg-green-600 text-black"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default Message;
