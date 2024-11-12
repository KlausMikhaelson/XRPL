import React, { useState } from "react";
import Example from "../assets/sample2.png";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Stats from "../assets/stats.png";
import { GiTeamUpgrade } from "react-icons/gi";
import { CiBellOn } from "react-icons/ci";
import { RiNftFill } from "react-icons/ri";
import ReactModal from "react-modal";
import Typewriter from "typewriter-effect";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";

function Home() {
  const [show, setShow] = useState(false);
  const [willClose, setWillClose] = useState(true);
  
  return (
    <div className="py-12 overflow-y-hidden">
      <div className="min-h-[1000px] flex items-center justify-center">
        <dh-component>
          <div className="w-full px-6">
            <div className="mt-[-50px] md:mt-10 sm:mt-10 relative rounded-lg bg-indigo-700 container mx-auto flex flex-col items-center pt-12 sm:pt-24 pb-24 sm:pb-32 md:pb-48 lg:pb-56 xl:pb-64">
              <img className="mr-2 lg:mr-12 mt-2 lg:mt-12 absolute right-0 top-0" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/center_aligned_with_image-svg2.svg" alt="bg" />
              <img className="ml-2 lg:ml-12 mb-2 lg:mb-12 absolute bottom-0 left-0" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/center_aligned_with_image-svg3.svg" alt="bg" />
              <div className="w-11/12 sm:w-2/3 mb-5 sm:mb-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center text-white font-bold leading-tight">Build your perfect
                <Typewriter
                  style={{ backgroundColor: "transparent" }}
                  className="bg-transparent"
                  onInit={(typewriter) => {
                    typewriter
                      .typeString("Hackathon Team!")
                      .callFunction(() => {
                        console.log("String typed out!");
                      })
                      .pauseFor(2500)
                      .deleteAll()
                      .typeString("Web3 Journey!")
                      .pauseFor(2500)
                      .deleteAll()
                      .typeString("XRPL Project!")
                      .pauseFor(2500)
                      .deleteAll()
                      .start();
                  }}
                  options={{
                    loop: true,
                  }}
                />
                </h1>
                <p className="text-white text-center">(No wallet? No problem! Easy Web3 onboarding with built-in wallet generation)</p>
              </div>
              <div className="flex justify-center items-center mb-10 sm:mb-20">
                <button className="hover:text-white hover:bg-transparent lg:text-xl hover:border-white border transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-indigo-700 focus:ring-white rounded text-indigo-700 text-sm">
                  <DynamicWidget />
                </button>
              </div>
            </div>
            <div className="container mx-auto flex justify-center md:-mt-80 -mt-40 sm:-mt-50">
              <div className="relative sm:w-2/3 w-11/12">
                <CardContainer className="inter-var">
                  <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto md:w-[40rem] sm:w-[35rem] h-auto rounded-xl p-6 border">
                    <CardItem
                      translateZ="50"
                      className="text-xl font-bold text-neutral-600 dark:text-white"
                    >
                      Connect & Build on XRPL
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                    >
                      Match with fellow hackers, showcase your skills, and earn verifiable proof of work NFTs on the XRPL blockchain.
                    </CardItem>
                    <CardItem
                      translateZ="100"
                      rotateX={20}
                      rotateZ={-10}
                      className="w-full mt-4"
                    >
                      <img
                        src={Example}
                        className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                        alt="hackathon preview"
                      />
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </div>
            </div>
          </div>
        </dh-component>
      </div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
            <img alt="feature" className="object-cover object-center h-full w-full" src={Stats} />
          </div>
          <div className="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">
            <div className="flex flex-col mb-10 lg:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                <GiTeamUpgrade className="text-2xl" />
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">Smart Team Matching</h2>
                <p className="leading-relaxed text-base">Find the perfect teammates based on skills, interests, and hackathon goals. Our algorithm ensures complementary skill sets for your dream team.</p>
              </div>
            </div>
            <div className="flex flex-col mb-10 lg:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                <CiBellOn className="text-2xl" />
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">XRPL Integration</h2>
                <p className="leading-relaxed text-base">Leverage XRPL's fast, sustainable, and cost-effective blockchain. Mint proof of work NFTs and showcase your hackathon achievements on-chain.</p>
              </div>
            </div>
            <div className="flex flex-col mb-10 lg:items-start items-center">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                <RiNftFill className="text-2xl"/>
              </div>
              <div className="flex-grow">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-3">Proof of Work NFTs</h2>
                <p className="leading-relaxed text-base">Each completed hackathon project earns you a unique NFT on XRPL. Build your verifiable portfolio of achievements and skills.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;