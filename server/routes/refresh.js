const router = require("express").Router();
const SpotifyWebAPI = require("spotify-web-api-node");
require("dotenv").config();

router.use((req, res, next) => {
	console.log("New Token!");
	// res.json({msg: "Retrieving refresh token!"});

	next();
});

router.post("/", (req, res) => {
	refreshToken = req.body.refreshToken;
	console.log("before refreshToken");
	console.log(refreshToken);
	console.log("after refreshToken");
 
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

			console.log(result.body);
			res.json({
				accessToken: result.body.access_token,
				expiresIn: result.body.expires_in,
			});
		})
		.catch((err) => {
			console.log(err);
			res.sendStatus(400);
		});
});

module.exports = router;
