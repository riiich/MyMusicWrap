const router = require("express").Router();
const { sendAuthExpired } = require("../utils/spotifyAuthResponse");
const { refreshSpotifyAccessToken } = require("../utils/refreshSpotifyAccessToken");

router.use((req, res, next) => {
	console.log("New Token!");

	next();
});

router.post("/", async (req, res) => {
	const { spotifyUserId } = req.body;

	if (!spotifyUserId) {
		return sendAuthExpired(res, "No Spotify user id was provided. Please log in again.");
	}

	try {
		const refreshedSession = await refreshSpotifyAccessToken(spotifyUserId);

		return res.json({
			status: 200,
			accessToken: refreshedSession.accessToken,
			expiresIn: refreshedSession.expiresIn,
			msg: "Access token refreshed.",
		});
	} catch (err) {
		console.log("ERROR REFRESHING ACCESS TOKEN!");
		console.log(err);
		return sendAuthExpired(res);
	}
});

module.exports = router;
