const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HackathonSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true

    },
    url: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    members: {
        type: Array,
        default: []
    },
    // prizes should be an array of object which has prize name, ammount and description
    prizes: {
        type: Array,
        default: []
    },
    // sponsors should be an array of object which has sponsor name and url
    sponsors: {
        type: Array,
        default: []
    },
    // judges should be an array of object which has judge name and url
    judges: {
        type: Array,
        default: []
    },
    admins: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model("Hackathon", HackathonSchema);