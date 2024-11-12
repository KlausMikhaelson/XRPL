import React, { useEffect } from "react";
import ChatProfile from "./Mail";
import axios from "axios";
import { backendUrl } from "../App";
import { useState, useContext } from "react";
import { UserContext } from "../App";
import { auth } from "../firebase/firebase";
import { useMagic, useWallet } from "@thirdweb-dev/react";
import { useConnect, useSigner, useAddress } from "@thirdweb-dev/react";
import ReactModal from "react-modal";
import { IoMdChatbubbles } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { ChatUIProvider, ChatView } from "@pushprotocol/uiweb";
import { PushChatTheme } from "./ChatTheme";

const Maillist = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const { currentUserMessageList, setCurrentUserMessageList, currentUser, currentChat, setCurrentChat, walletAddress, signer } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("first_time_chat")) {
      return;
    } else {
      setShowModal(true);
    }
  }, [])

  const getMatchedUsers = async () => {
    setLoading(true);
    const cleanToken = localStorage.getItem("dynamic_authentication_token").slice(1, -1);
    try {
      const response = await axios.get(
        `${backendUrl}/api/auth/getmatchedUsers`,
        {
          headers: {
            username: currentUser.username,
            email: currentUser.email,
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      setMatchedUsers(response.data.matchedUserData.map((user) => user));
      if (currentUserMessageList.length === 0) {
        setCurrentUserMessageList(response.data.currentUserData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching matched users:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem("first_time_chat", true);
  }

  useEffect(() => {
    if (currentUser) {
      getMatchedUsers();
    }
  }, [currentUser]);

  return (
    <div className="flex flex-col items-center justify-center">
      <ReactModal className="mt-20" isOpen={showModal} onRequestClose={handleCloseModal}>
        <div className="">
          <div className="flex items-center justify-between">
            <IoMdChatbubbles />
            <IoClose className="cursor-pointer" onClick={handleCloseModal} />
          </div>
          <div className="flex items-center h-[80vh] justify-center flex-col gap-2 p-4 text-center">
            <h1>
              Welcome to chats.
            </h1>
            <p>
              You can chat with other developers with whom you have matched with.
            </p>
            <p>There is a public group too which you can join and interact in.</p>
            <p>In order to get started, when you click on any of the chat it will ask you to do a sign where you have to set up your passkey, you will be needed to do the signature twice for the first time since it will be creating a push profile for your new wallet and after that you only have to sign once</p>
          </div>
        </div>
      </ReactModal>
      <div className="flex flex-wrap items-center justify-center">
        <div className="mt-24 md:mt-20 sm:mt-20">
          <div className="flex flex-row items-center justify-start text-white text-xl font-medium py-2 w-96 bg-slate-900 drop-shadow-md m-auto rounded-lg">
            <h1 className="ml-10 items-center my-3">Direct Messages</h1>
          </div>
          <div className="m-4 ">
            <ChatProfile
              walletAddress={"786f61c51d436d5a4a02ddb8553ebb4496d909a054eed87967e780531db7960f"}
              Image={"https://img.freepik.com/free-vector/laptop-with-program-code-isometric-icon-software-development-programming-applications-dark-neon_39422-971.jpg?size=626&ext=jpg&ga=GA1.1.1546980028.1703548800&semt=sph"}
              username={"Code Connect"}
              Link={"helloworld-randomid"}
            />
          </div>
          <div className="h-[70vh] overflow-y-scroll">
            {matchedUsers.length > 0 ? (
              matchedUsers.map((matcheduser) => (
                <div key={matcheduser._id} className="cursor-pointer m-4">
                  <ChatProfile
                    walletAddress={matcheduser.walletAddress}
                    username={matcheduser.username}
                    Image={matcheduser.Image}
                    Link={matcheduser.commonMessageIds}
                  />
                </div>
              ))
            ) : loading ? (
              <div className="flex w-[50vw] items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-slate-900 mt-40">
                  No messages yet
                </h1>
              </div>
            )}
          </div>

        </div>
        {currentChat && (
          <ChatUIProvider theme={PushChatTheme} env="prod" account={walletAddress ? walletAddress : "0x7EED0188B8E25Ea6a121071980a13333098EA7A0"} signer={signer}>
            <div className="h-[70vh] flex w-[95%] sm:w-[50vw] mt-4 items-center justify-center">
              <ChatView chatId={currentChat} />
            </div>
          </ChatUIProvider>
        )}
      </div>
    </div>
  );
};

export default Maillist;
