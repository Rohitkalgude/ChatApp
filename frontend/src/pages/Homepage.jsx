import React, { useState } from "react";
import Chatcontainer from "../components/Chatcontainer.jsx";
import Slider from "../components/Slider.jsx";
import Message from "../components/Message.jsx";

function Homepage() {
  const [selectdUser, setSelectdUser] = useState(false);

  return (
    <>
      <div className="flex h-screen w-screen bg-[#111]">
        <Slider />

        <div className="flex flex-1 bg-gray-100">
          <div className="w-[28%] min-w-[430px] bg-[#2d2d2d] border-r border-gray-900 shadow-xl shadow-black/40">
            <Chatcontainer />
          </div>

          <div className="flex flex-1 bg-[#1f1f1f]">
            <Message />
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;
