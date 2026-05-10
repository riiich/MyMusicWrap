const router = require("express").Router();
const SpotifyWebAPI = require("spotify-web-api-node");
const { sendAuthExpired } = require("../utils/spotifyAuthResponse");
require("dotenv").config();

router.use((req, res, next) => {
	console.log("New Token!");

	next();
});

router.post("/", (req, res) => {
	const refreshToken = req.body.refreshToken;

	if (!refreshToken) {
		return sendAuthExpired(res, "No refresh token was provided. Please log in again.");
	}
 
	const credentials = {
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		redirectUri: process.env.REDIRECT_URI,
		refreshToken,
	};
	
	const spotifyAPI = new SpotifyWebAPI(credentials);

	spotifyAPI
		.refreshAccessToken()
		.then((result) => {
			spotifyAPI.setAccessToken(result.body.access_token);
			
			res.json({
				status: 200,
				accessToken: result.body.access_token,
				expiresIn: result.body.expires_in,
				msg: "Access token refreshed.",
			});
		})
		.catch((err) => {
			console.log("ERROR REFRESHING ACCESS TOKEN!");
			console.log(err);
			return sendAuthExpired(res);
		});
});

module.exports = router;
