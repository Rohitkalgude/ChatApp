import React, { useState } from "react";
import Chatcontainer from "../components/Chatcontainer.jsx";
import Slider from "../components/Slider.jsx";
import Message from "../components/Message.jsx";

function Homepage() {
  const [selectdUser, setSelectdUser] = useState(null);

  return (
    <>
      <div className="flex h-screen w-screen bg-[#111]">
        <Slider />

        <div className="flex flex-1 bg-gray-100">
          <div className="w-[28%] min-w-[430px] bg-[#2d2d2d] border-r border-gray-900 shadow-xl shadow-black/40">
            <Chatcontainer onSelectUser={setSelectdUser} />
          </div>

          <div className=" flex-1 bg-[#1f1f1f]">
            {selectdUser ? (
              <Message user={selectdUser} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a user to start chatting 💬
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;
