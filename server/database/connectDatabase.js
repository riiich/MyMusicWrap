const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_URI, {
			dbName: process.env.DB_NAME,       // connect to a specific database in the current MongoDB cluster
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = connectDB;
