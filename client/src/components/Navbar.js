import React, { useEffect, useContext, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { UserContext, backendUrl } from "../App";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useUserWallets } from '@dynamic-labs/sdk-react-core'
import ReactModal from "react-modal";
import { FaFire, FaFireBurner, FaRegClosedCaptioning } from "react-icons/fa6";
import { AiFillCloseCircle, AiFillCloseSquare } from "react-icons/ai";
import { IoMdChatbubbles } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import Logo from "../assets/newlogo.png";
import { CiChat1 } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaWpexplorer } from "react-icons/fa";


const Navbar = () => {
  const { users, setUsers, currentUser, setCurrentUser, signer, setSinger, walletAddress, setWalletAddress } =
    useContext(UserContext);
  const navigate = useNavigate();
  const id = window.location.pathname
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [show, setShow] = useState(null);
  const [profile, setProfile] = useState(false);
  const [product, setProduct] = useState(false);
  const [deliverables, setDeliverables] = useState(false);
  const { user, primaryWallet } = useDynamicContext();
  const userWallet = useUserWallets();

  useEffect(() => {
    const fetchData = async () => {
      let address;
      for (let i = 0; i < user?.verifiedCredentials.length; i++) {
        if (user?.verifiedCredentials[i].address) {
          address = user?.verifiedCredentials[i].address;
          break;
        } else if (user?.verifiedCredentials[i].publicIdentifier) {
          address = user?.verifiedCredentials[i].publicIdentifier;
          break;
        }
      }

      let verifiedCredentialsEmail;
      for (let i = 0; i < user?.verifiedCredentials.length; i++) {
        if (user?.verifiedCredentials[i].email) {
          verifiedCredentialsEmail = user?.verifiedCredentials[i].email;
          break;
        }
      }

      const email = verifiedCredentialsEmail;

      let oauthMetadata = {};
      for (let i = 0; i < user?.verifiedCredentials.length; i++) {
        if (user?.verifiedCredentials[i].oauthMetadata) {
          oauthMetadata = user?.verifiedCredentials[i].oauthMetadata;
          break;
        }
      }

      if (Object.keys(oauthMetadata).length === 0) {
        try {
          let userNameofUser;
          for (let i = 0; i < user?.verifiedCredentials.length; i++) {
            if (user?.verifiedCredentials[i].oauthUsername) {
              userNameofUser = user?.verifiedCredentials[i].oauthUsername;
              break;
            }
          }

          const response = await axios.get(`https://api.github.com/users/${userNameofUser}`);
          const githubUserData = response.data;

          oauthMetadata = {
            followers: githubUserData.followers,
            following: githubUserData.following,
            location: githubUserData.location,
            twitter_username: githubUserData.twitter_url,
            avatar_url: githubUserData.avatar_url,
            company: githubUserData.company,
            bio: githubUserData.bio,
            organizations_url: githubUserData.organizations_url,
            login: githubUserData.login,
            id: githubUserData.id,
          };

        } catch (err) {
          console.error(err);
        }
      }

      if (Object.keys(oauthMetadata).length !== 0) {
        setUsers({ ...oauthMetadata, email, address });
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const addUserToServer = async (userData) => {
    const cleanToken = localStorage.getItem("dynamic_authentication_token").slice(1, -1);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/addUser`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `${cleanToken}`,
          },
        }
      );

      console.log("response", response);

      // Check if the response is successful before showing the success toast
      if (response.status === 200 || response.status === 201) {
        toast.success("Account Created Successfully");
      } else if (response.status === 409) {
        return;
      }
    } catch (error) {
      if (error.status === 409) {
        return;
      }
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("iddd", id)
    if (users.email) {
      getCurrentUser({ email: users.email });
    }
  }, [users])

  useEffect(() => {
    const signMessage = async () => {
      const signer = await primaryWallet.connector.getSigner();
      return signer;
    }
    userWallet.map((wallet) => {
      setWalletAddress(wallet.address);
    })
    // setTimeout(() => {
    if (primaryWallet && Object.keys(signer).length === 0) {
      signMessage().then((signMessage) => {
        setSinger(signMessage);
        return signMessage;
      }).catch((error) => {
        console.error(error);
      })
    }
    // }, 5000);
  }, [primaryWallet])

  const getCurrentUser = async ({ email }) => {
    // Get the token without double quotes
    const token = localStorage.getItem("dynamic_authentication_token");
    const cleanToken = token ? token.slice(1, -1) : "";

    await axios.get(`${backendUrl}/api/auth/getcurrentuser`, {
      headers: {
        authorization: `Bearer ${cleanToken}`,
        email: email
      },
    }).then((response) => {
      setCurrentUser(response.data.updatedUser);
    }).catch((error) => {
      console.error(error);

    });
  }


  useEffect(() => {
    if (Object.keys(users).length !== 0) {
      addUserToServer({ users });
    }
  }, [users]);

  //     <ToastContainer />
  //     <div className="bg-slate-900 text-white px-4 py-3 md:px-28">
  //       <div className="flex justify-between items-center w-full">
  //         <button
  //           className="block md:hidden text-white"
  //           onClick={toggleMenu}
  //           aria-label="Toggle menu"
  //         >
  //           <svg
  //             className="h-6 w-6 fill-current absolute top-6 left-4"
  //             xmlns="http://www.w3.org/2000/svg"
  //             viewBox="0 0 24 24"
  //           >
  //             {menuOpen ? (
  //               <path
  //                 fillRule="evenodd"
  //                 clipRule="evenodd"
  //                 d="M6.293 5.293a1 1 0 011.414 0L12 9.586l4.293-4.293a1 1 0 111.414 1.414L13.414 12l4.293 4.293a1 1 0 01-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 12 6.293 7.707a1 1 0 010-1.414z"
  //               />
  //             ) : (
  //               <path
  //                 fillRule="evenodd"
  //                 clipRule="evenodd"
  //                 d="M3 4a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1z"
  //               />
  //             )}
  //           </svg>
  //         </button>
  //         <ul
  //           className={`${menuOpen
  //             ? "flex flex-col mt-10 md:flex-row gap-4 items-center justify-center"
  //             : "hidden"
  //             } md:flex gap-4 items-center justify-center`}
  //         >
  //           <li className="hover:text-gray-300 gap-1 flex cursor-pointer font-bold">
  //             <a onClick={() => {
  //               navigate("/");
  //             }}>Home</a>
  //             <FaHome className="mt-1" />
  //           </li>
  //           {Object.keys(currentUser).length > 0 && (
  //             <>
  //               <li className="hover:text-gray-300 gap-1 flex cursor-pointer font-bold">
  //                 <a onClick={() => {
  //                   navigate("/chats");
  //                 }}>Chats</a>
  //                 <IoMdChatbubbles className="mt-1" />
  //               </li>

  //               <li className="hover:text-gray-300 gap-1 flex cursor-pointer font-bold" onClick={handleGotoDashboard}>
  //                 <a>Match</a>
  //                 <FaFire className="mt-1" />
  //               </li>
  //             </>
  //           )}
  //         </ul>
  //         <ul className={`flex`}>
  //           <li className="hover:text-[#ff8000] items-center rounded-lg p-2 text-xl font-bold ">
  //             <DynamicWidget />
  //           </li>
  //           {currentUser.Image ? (
  //             <li className="hover:text-[#ff8000] rounded-lg p-2 text-xl font-bold ">
  //               <img
  //                 src={currentUser.Image} alt="Logo" className="h-10 rounded-full w-10" />
  //             </li>
  //           ) : (
  //             <li className="hover:text-[#ff8000] rounded-lg p-2 text-xl font-bold ">
  //               <img src="https://imgs.search.brave.com/dke4p7wvX5U2S2aMFUJRammXaUAizpC9SUcW8O-egOY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvY29v/bC1wcm9maWxlLXBp/Y3R1cmUtcTlpMmd2/Y3Jza3hlZmJlOS5q/cGc" alt="Logo" className="h-10 rounded-full w-10" />
  //             </li>
  //           )}
  //         </ul>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <>
      <div className="bg-gray-200 h-full w-full">
        <ToastContainer />
        <nav className="bg-white shadow xl:block hidden">
          <div className="mx-auto container px-6 py-2 xl:py-0">
            <div className="flex items-center justify-between">
              <div className="inset-y-0 left-0 flex items-center xl:hidden">
                <div className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-100 focus:outline-none transition duration-150 ease-in-out">
                  <div className="visible xl:hidden">
                    <ul className="p-2 border-r bg-white absolute rounded left-0 right-0 shadow mt-8 md:mt-8 hidden">
                      <li onClick={() => {
                        navigate("/match");
                      }} className="flex xl:hidden cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-2 py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-grid" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <rect x={4} y={4} width={6} height={6} rx={1} />
                            <rect x={14} y={4} width={6} height={6} rx={1} />
                            <rect x={4} y={14} width={6} height={6} rx={1} />
                            <rect x={14} y={14} width={6} height={6} rx={1} />
                          </svg>
                          <span className="ml-2 font-bold">Match</span>
                        </div>
                      </li>
                      <li onClick={() => {
                        navigate("/explore");
                      }} className="flex xl:hidden cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-2 py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                        <div className="flex items-center">
                          <FaWpexplorer className="text-xl" />
                          <span className="ml-2 font-bold">Explore</span>
                        </div>
                      </li>
                      {/* <li className="flex xl:hidden flex-col cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none flex justify-center">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-puzzle" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" />
                          </svg>
                          <span className="ml-2 font-bold">Products</span>
                        </div>
                      </li> */}
                      <li className="flex xl:hidden cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 flex items-center focus:text-indigo-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-compass" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <polyline points="8 16 10 10 16 8 14 14 8 16" />
                          <circle cx={12} cy={12} r={9} />
                        </svg>
                        <span className="ml-2 font-bold">Performance</span>
                      </li>
                      <li className="border-b border-gray-300 flex xl:hidden cursor-pointer text-gray-600 text-sm leading-3 tracking-normal pt-2 pb-4 hover:text-indigo-700 flex items-center focus:text-indigo-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-code" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <polyline points="7 8 3 12 7 16" />
                          <polyline points="17 8 21 12 17 16" />
                          <line x1={14} y1={4} x2={10} y2={20} />
                        </svg>
                        <span className="ml-2 font-bold">Deliverables</span>
                      </li>
                      <li className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-2 py-2 hover:text-indigo-700 flex items-center focus:text-indigo-700 focus:outline-none">
                        <div className="flex items-center">
                          <div className="w-12 cursor-pointer flex text-sm border-2 border-transparent rounded focus:outline-none focus:border-white transition duration-150 ease-in-out">
                            <img className="rounded h-10 w-10 object-cover" src="https://tuk-cdn.s3.amazonaws.com/assets/components/horizontal_navigation/hn_1.png" alt="logo" />
                          </div>
                          <p className="text-sm ml-2 cursor-pointer">Jane Doe</p>
                          <div className="sm:ml-2 text-white relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-down cursor-pointer" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" />
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </div>
                        </div>
                      </li>
                      <li className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <circle cx={12} cy={7} r={4} />
                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                          </svg>
                          <span className="ml-2">Profile</span>
                        </div>
                      </li>
                    </ul>
                    <svg onclick="MenuHandler(this,true)" aria-haspopup="true" aria-label="Main Menu" xmlns="http://www.w3.org/2000/svg" className="show-m-menu icon icon-tabler icon-tabler-menu" width={28} height={28} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <line x1={4} y1={8} x2={20} y2={8} />
                      <line x1={4} y1={16} x2={20} y2={16} />
                    </svg>
                  </div>
                  <div className="hidden close-m-menu text-gray-700" onclick="MenuHandler(this,false)">
                    <svg aria-label="Close" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <line x1={18} y1={6} x2={6} y2={18} />
                      <line x1={6} y1={6} x2={18} y2={18} />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex w-full sm:w-auto items-center sm:items-stretch justify-end sm:justify-start">
                <div className="flex items-center">
                  <h2 onClick={() => navigate("/")} className="text-base cursor-pointer text-gray-700 flex font-bold leading-normal pl-3"><small className="bg-[#FFA500] px-1 rounded-md text-base text-gray-700 font-bold">Dev</small><small className="text-base text-gray-700 font-bold">Match</small></h2>
                </div>
              </div>
              <div className="flex">
                <div className="hidden xl:flex md:mr-6 xl:mr-16">
                  <a onClick={() => {
                    navigate("/");
                  }} href="javascript: void(0)" className="flex px-5 items-center py-6 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                    <span className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-grid" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <rect x={4} y={4} width={6} height={6} rx={1} />
                        <rect x={14} y={4} width={6} height={6} rx={1} />
                        <rect x={4} y={14} width={6} height={6} rx={1} />
                        <rect x={14} y={14} width={6} height={6} rx={1} />
                      </svg>
                    </span>
                    Home
                  </a>
                  <a onClick={() => navigate("/chats")} href="javascript: void(0)" className="flex px-5 items-center py-6 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                    <CiChat1 className="mr-2 text-xl" />
                    Chats
                  </a>
                  <a onClick={() => {
                    navigate("/match");
                  }} href="javascript: void(0)" className="flex px-5 items-center py-6 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                    <span className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-code" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <polyline points="7 8 3 12 7 16" />
                        <polyline points="17 8 21 12 17 16" />
                        <line x1={14} y1={4} x2={10} y2={20} />
                      </svg>
                    </span>
                    Match
                  </a>
                  <a onClick={() => {
                    navigate("/get-paid");
                  }} href="javascript: void(0)" className="flex px-5 items-center py-6 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                    <GiTakeMyMoney className="mr-2 text-xl" />
                    Get Paid
                  </a>
                  <a onClick={() => {
                    navigate("/explore");
                  }} href="javascript: void(0)" className="flex px-5 items-center py-6 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                    <FaWpexplorer className="mr-2 text-xl" />
                    Explore
                  </a>
                  <a className="flex px-5 items-center py-6 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                    <DynamicWidget />
                  </a>
                  {/* <a onClick={() => navigate("/hackathons")}
                    href="javascript: void(0)" className="flex px-5 items-center py-6 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                    <FaFire className="mr-2 text-xl" />
                    Hackathons
                  </a> */}
                </div>
                <div className="hidden xl:flex items-center">
                  <div className="ml-6 relative">
                    {currentUser.Image && (
                      <div className="flex items-center relative" onClick={() => setProfile(!profile)}>
                        {/* here we will be adding edit profile soon */}
                        {profile && (
                          <ul className="p-2 z-[9999] w-40 border-r bg-white absolute rounded right-0 shadow top-0 mt-16 ">
                            <li onClick={() => navigate("/myprofile")} className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                              <div className="flex items-center">
                                <CgProfile className="text-xl" />
                                <span className="ml-2">My Profile</span>
                              </div>
                            </li>
                          </ul>
                        )}
                        <div onClick={() => setProfile(!profile)} className="cursor-pointer mr-2 flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out">
                          <img src={currentUser.Image ? currentUser.Image : "https://static-00.iconduck.com/assets.00/web-developer-illustration-2005x2048-fal2biag.png"} alt="Logo" className="h-10 rounded-full w-10" />
                        </div>
                        <div className="ml-2 text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-down cursor-pointer" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <nav>
          <div className="py-4 px-6 w-full flex xl:hidden justify-between items-center bg-white fixed top-0 z-40">
            <h2 onClick={() => navigate("/")} className="cursor-pointer text-base text-gray-700 flex font-bold leading-normal pl-3"><small className="bg-[#FFA500] px-1 rounded-md text-base text-gray-700 font-bold">Dev</small><small className="text-base text-gray-700 font-bold">Match</small></h2>
            {currentUser.Image && (
              <div className="flex items-center">
                <img src={currentUser.Image ? currentUser.Image : "https://static-00.iconduck.com/assets.00/web-developer-illustration-2005x2048-fal2biag.png"} alt="Logo" className="h-10 rounded-full w-10 mr-2" />
                <div id="menu" className="text-gray-800 cursor-pointer" onClick={() => setShow(!show)}>
                  {show ? (
                    ""
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-menu-2" width={24} height={24} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1={4} y1={6} x2={20} y2={6} />
                      <line x1={4} y1={12} x2={20} y2={12} />
                      <line x1={4} y1={18} x2={20} y2={18} />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>
          {/*Mobile responsive sidebar*/}
          <div className={show ? "w-full xl:hidden h-full absolute z-40  transform  translate-x-0 " : "   w-full xl:hidden h-full absolute z-40  transform -translate-x-full"}>
            <div className="bg-gray-800 opacity-50 w-full h-full" onClick={() => setShow(!show)} />
            <div className="w-64 z-40 fixed overflow-y-auto z-40 top-0 bg-white shadow h-full flex-col justify-between xl:hidden pb-4 transition duration-150 ease-in-out">
              <div className="px-6 h-full">
                <div className="flex flex-col justify-between h-full w-full">
                  <div>
                    <div className="mt-6 flex w-full items-center justify-between">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <h2 onClick={() => navigate("/")} className="text-base cursor-pointer text-gray-700 flex font-bold leading-normal pl-3"><small className="bg-[#FFA500] px-1 rounded-md text-base text-gray-700 font-bold">Dev</small><small className="text-base text-gray-700 font-bold">Match</small></h2>
                        </div>
                        <div id="cross" className="text-gray-800" onClick={() => setShow(!show)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x" width={24} height={24} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1={18} y1={6} x2={6} y2={18} />
                            <line x1={6} y1={6} x2={18} y2={18} />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <ul className="f-m-m">
                      <a className="cursor-pointer">
                        <li onClick={() => {
                          navigate("/");
                        }} className="text-gray-800 pt-10">
                          <div className="flex items-center">
                            <div className={`${id === "/" ? "w-6 h-6 md:w-8 md:h-8 text-indigo-700" : "w-6 h-6 md:w-8 md:h-8 text-gray-800"}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-grid" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <rect x={4} y={4} width={6} height={6} rx={1} />
                                <rect x={14} y={4} width={6} height={6} rx={1} />
                                <rect x={4} y={14} width={6} height={6} rx={1} />
                                <rect x={14} y={14} width={6} height={6} rx={1} />
                              </svg>
                            </div>
                            <p className={`${id === "/" ? "text-indigo-700 xl:text-base text-base ml-3" : "text-gray-800 xl:text-base md:text-2xl text-base ml-3"}`}>Home</p>
                          </div>
                        </li>
                      </a>
                      <a onClick={() => navigate("/chats")} className="cursor-pointer">
                        <li className="text-gray-800 pt-8">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-6 h-6 md:w-8 md:h-8 text-gray-800">
                                <CiChat1 className={`${id === "/chats" ? "w-6 h-6 md:w-8 md:h-8 text-indigo-700" : "w-6 h-6 md:w-8 md:h-8 text-gray-800"}`} />
                              </div>
                              <p className={`${id === "/chats" ? "text-indigo-700 xl:text-base text-base ml-3" : "text-gray-800 xl:text-base md:text-2xl text-base ml-3"}`}>Chats</p>
                            </div>
                          </div>
                        </li>
                      </a>
                      <a onClick={() => {
                        navigate("/match");
                      }} className="cursor-pointer">
                        <li className="text-gray-800 pt-8 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`${id === "/match" ? "w-6 h-6 md:w-8 md:h-8 text-indigo-700" : "w-6 h-6 md:w-8 md:h-8 text-gray-800"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-code" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path stroke="none" d="M0 0h24v24H0z" />
                                  <polyline points="7 8 3 12 7 16" />
                                  <polyline points="17 8 21 12 17 16" />
                                  <line x1={14} y1={4} x2={10} y2={20} />
                                </svg>
                              </div>
                              <p className={`${id === "/match" ? "text-indigo-700 xl:text-base text-base ml-3" : "text-gray-800 xl:text-base md:text-2xl text-base ml-3"}`}>Match</p>
                            </div>
                          </div>
                        </li>
                      </a>
                      <a onClick={() => {
                        navigate("/myprofile");
                      }} className="cursor-pointer">
                        <li className="text-gray-800 pt-8 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-6 h-6 md:w-8 md:h-8 text-gray-800">
                                <CgProfile className={`${id === "/myprofile" ? "w-6 h-6 md:w-8 md:h-8 text-indigo-700" : "w-6 h-6 md:w-8 md:h-8 text-gray-800"}`} />
                              </div>
                              <p className={`${id === "/myprofile" ? "text-indigo-700 xl:text-base text-base ml-3" : "text-gray-800 xl:text-base md:text-2xl text-base ml-3"}`}>Profile</p>
                            </div>
                          </div>
                        </li>
                      </a>
                      <a onClick={() => {
                        navigate("/get-paid")
                      }}>
                        <li className="text-gray-800 pt-8 cursor-pointer">
                          <div className="flex items-center">
                            <GiTakeMyMoney className={`${id === "/get-paid" ? "w-6 h-6 md:w-8 md:h-8 text-indigo-700" : "w-6 h-6 md:w-8 md:h-8 text-gray-800"}`} />
                            <p className={`${id === "/get-paid" ? "text-indigo-700 xl:text-base text-base ml-3" : "text-gray-800 xl:text-base md:text-2xl text-base ml-3"}`}>Get Paid</p>
                          </div>
                        </li>
                      </a>
                      <a onClick={() => {
                        navigate("/explore");
                      }} className="cursor-pointer">
                        <li className="text-gray-800 pt-8 cursor-pointer">
                          <div className="flex items-center">
                            <FaWpexplorer className={`${id === "/explore" ? "w-6 h-6 md:w-8 md:h-8 text-indigo-700" : "w-6 h-6 md:w-8 md:h-8 text-gray-800"}`} />
                            <p className={`${id === "/explore" ? "text-indigo-700 xl:text-base text-base ml-3" : "text-gray-800 xl:text-base md:text-2xl text-base ml-3"}`}>Explore</p>
                          </div>
                        </li>
                      </a>
                      <a
                        className="cursor-pointer"
                      >
                        <li
                          className="text-gray-800 pt-8 cursor-pointer"
                        >
                          <DynamicWidget />
                        </li>
                      </a>
                      {/* <a onClick={() => {
                        navigate("/hackathons");
                      }}
                        className="cursor-pointer">
                        <li className="text-gray-800 pt-8 cursor-pointer">
                          <div className="flex items-center">
                            <FaFire className={`${id === "/hackathons" ? "w-6 h-6 md:w-8 md:h-8 text-indigo-700" : "w-6 h-6 md:w-8 md:h-8 text-gray-800"}`} />
                            <p className={`${id === "/hackathons" ? "text-indigo-700 xl:text-base text-base ml-3" : "text-gray-800 xl:text-base md:text-2xl text-base ml-3"}`}>Hackathons</p>
                          </div>
                        </li>
                        </a> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
