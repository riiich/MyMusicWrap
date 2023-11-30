const mongoose = require("mongoose");

const NumOfUsersSchema = new mongoose.Schema({
    userCount: Number,
}); 

module.exports = mongoose.model("NumOfUsers", NumOfUsersSchema); 