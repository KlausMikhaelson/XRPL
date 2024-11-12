import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext, backendUrl } from "../App";
import { toast } from "react-toastify";

const RepoCard = ({ repoDetails }) => {
    const [userRepoState, setUserRepoState] = useState({})
    const { currentUser } = useContext(UserContext);
    const [stack, setStack] = useState([])
    const [selectedRepo, setSelectedRepo] = useState({})
    const id = window.location.pathname


    useEffect(() => {
        console.log(userRepoState)
    }, [userRepoState])

    const addRepoToInterestedSection = async (repo) => {
        setSelectedRepo(repo)
        console.log(currentUser._id)
        const getStackfromRepo = await axios.get(repo.languages_url).then(res => setStack(Object.keys(res.data))).catch(err => console.log(err))
        // if (id === "/explore") {
        //     console.log(stack)
        //     await axios.post(`${backendUrl}/api/auth/adduserinterest`, {
        //         title: repo.name,
        //         description: repo.description,
        //         user: currentUser._id,
        //         stack: stack,
        //         html_url: repo.html_url
        //     }, {
        //         headers: {
        //             authorization: `Bearer ${cleanToken}`,
        //             email: currentUser.email,
        //         }
        //     }
        //     ).then(res => {
        //         toast.success("Added to Interested Section")
        //     }).catch(err => console.error("Some error occured, please try again later"))
        // } else {
        //     await axios.post(`${backendUrl}/api/auth/addpostforuser`, {
        //         title: repo.name,
        //         description: repo.description,
        //         user: currentUser._id,
        //         stack: stack,
        //         html_url: repo.html_url
        //     }, {
        //         headers: {
        //             authorization: `Bearer ${cleanToken}`,
        //             email: currentUser.email,
        //         }
        //     }
        //     ).then(res => {
        //         toast.success("Added to Interested Section")
        //     }).catch(err => console.error("Some error occured, please try again later"))
        // }
    }

    const requests = async () => {
        const token = localStorage.getItem("dynamic_authentication_token");
        const cleanToken = token ? token.slice(1, -1) : "";
        if (id === "/explore") {
            console.log(stack)
            await axios.post(`${backendUrl}/api/auth/adduserinterest`, {
                title: selectedRepo.name,
                description: selectedRepo.description,
                user: currentUser._id,
                stack: stack,
                html_url: selectedRepo.html_url
            }, {
                headers: {
                    authorization: `Bearer ${cleanToken}`,
                    email: currentUser.email,
                }
            }
            ).then(res => {
                toast.success("Added to Interested Section")
            }).catch(err => console.error("Some error occured, please try again later"))
        } else {
            await axios.post(`${backendUrl}/api/auth/addpostforuser`, {
                title: selectedRepo.name,
                description: selectedRepo.description,
                user: currentUser._id,
                stack: stack,
                html_url: selectedRepo.html_url
            }, {
                headers: {
                    authorization: `Bearer ${cleanToken}`,
                    email: currentUser.email,
                }
            }
            ).then(res => {
                toast.success("Added to Interested Section")
            }).catch(err => console.error("Some error occured, please try again later"))
        }
    }

    useEffect(() => {
        if (stack.length > 0) {
            requests()
        }
    }, [stack])

    return (
        <>
            {
                repoDetails.map((repo) => (
                    <div className="bg-white flex justify-between border-[2px] p-2 rounded-md m-3">
                        <div>

                            <a href={repo.html_url} target="_blank">
                                {repo.name}
                            </a>
                            {repo.fork && (
                                <div>
                                    <span className="bg-gray-700 text-xs font-semibold text-white px-2 py-1 rounded-md">Forked</span>
                                </div>
                            )}
                            {repo.language && (
                                <div>
                                    <span className={`${repo.language == "TypeScript"
                                        ? "bg-black text-xs font-semibold text-white px-2 py-1 rounded-md"
                                        : repo.language === "Python"
                                            ? "bg-yellow-500 text-xs font-semibold text-black px-2 py-1 rounded-md"
                                            : repo.language === "JavaScript"
                                                ? "bg-yellow-400 text-xs font-semibold text-black px-2 py-1 rounded-md"
                                                : "bg-gray-700 text-xs font-semibold text-white px-2 py-1 rounded-md"
                                        }`}>{repo.language}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-center">
                            <p onClick={() => {
                                addRepoToInterestedSection(repo)
                            }} className="bg-[#FFA500] cursor-pointer hover:text-gray-700 text-sm px-2 py-1 rounded-md">Add</p>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default RepoCard;