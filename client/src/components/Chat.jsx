import React from "react";
import User from "../assets/heroimg.jpg";
import Textbubbles from "./Textbubbles";
const Chat = () => {
  return (
    <div className="w-[40rem] flex flex-col items-center justify-center mx-40">
      <div className="flex flex-row items-center justify-start w-full fixed px-96 py-4 brder-2">
        <img className="rounded-full w-12 h-12" src={User} />
      </div>
      <div className="flex flex-col items-center justify-end relative left-72">
        <Textbubbles />
      </div>
      <div className="absolute bottom-28">
        <input
          type="text"
          className="rounded-full text-slate-900 bg-slate-200 py-3 pl-3 pr-[40rem] w-[100%] focus:outline-none"
          placeholder="Write your message"
        />
      </div>
    </div>
  );
};

export default Chat;
