import axios from "axios";
import React, { useEffect, useState, useContext, useRef } from "react";
import GitHubCalendar from "react-github-calendar";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { backendUrl } from "../App";
import { UserContext } from "../App";
import { auth } from "../firebase/firebase";
import { FaAngleDown, FaAngleUp, FaSquareXTwitter } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import { cn } from "../scripts/cn";
import { motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import { animate, useDragControls, Reorder, useMotionValue } from "framer-motion";


import CustomModal from "../components/CustomModal";
const Dashboard = () => {
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const { currentUser, setCurrentUser, recommendedUsers, setRecommendedUsers } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const constraintsRef = useRef(null);




  const notify = () => toast("Liked user successfully!", {
    autoClose: 1000,
  });
  const notifyDislike = () => toast("Disliked user successfully!", {
    autoClose: 1000,
  });

  const handleclicklike = async () => {
    setDisabled(true);
    const cleanToken = localStorage.getItem("dynamic_authentication_token").slice(1, -1);
    await axios
      .put(
        `${backendUrl}/api/auth/likeUser`,
        {
          likedUserId: recommendedUsers._id,
          username: currentUser.username,
        },
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            email: currentUser.email,
          },
        }
      )
      .then((res) => {
        // setRandomUser({});
        getRandomUser();
        setShowMore(false);
        setDisabled(false);
        if (res.status === 201) {
          toast.success("You have a match!", {
            autoClose: 3000,
          });
        } else if (res.status === 200) {
          notify();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
      });
  };

  const handleRefreshUserProfile = async () => {
    const cleanToken = localStorage.getItem("dynamic_authentication_token").slice(1, -1);
    await axios
      .put(
        `${backendUrl}/api/auth/refreshUser`,
        {
          currentUserName: currentUser.username,
        },
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      )
      .then((res) => {
        getRandomUser();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
      });
  };

  const handleclickdislike = async () => {
    setDisabled(true);
    const cleanToken = localStorage.getItem("dynamic_authentication_token").slice(1, -1);
    console.log(recommendedUsers._id);
    await axios
      .put(
        `${backendUrl}/api/auth/dislikeUser`,
        {
          dislikedUserId: recommendedUsers._id,
          username: currentUser.username,
        },
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            email: currentUser.email,
          },
        }
      )
      .then((res) => {
        setShowMore(false);
        notifyDislike();
        getRandomUser();
        setDisabled(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
      });
  };

  const getRandomUser = async () => {
    setLoading(true);
    const token = localStorage.getItem("dynamic_authentication_token");
    const cleanToken = token ? token.slice(1, -1) : "";
    try {
      const response = await axios.get(`${backendUrl}/api/auth/get-recommended-hackathon-teammate`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          username: currentUser.username,
          email: currentUser.email,
          id: "67333a30a0cb04b8ef9ee30f"
        },
      });
      if (response.data.recommendations) {
        setRecommendedUsers(response.data.recommendations[0]);
        setUserProjects(response.data.recommendations[0].projects);
        console.log(response.data.recommendations[0])
      } else {
        setRecommendedUsers({});
      }
      if (response.data) {
        if (response.data?.recommendations[0]?.organizations_url) {
          try {
            const org_details = await axios.get(response.data.recommendations[0].organizations_url);

            if (org_details.data.length > 0) {
              setRecommendedUsers(prevRandomUser => ({
                ...prevRandomUser,
                organizations: org_details.data.map((org) => org)
              }));
            }
          } catch (error) {
            console.error("Error fetching organization details:", error);
          }
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching random user:", error);
      toast.error("Something went wrong!, please refresh the page");
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    if (currentUser.username && Object.keys(recommendedUsers).length === 0) {
      getRandomUser();
    }
  }, [currentUser.username]);

  return (
    <div className="flex flex-col mb-10 p-4 items-center justify-center h-full md:min-h-[80vh] sm:min-h-[80vh] h-[95vh] rounded-lg w-fit m-auto">
      <ToastContainer />
      {Object.keys(recommendedUsers).length > 0 ? (
        <div className={`${showMore ? "min-h-[700px] mt-20 p-2 h-full flex items-center justify-center" : "min-h-[700px] p-2 h-full flex items-center justify-center"}`}>
          <div class="text-black rounded-lg text-sm min-w-[350px] max-w-full md:max-w-[700px] sm:max-w-[70%] m-auto drop-shadow-sm border border-gray-300">
            <div class="w-full flex flex-row space-x-3 p-4">
              <img
                class="rounded-2xl border-gray-700 w-20 h-20"
                alt="Sebastián Ríos"
                src={recommendedUsers.Image}
              />
              <div class="w-full text-gray-500">
                <p class="w-[200px] text-lg space-x-1 inline-block overflow-hidden whitespace-nowrap text-ellipsis">
                  <a href={`https://github.com/${recommendedUsers.username}`} target="_blank"><span class="">{recommendedUsers.username}</span></a>
                </p>
                <p>{recommendedUsers.bio}</p>
              </div>
            </div>
            <div class="w-[95%] m-auto border-b border-gray-300"></div>
            <div class="w-full flex flex-row space-x-4 p-4 text-gray-500 text-sm">
              <p class="flex items-center space-x-1">
                <a class="hover:text-blue-500 flex items-center space-x-1"
                  href="#"><svg text="muted" aria-hidden="true" height="16"
                    viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" fill="currentColor">
                    <path
                      d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z">
                    </path>
                  </svg><span>{recommendedUsers.followers}</span><span> follower </span></a><span class="text-gray-100"> · </span><a
                    class="hover:text-blue-500" href="#">{recommendedUsers.following}
                  {` `}following</a>
              </p>
            </div>
            <div className="px-2 pb-4 pt-2">
              <GitHubCalendar username={recommendedUsers.username} theme={{ dark: ["#EBEDF0", "#9BE9A8", "#40C463", "#30A14E", "#216E39"] }} />
            </div>
            <div class="w-[95%] m-auto border-b border-gray-300"></div>
            <div class="w-full flex-col space-y-1 p-4 text-gray-500 text-sm">
              {recommendedUsers.location && (
                <div class="flex items-center space-x-1">
                  <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" fill="currentColor" aria-hidden="true">
                    <path
                      d="m12.596 11.596-3.535 3.536a1.5 1.5 0 0 1-2.122 0l-3.535-3.536a6.5 6.5 0 1 1 9.192-9.193 6.5 6.5 0 0 1 0 9.193Zm-1.06-8.132v-.001a5 5 0 1 0-7.072 7.072L8 14.07l3.536-3.534a5 5 0 0 0 0-7.072ZM8 9a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 9Z">
                    </path>
                  </svg>
                  <p class="text-gray-700">{recommendedUsers.location}</p>
                </div>
              )}
              {recommendedUsers.company && (
                <div v-if="infos.company" class="flex items-center space-x-1">
                  <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" fill="currentColor">
                    <path
                      d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z">
                    </path>
                  </svg>
                  <p class="text-gray-700">{recommendedUsers.company}</p>
                </div>
              )}
              {recommendedUsers.twitter_url && (
                <div v-if="infos.twitter_username" class="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 273.5 222.3" width="16" height="16">
                    <path
                      d="M273.5 26.3a109.77 109.77 0 0 1-32.2 8.8 56.07 56.07 0 0 0 24.7-31 113.39 113.39 0 0 1-35.7 13.6 56.1 56.1 0 0 0-97 38.4 54 54 0 0 0 1.5 12.8A159.68 159.68 0 0 1 19.1 10.3a56.12 56.12 0 0 0 17.4 74.9 56.06 56.06 0 0 1-25.4-7v.7a56.11 56.11 0 0 0 45 55 55.65 55.65 0 0 1-14.8 2 62.39 62.39 0 0 1-10.6-1 56.24 56.24 0 0 0 52.4 39 112.87 112.87 0 0 1-69.7 24 119 119 0 0 1-13.4-.8 158.83 158.83 0 0 0 86 25.2c103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3a114.25 114.25 0 0 0 28.1-29.1"
                      fill="currentColor"></path>
                  </svg>
                  <a class="text-gray-700 hover:text-blue-500" href={`https://twitter.com/${recommendedUsers.twitter_url}`} target="_blank">{recommendedUsers.twitter_url}</a>
                </div>
              )}
              <div style={{ marginTop: "10px" }} className="flex items-center justify-center gap-4">
                <button disabled={disabled} onClick={handleclicklike} className="hover:bg-gray-200 hover:shadow-lg text-gray-700 px-2 py-1 flex gap-1 border-[1px] border-black rounded-md">
                  <AiOutlineLike className="mt-1" />
                </button>
                <button disabled={disabled} onClick={handleclickdislike} className="hover:bg-gray-200 hover:shadow-lg text-gray-700 px-2 py-1 flex gap-1 border-[1px] border-black rounded-md">
                  <AiOutlineDislike className="mt-1" />
                </button>
              </div>
              <div style={{ opacity: "0.5", marginTop: "10px" }} onClick={() => setShowMore(!showMore)} className="flex gap-1 flex-row items-center justify-center cursor-pointer">
                {showMore ? (
                  <>
                    <span className="text-gray-700 hover:text-gray-800">Show less</span>
                    <FaAngleUp className="mt-1" />
                  </>
                ) : (
                  <>
                    <span className="text-gray-700 hover:text-gray-800">Show more</span>
                    <FaAngleDown className="flex items-center justify-center" />
                  </>
                )}
              </div>
              <div className={`${showMore ? `flex flex-col gap-4 items-center justify-center mt-6` : `hidden`}`}>
                {recommendedUsers.organizations && (
                  <div className="flex flex-row items-center gap-2">
                    {recommendedUsers.organizations.map((org) => (
                      <a href={`https://github.com/${org.login}`} target="_blank">
                        <img
                          className="h-10 w-10 rounded-md border-2 border-white"
                          src={org.avatar_url}
                          alt="org"
                        />
                      </a>
                    ))}
                  </div>
                )
                }
                <div className="">
                  {recommendedUsers.stack.length > 0 && showMore && (
                    <div className="flex items-start gap-2">
                      <div className="application-dock-component-container">
                        <h1 className="leading-snug text-3xl font-medium tracking-tighter">Interestss:</h1>
                        <motion.div className="mt-4 application-dock-component" ref={constraintsRef}>
                          <div className="all-icons-wrapper flex flex-wrap p-2.5 gap-2 rounded-2xl bg-slate-200 shadow-inner" ref={constraintsRef} style={{ flex: '0 1 auto', maxWidth: '100%' }}>
                            {recommendedUsers.stack?.map((lang) => (
                              <Tooltip.Provider delayDuration={0.2} key={lang}>
                                <Tooltip.Root>
                                  <Tooltip.Trigger asChild>
                                    <motion.div className="w-auto h-auto" whileHover={{ y: -12 }}>
                                      <div className={cn("text-xl p-4 bg-white shadow-md rounded-2xl cursor-pointer select-none transition-all hover:scale-125 z-10")}>
                                        {lang}
                                      </div>
                                    </motion.div>
                                  </Tooltip.Trigger>
                                  <Tooltip.Portal>
                                    <Tooltip.Content className="TooltipContent bg-slate-900 text-sm text-slate-100 font-medium py-2 px-4 rounded-xl" sideOffset={24}>
                                      {lang}
                                    </Tooltip.Content>
                                  </Tooltip.Portal>
                                </Tooltip.Root>
                              </Tooltip.Provider>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  )}
                </div>
                {
                  userProjects && userProjects.length > 0 && userProjects.map((repo) => (
                    <div className="bg-white flex w-full justify-between border-[2px] p-2 rounded-md m-3">
                      <div className="text-2xl">
                        <a href={repo.html_url} className="font-semibold" target="_blank">
                          {repo.title}
                        </a>
                        {repo.fork && (
                          <div>
                            <span className="bg-gray-700 text-xs font-semibold text-white px-2 py-1 rounded-md">Forked</span>
                          </div>
                        )}
                        <div className="">
                          {repo.stack && (
                            <div className="flex items-start gap-2">
                              <div className="application-dock-component-container">
                                <h1 className="leading-snug text-xl font-medium tracking-tighter">Technologies:</h1>
                                <motion.div className="mt-4 application-dock-component" ref={constraintsRef}>
                                  <div className="all-icons-wrapper flex flex-wrap p-2.5 gap-2 rounded-2xl bg-slate-200 shadow-inner" ref={constraintsRef} style={{ flex: '0 1 auto', maxWidth: '100%' }}>
                                    {repo.stack?.map((lang) => (
                                      <Tooltip.Provider delayDuration={0.2} key={lang}>
                                        <Tooltip.Root>
                                          <Tooltip.Trigger asChild>
                                            <motion.div className="w-auto h-auto" whileHover={{ y: -12 }}>
                                              <div className={cn("text-xl p-4 bg-white shadow-md rounded-2xl cursor-pointer select-none transition-all hover:scale-125 z-10")}>
                                                {lang}
                                              </div>
                                            </motion.div>
                                          </Tooltip.Trigger>
                                          <Tooltip.Portal>
                                            <Tooltip.Content className="TooltipContent bg-slate-900 text-sm text-slate-100 font-medium py-2 px-4 rounded-xl" sideOffset={24}>
                                              {lang}
                                            </Tooltip.Content>
                                          </Tooltip.Portal>
                                        </Tooltip.Root>
                                      </Tooltip.Provider>
                                    ))}
                                  </div>
                                </motion.div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="max-w-[70%]">
                        <p>{repo.description}</p>
                      </div>
                    </div>
                  ))
                }
                <img className="w-full bg-white rounded-md" src={`https://github-readme-stats.vercel.app/api?username=${recommendedUsers.username}&show_icons=true&theme=transparent`} />
                <img className="w-full" src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${recommendedUsers.username}&layout=compact`} />
              </div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="flex w-[50vw] items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex w-[80%] h-[100vh] m-auto flex-col text-white items-center justify-center">
          <h1 className="text-2xl text-center">
            Looks like you have been through all the devs. check msg to see if
            you have any matches or click below to refresh your rejected ones
          </h1>
          <button className="bg-gray-900 rounded-lg p-3 text-white m-5">Refresh rejected list</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;