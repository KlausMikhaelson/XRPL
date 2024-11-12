import React, { useContext } from "react";
import Profile from "../assets/learn.png";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const ChatProfile = (props) => {
  const {currentChat, setCurrentChat} = useContext(UserContext);
  const navigate = useNavigate();
  const handleClick = () => {
    // navigate(`/chats/${props.Link}`);
    setCurrentChat(props.walletAddress);
  };
  return (
    <div className="flex cursor-pointer gap-4 flex-row items-center justify-between text-slate-900 text-xl font-medium py-3 w-full md:w-96 md:pr-16 mt-1 bg-slate-200 drop-shadow-md rounded-lg">
      <div onClick={handleClick} className="flex items-center">
        <img
          src={props.Image}
          alt=""
          className="w-10 h-10 md:w-14 md:h-14 rounded-full mx-4"
        />
        <h1 onClick={handleClick} className="text-xl">
          {props.username}
        </h1>
      </div>
      <a target="_blank" href={`https://github.com/${props.username}`}>
        <img
          src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_1280.png"
          className="rounded-full h-10"
          alt="git"
        />
      </a>
    </div>
  );  
};

export default ChatProfile;
