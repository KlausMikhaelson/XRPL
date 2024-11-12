const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
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
});

module.exports = mongoose.model("Projects", ProjectSchema);