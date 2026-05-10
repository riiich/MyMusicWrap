const mongoose = require("mongoose");

const SharedSnapshotSchema = new mongoose.Schema({
	snapshotId: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
	userName: {
		type: String,
		default: "A listener",
	},
	artistTimeRange: {
		type: String,
		default: "",
	},
	trackTimeRange: {
		type: String,
		default: "",
	},
	artists: [
		{
			name: String,
			image: String,
			spotifyUrl: String,
		},
	],
	tracks: [
		{
			name: String,
			image: String,
			artists: [String],
			spotifyUrl: String,
		},
	],
	numOfViews: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("SharedSnapshot", SharedSnapshotSchema);
