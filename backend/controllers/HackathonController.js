const express = require("express");
const Hackathons = require("../models/Hackathons");
const Users = require("../models/Users");

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
        const hackathon = await Hackathons.findById(req.headers.id);
        
        const {username} = req.headers;

        const userId = await Users.findOne({
            username
        })

        if (hackathon) {
            if (hackathon.members.includes(userId._id)) {
                res.status(400).json("You already joined this hackathon");
            } else {
                hackathon.members.push(userId._id);
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
                const updatedHackathon = await Hackathons.findByIdAndUpdate(
                    req.headers.hackathonId,
                    { $set: req.body },
                    { new: true } // This ensures the updated document is returned
                );
                res.status(200).json({
                    message: "Hackathon updated successfully",
                    data: updatedHackathon
                });
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

exports.getHackathonHostedByMe = async (req, res) => {
    try {
        const { username } = req.headers;

        const user = await Users.findOne({ username });

        if (!user) {
            return res.status(404).json("User not found");
        }

        const hackathon = await Hackathons.findOne({
            admins: { $in: [user._id] }
        });

        if (!hackathon) {
            return res.status(404).json("No hackathon found");
        }

        res.status(200).json(hackathon);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

exports.getHackathonById = async(req, res) => {
    try {
        const {id} = req.headers;

        console.log(id)

        const hackathon = await Hackathons.findById(id)

        if(!hackathon) {
            return res.status(404).json("No hackathon found");
        }

        res.status(200).json(hackathon)
    } catch(err) {
        console.log(err);
    }
}


exports.updateHackathon = async (req, res) => {
    try {
        const { id } = req.headers;
        const updateData = req.body;

        // Validate if hackathon exists
        const existingHackathon = await Hackathons.findById(id);
        if (!existingHackathon) {
            return res.status(404).json({ message: "Hackathon not found" });
        }

        // Validate dates if they are being updated
        if (updateData.start_date && updateData.end_date) {
            const startDate = new Date(updateData.start_date);
            const endDate = new Date(updateData.end_date);
            
            if (endDate < startDate) {
                return res.status(400).json({ 
                    message: "End date cannot be earlier than start date" 
                });
            }
        }

        // Validate arrays if they are being updated
        const arrayFields = ['members', 'prizes', 'sponsors', 'judges', 'admins'];
        arrayFields.forEach(field => {
            if (updateData[field] && !Array.isArray(updateData[field])) {
                return res.status(400).json({ 
                    message: `${field} must be an array` 
                });
            }
        });

        // Validate prizes structure if being updated
        if (updateData.prizes) {
            const validPrizes = updateData.prizes.every(prize => 
                prize.name && prize.amount && prize.description
            );
            if (!validPrizes) {
                return res.status(400).json({ 
                    message: "Each prize must have name, amount, and description" 
                });
            }
        }

        // Validate sponsors structure if being updated
        if (updateData.sponsors) {
            const validSponsors = updateData.sponsors.every(sponsor => 
                sponsor.name && sponsor.url
            );
            if (!validSponsors) {
                return res.status(400).json({ 
                    message: "Each sponsor must have name and url" 
                });
            }
        }

        // Validate judges structure if being updated
        if (updateData.judges) {
            const validJudges = updateData.judges.every(judge => 
                judge.name && judge.url
            );
            if (!validJudges) {
                return res.status(400).json({ 
                    message: "Each judge must have name and url" 
                });
            }
        }

        // Update the hackathon
        const updatedHackathon = await Hackathons.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Hackathon updated successfully",
            data: updatedHackathon
        });

    } catch (err) {
        console.error("Error updating hackathon:", err);
        res.status(500).json({ 
            message: "Error updating hackathon", 
            error: err.message 
        });
    }
};