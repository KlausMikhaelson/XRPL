import React, { useEffect, useState, useContext } from "react";
import { UserContext, backendUrl } from "../App";
import axios from "axios";
import ReactModal from "react-modal";
import RepoCard from "../components/RepoCard.jsx";
import { cn } from "../scripts/cn";
import { motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";

const Interested = () => {
    const [selectedInterested, setSelectedInterested] = useState(true);
    const { currentUser } = useContext(UserContext);
    const [repoDetails, setRepoDetails] = useState([]);
    const [addRepo, setAddRepo] = useState(false);
    const [currentUserInterestedRepo, setCurrentUserInterestedRepo] = useState([]);
    const [interestedRespected, setInterestedRespected] = useState([]);
    const constraintsRef = React.useRef(null);
    const [page, setPage] = useState(1);


    useEffect(() => {
        const cleanToken = localStorage.getItem("dynamic_authentication_token") ? localStorage.getItem("dynamic_authentication_token").slice(1, -1) : "";
        if (currentUser) {
            axios.get(`https://api.github.com/users/${currentUser.username}/repos?per_page=10&page=${page}`)
                .then(async (res) => {
                    setRepoDetails(res.data)
                    await axios.get(`${backendUrl}/api/auth/getinterestedpostsofcurrentuser`, {
                        headers: {
                            authorization: `Bearer ${cleanToken}`,
                            email: currentUser.email,
                        }
                    }).then(res => {
                        setCurrentUserInterestedRepo(res.data.currentuserinterestedposts)
                        console.log(res.data.currentuserinterestedposts)
                    }).catch(err => {
                        console.log(err)
                    })
                    await axios.get(`${backendUrl}/api/auth/getinterestedpostsforuser`, {
                        headers: {
                            authorization: `Bearer ${cleanToken}`,
                            email: currentUser.email,
                        }
                    })
                        .then((res) => {
                            setInterestedRespected(res.data.interestedPostsWithoutInterestedUsers)
                            console.log(res.data.interestedPostsWithoutInterestedUsers)
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        }
    }, [page])

    return (
        <div className="flex justify-center h-[100vh]">
            <div className="flex mt-20 flex-col w-[80%] ">
                <div className="flex justify-between mb-4">
                    <h1 onClick={() => setSelectedInterested(true)} className={`${selectedInterested ? "text-indigo-600 cursor-pointer" : "text-gray-600 cursor-pointer"}`}>Interested</h1>
                    <h1 onClick={() => setSelectedInterested(false)} className={`${!selectedInterested ? "text-indigo-600 cursor-pointer" : "text-gray-600 cursor-pointer"}`}>Your post</h1>
                </div>
                <div>
                </div>
                <div>
                    <ReactModal isOpen={addRepo} onRequestClose={() => setAddRepo(false)}>
                        {!selectedInterested && repoDetails.length && (
                            <div className="flex flex-col">
                                <div style={{ maxHeight: "80vh", overflow: "auto" }}>
                                    <RepoCard repoDetails={repoDetails} />
                                    <button className="bg-[#FFA500] w-[100px] m-auto text-sm mt-4 rounded-md p-1" onClick={() => setPage(page + 1)}>{'Next Page ->'}</button>
                                </div>
                                <button className="bg-[#FFA500] w-[100px] m-auto text-sm mt-4 rounded-md p-1" onClick={() => setAddRepo(false)}>Close</button>
                            </div>
                        )}
                    </ReactModal>
                </div>
                <div className="h-[400vh] overflow-auto">

                    {!selectedInterested && (
                        <div className="flex flex-col">
                            <button className="bg-[#FFA500] w-[100px] m-auto text-sm mt-4 rounded-md p-1" onClick={() => setAddRepo(true)}>Add a post</button>
                            {currentUserInterestedRepo.length && (
                                <div className="h-[90vh]">
                                    {
                                        currentUserInterestedRepo.map((repo) => (
                                            <div className="bg-white flex flex-col border-[2px] p-2 rounded-md m-3">
                                                <div className="text-2xl">
                                                    <a href={repo.html_url} className="font-semibold text-xl" target="_blank">
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
                                                                    <h1 className="leading-snug text-l font-medium tracking-tighter">Technologies:</h1>
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
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="h-[80vh]">

                    {selectedInterested && interestedRespected.length && (
                        <div className="h-[80vh] overflow-auto">
                            {
                                interestedRespected.map((repo) => (
                                    <div className="bg-white flex flex-col border-[2px] p-2 rounded-md m-3">
                                        <div className="">
                                            <a href={repo.html_url} className="font-semibold text-xl" target="_blank">
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
                                                            <h1 className="leading-snug text-l font-medium tracking-tighter">Technologies:</h1>
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Interested;