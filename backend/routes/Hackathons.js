const express = require("express");
const { createHackathon, getHackathonHostedByMe, getHackathonById, updateHackathon, getHackathons, joinHackathon } = require("../controllers/HackathonController");
const app = express();
const Router = express.Router();

Router.post("/create-hackathon", createHackathon);
Router.get("/get-hackathons", getHackathonHostedByMe);
Router.get("/get-hackathonbyid", getHackathonById);
Router.put("/update-hackathon", updateHackathon);
Router.get("/get-recommended-hackathons", getHackathons);
Router.post("/join", joinHackathon)

const hackathonRoutes = Router;
module.exports = hackathonRoutes;