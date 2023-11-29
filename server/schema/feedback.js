const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    name: String,
    comment: String,
    userID: String,     // since there can be same names, use this ID to know exactly who it is
    createdAt: Date,
    rating: Number,
}); 

module.exports = mongoose.model("Feedback", feedbackSchema); 