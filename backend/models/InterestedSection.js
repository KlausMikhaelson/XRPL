const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InterestedSectionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    description: {
        type: String,
    },
    stack: {
        type: Array,
        default: []
    },
    html_url: {
        type: String,
        required: true
    },
    interestedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }]
});

module.exports = mongoose.model("InterestedSection", InterestedSectionSchema);