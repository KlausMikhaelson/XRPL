import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext, backendUrl } from "../App";
import * as Tooltip from "@radix-ui/react-tooltip";
import { animate, motion, useDragControls, Reorder, useMotionValue } from "framer-motion";
import { cn } from "../scripts/cn";
import { FaRegEye } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
// import Markdown from "react-markdown";

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const { currentUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    // const [showMore, setShowMore] = useState(false);
    const constraintsRef = React.useRef(null);


    const recommendedJobs = async () => {
        const cleanToken = localStorage.getItem("dynamic_authentication_token") ? localStorage.getItem("dynamic_authentication_token").slice(1, -1) : "";
        setLoading(true);
        try {
            await axios.get(`${backendUrl}/api/auth/jobrecommendation`, {
                headers: {
                    authorization: `Bearer ${cleanToken}`,
                    email: currentUser.email,
                    page: page
                }
            },
            ).then(res => {
                console.log(res.data.jobs);
                setLoading(false);
                setJobs(res.data.jobs)
            }).catch(err => console.error(err))
        } catch (err) {
            console.log(err);
        }
    }

    // const nextPage = () => {
    //     setPage(page + 1);
    // }
    // const previousPage = () => {
    //     setPage(page - 1);
    // }

    useEffect(() => {
        recommendedJobs();
    }
        , [page])

    return (
        <div className="gap-4 p-4">
            {loading && (
                <div className="flex w-[100vw] items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-900"></div>
                </div>
            )}
            <div className="mt-20">
                {jobs && jobs.map((job) => (
                    <div className="rounded-md shadow-md border-[2px] mt-4 p-2 justify-between flex" key={job._id}>
                        <div>
                            {job.image_url ? (
                                <a href={job.url} target="_blank">
                                    <img src={job.image_url} alt="" className="w-20 h-20 rounded-full" />
                                </a>
                            ) : (
                                <a href={job.apply_url} target="_blank">
                                    <img src="https://www.crackeddevs.com/_next/static/media/logo.843fe05c.svg" alt="" className="w-20 h-20 rounded-full" />
                                </a>
                            )}
                            <a href={job.url} target="_blank">
                                <h1 className="font-semibold">{job.title}</h1>
                            </a>
                            <h2>{job.company}</h2>
                            <h3>{job.country_iso}</h3>
                            {job.min_salary_usd ? (
                                <h5>Salary range <span className="text-green-500 font-semibold">${job.min_salary_usd} - ${job.max_salary_usd}</span></h5>
                            ) : (
                                <h5>Salary range <span className="text-green-500 font-semibold">$20000 - $80000</span></h5>
                            )}
                            <h6>{job.date}</h6>
                            <div className="">
                                {job.technologies && (
                                    <div className="flex items-start gap-2">
                                        <div className="application-dock-component-container">
                                            <h1 className="leading-snug text-xl font-medium tracking-tighter">Technologies:</h1>
                                            <motion.div className="mt-4 application-dock-component" ref={constraintsRef}>
                                                <div className="all-icons-wrapper flex flex-wrap p-2.5 gap-2 rounded-2xl bg-slate-200 shadow-inner" ref={constraintsRef} style={{ flex: '0 1 auto', maxWidth: '100%' }}>
                                                    {job.technologies?.map((lang) => (
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
                        <div className="">
                            <span className="bg-blue-200 h-[30px] flex gap-2 text-sm rounded-md p-1">
                                <FaRegEye className="text-xl" /> {job.views}
                            </span>
                            {job.location_iso ? (
                                <small className="flex mt-2 items-center">
                                    <CiLocationOn className="text-xl" /> {job.location_iso}
                                </small>
                            ) : (
                                <small className="flex items-center mt-2">
                                    <CiLocationOn className="text-xl" /> Remote
                                </small>
                            )}
                            {job.job_type == "internship" ? (
                                <small>
                                    Internship
                                </small>
                            ) : job.job_type == "full_time" ? (
                                <small>
                                    Full time
                                </small>
                            ) : job.job_type == "part_time" ? (
                                <small>
                                    Part time
                                </small>
                            ) : (
                                <small>
                                    Contract
                                </small>
                            )}
                        </div>
                    </div>
                ))}

                <button className="bg-[#FFA500] font-semibold rounded-md p-2 mt-4" onClick={() => {
                    setPage(page + 1)
                    // scroll to top
                    window.scrollTo(0, 0);
                }
                }>{'Load more ->'}</button>
                <h1>
                </h1>
            </div>
        </div>
    )
}

export default JobList;
