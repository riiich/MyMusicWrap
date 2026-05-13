const mongoose = require("mongoose");

const SpotifyRefreshTokenSchema = new mongoose.Schema(
	{
		spotifyUserId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		userName: {
			type: String,
			default: "Spotify listener",
		},
		refreshToken: {
			type: String,
			required: true,
		},
		trackingEnabled: {
			type: Boolean,
			default: false,
		},
		lastRecentlyPlayedPolledAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("SpotifyRefreshToken", SpotifyRefreshTokenSchema);
