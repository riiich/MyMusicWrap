const router = require("express").Router();
require("dotenv").config();
const SpotifyWebAPI = require("spotify-web-api-node");
const { handleSpotifyRouteError, sendAuthExpired } = require("../utils/spotifyAuthResponse");

const spotifyAPI = new SpotifyWebAPI();

router.use((req, res, next) => {
	console.log("Retrieving user's info!");

	next();
});

router.get("/", async (req, res) => {
	if (!req.query.accessToken) {
		return sendAuthExpired(res, "No access token was provided. Please log in again.");
	}

	spotifyAPI.setAccessToken(req.query.accessToken);

	await spotifyAPI
		.getMe()
		.then((data) => {
			res.json({
				name: data.body.display_name,
				id: data.body.id,
				image: data.body.images[0].url,
				userSpotify: data.body.external_urls.spotify,
			});
		})
		.catch((err) => {
			return handleSpotifyRouteError(res, err, "ERROR GETTING USER INFO!");
		});
});

module.exports = router;
