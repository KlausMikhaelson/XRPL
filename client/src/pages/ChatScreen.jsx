import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {ChatUIProvider, ChatView} from "@pushprotocol/uiweb";

const messagesCollection = collection(db, "messages");

const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const { id } = useParams();
  const { currentUserMessageList, setCurrentUserMessageList, currentChat, setCurrentChat, walletAddress, signer } =
    useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (
(      currentUserMessageList &&
      currentUserMessageList.messageArrays?.includes(id) || (currentChat && id === "helloworld-randomid"))
    ) {
      console.log("Good")
    } else {
      navigate("/chats");
    }
  }, [id, currentUserMessageList, navigate]);

  return (
    <div className="h-[90vh] flex items-center justify-center">
    <ChatUIProvider env="prod" account={walletAddress ? walletAddress : "0x7EED0188B8E25Ea6a121071980a13333098EA7A0"} signer={signer}>
    <div className="h-[80vh] flex w-[80%] m-auto items-center justify-center">
      <ChatView chatId={currentChat} />
    </div>
    </ChatUIProvider>
    </div>
  );
};

export default ChatScreen;
