import React from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

const CustomModal = ({ isOpen, closeModal }) => {
  const navigate = useNavigate();
  const handleDmClick = () => {
    navigate("/chats");
  }
  return (
    <Modal isOpen={isOpen}>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center drop-shadow-lg p-8 w-80 h-80 md:w-96 md:h-96 rounded-xl bg-slate-200">
        <h2 className="font-bold text-2xl text-slate-900 mb-4">
          Match Created Successfully!
        </h2>
        <p className="font-medium text-lg text-slate-800 text-center">
          You can now connect with your CodeBuddy
        </p>
        <div className="mt-10">
          <button
            onClick={handleDmClick}
            className="bg-[#ff8000] text-white font-bold text-xs rounded-full py-1 px-6 md:px-10 hover:bg-white hover:border-2 hover:border-[#ff8000] hover:text-[#ff8000]"
          >
            Chat
          </button>
          <button
            onClick={closeModal}
            className="bg-white text-[#ff8000] font-bold text-xs rounded-full py-1 px-6 md:px-10 ml-3 border-2 border-[#ff8000]"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
