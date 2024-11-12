import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Whyus from "./components/Whyus";
import Dashboard from "./pages/Dashboard";
import Join from "./components/Join";
import Footer from "./components/Footer";
import ChatScreen from "./pages/ChatScreen";
import Userdms from "./pages/Userdms";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UserContext } from "./App";
import Interested from "./pages/Interested";
import MyProfile from "./pages/MyProfile";
import JobList from "./pages/JobList";
import Hackathons from "./pages/Hackathons";
import CreateHackathon from "./pages/HackathonCreate";
import HackathonAdminDashboard from "./pages/UpdateHackathon";
import HackathonsPage from "./pages/HackathonsPage";

const Routers = () => {
  const [user, setUser] = useState("");
  const {currentUser} = useContext(UserContext);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={Object.keys(currentUser).length > 0 ? <Dashboard /> : <Home />} />
        <Route path="/match" element={Object.keys(currentUser).length > 0 ? <Dashboard /> : <Home />} />
        <Route path="/chats/:id" element={Object.keys(currentUser).length ? <ChatScreen /> : <Home />} />
        <Route path="/chats" element={Object.keys(currentUser).length ? <Userdms /> : <Home />} />
        <Route path="/myprofile" element={Object.keys(currentUser).length ? <MyProfile /> : <Home />} />
        <Route path="/get-paid" element={Object.keys(currentUser).length ? <JobList /> : <Home />} />
        <Route path="/explore" element={Object.keys(currentUser).length ? <Interested /> : <Home />} />
        {/* <Route path="/hackathons" element={Object.keys(currentUser).length > 0 ? <Hackathons /> : <Home />} /> */}
        <Route path="/create-hackathon" element={<CreateHackathon />} />
        <Route path="/update-hackathon" element={<HackathonAdminDashboard />} />
        <Route path="/get-hackathons" element={<HackathonsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Routers;
