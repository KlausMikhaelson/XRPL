const express = require("express");
const Hackathons = require("../models/Hackathons");


exports.getHackathons = async (req, res) => {
    try {
        const hackathons = await Hackathons.find();
        res.status(200).json(hackathons);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

exports.getHackathonAttendeeById = async (req, res) => {
    try {
        const attendees = await Hackathons.findById(req.headers.hackathonId);
        if (attendees) {
            res.status(200).json(attendees.members);
        } else {
            res.status(404).json("Hackathon not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

exports.joinHackathon = async (req, res) => {
    try {
        const hackathon = await Hackathons.findById(req.headers.hackathonId);
        const user = req.headers.user;

        if (hackathon) {
            if (hackathon.members.includes(user)) {
                res.status(400).json("You already joined this hackathon");
            } else {
                hackathon.members.push(user);
                await hackathon.save();
                res.status(200).json("You joined this hackathon");
            }
        } else {
            res.status(404).json("Hackathon not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

exports.leaveHackathon = async (req, res) => {
    try {
        const hackathon = await Hackathons.findById(req.headers.hackathonId);
        const user = req.headers.user;

        if (hackathon) {
            if (hackathon.members.includes(user)) {
                hackathon.members = hackathon.members.filter((member) => member !== user);
                await hackathon.save();
                res.status(200).json("You left this hackathon");
            } else {
                res.status(400).json("You are not part of this hackathon");
            }
        } else {
            res.status(404).json("Hackathon not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

exports.createHackathon = async (req, res) => {
    try {
        const newHackathon = new Hackathons(req.body);
        await newHackathon.save();
        res.status(200).json("Hackathon created successfully");
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

exports.updateHackathon = async (req, res) => {
    try {
        const hackathon = await Hackathons.findById(req.headers.hackathonId);
        if (hackathon) {
            if (hackathon.admins.includes(req.headers.user)) {
                await Hackathons.findByIdAndUpdate(req.headers.hackathonId, {
                    $set: req.body
                });
                res.status(200).json("Hackathon updated successfully");
            } else {
                res.status(403).json("You are not allowed to update this hackathon");
            }
        } else {
            res.status(404).json("Hackathon not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}
