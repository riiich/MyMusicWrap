const mongoose = require("mongoose");

const SpotifyPlayHistorySchema = new mongoose.Schema(
	{
		spotifyUserId: {
			type: String,
			required: true,
			index: true,
		},
		playedAt: {
			type: Date,
			required: true,
			index: true,
		},
		trackId: {
			type: String,
			required: true,
		},
		trackName: {
			type: String,
			default: "",
		},
		albumName: {
			type: String,
			default: "",
		},
		artists: {
			type: [String],
			default: [],
		},
		durationMs: {
			type: Number,
			default: 0,
		},
		spotifyUrl: {
			type: String,
			default: "",
		},
		image: {
			type: String,
			default: "",
		},
		contextUri: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

SpotifyPlayHistorySchema.index(
	{ spotifyUserId: 1, trackId: 1, playedAt: 1 },
	{ unique: true }
);

module.exports = mongoose.model("SpotifyPlayHistory", SpotifyPlayHistorySchema);
