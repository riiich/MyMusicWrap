const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    name: String,
    comment: String,
    userID: String,
    createdAt: Date,
});

module.exports = mongoose.model("Feedback", feedbackSchema);