import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { UserContext, backendUrl } from "../App";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import GitHubCalendar from 'react-github-calendar';
import { toast, ToastContainer } from "react-toastify";
import { animate, motion, useDragControls, Reorder, useMotionValue } from "framer-motion";
import { cn } from "../scripts/cn";
import { TiSocialLinkedin, TiSocialTwitter } from "react-icons/ti";
import * as Tooltip from "@radix-ui/react-tooltip";
import { FiEdit } from "react-icons/fi";
import ReactModal from "react-modal";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import RepoCard from "../components/RepoCard";
import { IoMdRefresh } from "react-icons/io";

const MyProfile = () => {

    const { currentUser, setCurrentUser, users } = useContext(UserContext);
    const [showMore, setShowMore] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [repoDetails, setRepoDetails] = useState([]);
    const [page, setPage] = useState(1);
    const [userProjects, setUserProjects] = useState([]);

    useEffect(() => {
        axios.get(`https://api.github.com/users/${currentUser.username}/repos?per_page=10&page=${page}`)
            .then(async (res) => {
                setRepoDetails(res.data);
            }).catch(err => console.error(err))
    }, [page, currentUser.username])

    useEffect(() => {
        const cleanToken = localStorage.getItem("dynamic_authentication_token") ? localStorage.getItem("dynamic_authentication_token").slice(1, -1) : "";
        axios.get(`${backendUrl}/api/auth/getcurrentuserprojects`, {
            headers: {
                authorization: `Bearer ${cleanToken}`,
                email: currentUser.email,
            }
        }).then(res => {
            console.log(res.data)
            setUserProjects(res.data.currentuserprojects)
        }).catch(err => console.error(err))
    }, [currentUser.email])

    const handleLikeAndDislike = async () => {
        toast.info("It's only to show how your profile looks for others :)", {
            autoClose: 1000,
        });
    }
    const [Edit, setEdit] = useState(false);
    const [interests, setInterests] = useState([]);
    const addTags = (e) => {
        if (e.key === "Enter" && e.target.value !== "") {
            setInterests([...interests, e.target.value]);
            e.target.value = "";
        }
    };
    const removeTag = (indexToRemove) => {
        setInterests([...interests.filter((_, index) => index !== indexToRemove)]);
    };

    const updateProfile = async () => {
        try {
            console.log(currentUser.email);
            const token = localStorage.getItem("dynamic_authentication_token");
            const cleanToken = token ? token.slice(1, -1) : "";
            await axios.patch(`${backendUrl}/api/auth/updatecurrentUser`,
                {
                    stack: [...interests, ...currentUser.stack],
                },
                {
                    headers: {
                        authorization: `Bearer ${cleanToken}`,
                        email: currentUser.email,
                    }
                }
            ).then((res) => {
                toast.success("Profile updated successfully", {
                    autoClose: 1000,
                });
                setCurrentUser(currentUser => ({ ...currentUser, stack: [...interests, ...currentUser.stack] }));
                setEdit(false);
            })
        } catch (error) {
            console.error("Error fetching matched users:", error);
        }
    }

    const constraintsRef = useRef(null);
    const controls = useDragControls();

    const updateProfileWithUpdatedGithubData = async() => {
        try {
            const token = localStorage.getItem("dynamic_authentication_token");
            const cleanToken = token ? token.slice(1, -1) :  "";
            console.log(users, "userrr")
            await axios.patch(`${backendUrl}/api/auth/updatecurrentUser`, {
                username: users.login,
                followers: users.followers,
                following: users.following, 
                bio: users.bio,
                location: users.location,
                organizations_url: users.company,
                // twitter_url: users.twitter_url,
                Image: users.avatar_url,
            }, {
                headers: {
                    authorization: `Bearer ${cleanToken}`,
                    email: currentUser.email,
                }
            })
            console.log(users)
            toast.success("Profile updated successfully", {
                autoClose: 1000,
            });
        } catch(err) {
            console.error(err)
            toast.error("Error updating profile", {
                autoClose: 1000,
            });
        }
    }

    const x = useMotionValue(0);

    return (
        <>
            <div className={`${showMore ? "min-h-[700px]  p-2 h-full flex items-center justify-center" : "min-h-[700px] p-2 h-full flex items-center justify-center"}`}>
                <div class="text-black rounded-lg text-sm mt-20 min-w-[350px] max-w-full md:max-w-[700px] sm:max-w-[70%] m-auto drop-shadow-sm border border-gray-300">
                    <ReactModal className={`${showMore ? "bg-white opacity-[0.7] min-h-[700px] mt-20 p-2 h-full flex items-center overflow-auto justify-center" : "bg-white opacity-[0.7] min-h-[700px] p-2 h-full overflow-auto flex items-center justify-center mt-20"}`} isOpen={Edit} onRequestClose={() => setEdit(false)}>
                        <div className="flex items-center justify-between">
                            <div>
                                <label htmlFor="Interests" className="block text-l text-gray-700 flex items-center justify-center">Interests:</label>
                                <p>(use Enter to add it and then after adding all the interests click on save)</p>
                                <div className="border w-[60%] m-auto flex gap-1 justify-center items-center flex-wrap  h-auto bg-gray-100 bg-opacity-50 rounded border-gray-300 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-0 px-3 leading-8 transition-colors duration-200 ease-in-out">
                                    <ul className="flex flex-wrap max-w-[] justify-center gap-2 items-center py-1">
                                        {interests.length > 0 && interests.map((tag, index) => (
                                            <li
                                                className="w-auto h-[24px] flex items-center justify-center pl-2 pr-2 text-[12px] rounded-md mr-8px mb-8px bg-white border-[0.5px] shadow-md border-gray-500 text-gray-700"
                                                key={index}
                                            >
                                                <span className=" text-center block">
                                                    {tag}
                                                </span>
                                                <IoIosRemoveCircleOutline
                                                    className="block w-[12px] h-[12px] leading-1 text-center text-[10px] ml-[8px] text-gray-700 rounded-md bg-[#fff] pointer"
                                                    onClick={() => removeTag(index)}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                    <input
                                        type="text"
                                        placeholder="add interests"
                                        onKeyDown={addTags}
                                        className="border-none justify-center outline-none  bg-gray-100 flex items-center w-full h-full bg-opacity-50 p-0 mt-0 mb-1"
                                    />
                                </div>
                                <div className="h-20 overflow-auto mt-4">
                                    {currentUser.stack.length > 0 && (
                                       <div className=" flex flex-wrap gap-2">
                                        {currentUser.stack.map((lang) => (
                                            <div className="flex items-center gap-2 border-[2px] rounded-md">
                                                <p>{lang}</p>
                                                <IoIosRemoveCircleOutline onClick={() => setCurrentUser(currentUser => ({...currentUser, stack: currentUser.stack.filter((l) => l !== lang)}))} className="cursor-pointer"/>
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 justify-center mt-2">
                                    <button onClick={updateProfile} className="hover:bg-gray-200 text-gray-700 px-2 py-1 flex gap-1 border-[1px] border-black rounded-md">
                                        Save
                                    </button>
                                    <button onClick={() => setEdit(false)} className="hover:bg-gray-200 text-gray-700 px-2 py-1 flex gap-1 border-[1px] border-black rounded-md">
                                        Cancel
                                    </button>
                                </div>
                                <div className="h-[70vh] overflow-auto">
                                    {repoDetails && (
                                        <div>
                                            <RepoCard repoDetails={repoDetails} />
                                            <div className="pl-3 mb-2">
                                                <button onClick={() => setPage(page + 1)} className="hover:bg-gray-200 mt-2 text-gray-700 px-2 py-1 flex gap-1 border-[1px] border-black rounded-md">
                                                    {'Load more ->'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </ReactModal>
                    <div class="w-full flex flex-row space-x-3 p-4">
                        <img
                            class="rounded-2xl border-gray-700 w-20 h-20"
                            alt="Sebastián Ríos"
                            src={currentUser.Image}
                        />
                        <div class="w-full text-gray-500">
                            <p class="w-[100%] flex justify-between text-lg space-x-1 inline-block overflow-hidden whitespace-nowrap text-ellipsis">
                                <a href={`https://github.com/${currentUser.username}`} target="_blank"><span class="">{currentUser.username}</span></a>
                                <div className="flex flex-col">
                                <div className="flex justify-end items-end cursor-pointer" onClick={() => setEdit(true)}>
                                    <p className="flex gap-2 text-xl">Edit <FiEdit className="text-xl" /></p>
                                </div>
                                <p className="flex items-center cursor-pointer gap-2 text-xl" onClick={updateProfileWithUpdatedGithubData}>Refresh profile <IoMdRefresh /></p>
                                </div>
                            </p>
                            <p>{currentUser.bio}</p>
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
                                </svg><span>{currentUser.followers}</span><span> follower </span></a><span class="text-gray-100"> · </span><a
                                    class="hover:text-blue-500" href="#">{currentUser.following}
                                {` `}following</a>
                        </p>
                    </div>
                    <div className="px-2 pb-4 pt-2">
                        <GitHubCalendar username={currentUser.username} theme={{ dark: ["#EBEDF0", "#9BE9A8", "#40C463", "#30A14E", "#216E39"] }} />
                    </div>
                    <div class="w-[95%] m-auto border-b border-gray-300"></div>
                    <div class="w-full flex-col space-y-1 p-4 text-gray-500 text-sm">
                        {currentUser.location && (
                            <div class="flex items-center space-x-1">
                                <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" fill="currentColor" aria-hidden="true">
                                    <path
                                        d="m12.596 11.596-3.535 3.536a1.5 1.5 0 0 1-2.122 0l-3.535-3.536a6.5 6.5 0 1 1 9.192-9.193 6.5 6.5 0 0 1 0 9.193Zm-1.06-8.132v-.001a5 5 0 1 0-7.072 7.072L8 14.07l3.536-3.534a5 5 0 0 0 0-7.072ZM8 9a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 9Z">
                                    </path>
                                </svg>
                                <p class="text-gray-700">{currentUser.location}</p>
                            </div>
                        )}
                        {currentUser.company && (
                            <div v-if="infos.company" class="flex items-center space-x-1">
                                <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" fill="currentColor">
                                    <path
                                        d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z">
                                    </path>
                                </svg>
                                <p class="text-gray-700">{currentUser.company}</p>
                            </div>
                        )}
                        <div v-if="infos.blog" class="flex items-center space-x-1">
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"
                                fill="currentColor">
                                <path
                                    d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z">
                                </path>
                            </svg>
                            <a class="text-gray-700 hover:text-blue-500" href="#">{currentUser.email}</a>
                        </div>
                        {currentUser.twitter_url && (
                            <div v-if="infos.twitter_username" class="flex items-center space-x-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 273.5 222.3" width="16" height="16">
                                    <path
                                        d="M273.5 26.3a109.77 109.77 0 0 1-32.2 8.8 56.07 56.07 0 0 0 24.7-31 113.39 113.39 0 0 1-35.7 13.6 56.1 56.1 0 0 0-97 38.4 54 54 0 0 0 1.5 12.8A159.68 159.68 0 0 1 19.1 10.3a56.12 56.12 0 0 0 17.4 74.9 56.06 56.06 0 0 1-25.4-7v.7a56.11 56.11 0 0 0 45 55 55.65 55.65 0 0 1-14.8 2 62.39 62.39 0 0 1-10.6-1 56.24 56.24 0 0 0 52.4 39 112.87 112.87 0 0 1-69.7 24 119 119 0 0 1-13.4-.8 158.83 158.83 0 0 0 86 25.2c103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3a114.25 114.25 0 0 0 28.1-29.1"
                                        fill="currentColor"></path>
                                </svg>
                                <a class="text-gray-700 hover:text-blue-500" href={`https://twitter.com/${currentUser.twitter_url}`} target="_blank">{currentUser.twitter_url}</a>
                            </div>
                        )}
                        <div style={{ marginTop: "10px" }} className="flex items-center justify-center gap-4">
                            <button onClick={handleLikeAndDislike} className="hover:bg-gray-200 text-gray-700 px-2 py-1 flex gap-1 border-[1px] border-black rounded-md">
                                Like <AiOutlineLike className="mt-1" />
                            </button>
                            <button onClick={handleLikeAndDislike} className="hover:bg-gray-200 text-gray-700 px-2 py-1 flex gap-1 border-[1px] border-black rounded-md">
                                Dislike
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
                            {currentUser.organizations && (
                                <div className="flex flex-row items-center gap-2">
                                    {currentUser.organizations.map((org) => (
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
                                {currentUser.stack && showMore && (
                                    <div className="flex items-start gap-2">
                                        <div className="application-dock-component-container">
                                            <h1 className="leading-snug text-3xl font-medium tracking-tighter">Interests:</h1>
                                            <motion.div className="mt-4 application-dock-component" ref={constraintsRef}>
                                                <div className="all-icons-wrapper flex flex-wrap p-2.5 gap-2 rounded-2xl bg-slate-200 shadow-inner" ref={constraintsRef} style={{ flex: '0 1 auto', maxWidth: '100%' }}>
                                                    {currentUser.stack?.map((lang) => (
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
                                userProjects.map((repo) => (
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
                            < img className="w-full bg-white rounded-md" src={`https://github-readme-stats.vercel.app/api?username=${currentUser.username}&show_icons=true&theme=transparent`} />
                            <img className="w-full" src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${currentUser.username}&layout=compact`} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyProfile;