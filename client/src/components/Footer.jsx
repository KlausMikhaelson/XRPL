import React from 'react'
import { AiFillYoutube } from "react-icons/ai";
import { BsDiscord, BsTwitterX } from "react-icons/bs";
import { AiFillGithub } from "react-icons/ai";
import { SiPeerlist } from "react-icons/si";

const Footer = () => {
  return (
    // <div className='flex flex-row px-10 md:px-28 lg:32 items-center justify-between bg-slate-600 py-2 md:py-4 w-full'>
    //     <h1 className='font-medium text-white text-xl md:text-2xl'>🌐 Contact Us</h1>
    //     <div className='flex flex-row items-center justify-around'>
    //        <a href="https://www.youtube.com/watch?v=72f83_nP6DY" target='_blank'><AiFillYoutube style={{ color:"white"}} size='32px' className='mx-2 md:mx-4' /></a> 
    //        <a href="http://twitter.com/KlausCodes" target='_blank'><BsTwitterX style={{ color:"white"}} size='32px' className='mx-2 md:mx-4'/></a> 
    //         <a href="https://github.com/KlausMikhaelson" target='_blank'><AiFillGithub style={{ color:"white"}} size='32px' className='mx-2 md:mx-4'/></a>
    //     </div>
    // </div>
    <footer class="text-gray-600 body-font">
      <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <h2 className="text-base text-gray-700 flex font-bold leading-normal pl-3"><small className="bg-[#FFA500] px-1 rounded-md text-base text-gray-700 font-bold">Dev</small><small className="text-base text-gray-700 font-bold">Match</small></h2>
        <p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">Built by —
          <a href="https://twitter.com/__Klaus_31452" class="text-gray-600 ml-1" rel="noopener noreferrer" target="_blank">@Satyam(KlausMikhaleson)</a>
        </p>
        <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <a href='https://twitter.com/DevMatch_tech' target='_blank' class="ml-3 text-gray-500">
            <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </a>
          <a href='https://instagram.com/satyamcodes' target='_blank' class="ml-3 text-gray-500">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
            </svg>
          </a>
          <a href='https://www.linkedin.com/in/Satyamsingh2003' target='_blank' class="ml-3 text-gray-500">
            <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
              <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
              <circle cx="4" cy="4" r="2" stroke="none"></circle>
            </svg>
          </a>
          <a href="https://peerlist.io/klaus/project/devmatch" target='_blank' class="ml-3 text-gray-500">
            <SiPeerlist size='23px' />
          </a>
        </span>
      </div>
    </footer>
  )
}

export default Footer
