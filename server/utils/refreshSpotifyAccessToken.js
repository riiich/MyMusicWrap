const SpotifyWebAPI = require("spotify-web-api-node");
const SpotifyRefreshToken = require("../schema/spotifyRefreshToken");
require("dotenv").config();

const refreshSpotifyAccessToken = async (spotifyUserId) => {
	if (!spotifyUserId) {
		const err = new Error("No Spotify user id was provided.");
		err.code = "MISSING_SPOTIFY_USER_ID";
		throw err;
	}

	const storedToken = await SpotifyRefreshToken.findOne({ spotifyUserId });

	if (!storedToken?.refreshToken) {
		const err = new Error("No stored Spotify session was found.");
		err.code = "MISSING_STORED_REFRESH_TOKEN";
		throw err;
	}

	const spotifyAPI = new SpotifyWebAPI({
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		redirectUri: process.env.LOCAL_REDIRECT_URI,
		refreshToken: storedToken.refreshToken,
	});

	const result = await spotifyAPI.refreshAccessToken();
	spotifyAPI.setAccessToken(result.body.access_token);

	if (result.body.refresh_token) {
		storedToken.refreshToken = result.body.refresh_token;
		await storedToken.save();
	}

	return {
		accessToken: result.body.access_token,
		expiresIn: result.body.expires_in,
		spotifyUserId: storedToken.spotifyUserId,
		userName: storedToken.userName,
		spotifyAPI,
	};
};

module.exports = {
	refreshSpotifyAccessToken,
};
