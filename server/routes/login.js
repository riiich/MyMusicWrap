const router = require('express').Router();
const UserCount = require("../schema/userCount");
const SpotifyRefreshToken = require("../schema/spotifyRefreshToken");
require('dotenv').config();

// this package provides helper functions to interact with the Spotify Web API
const SpotifyWebAPI = require('spotify-web-api-node');  

router.use(async (req, res, next) => {
    console.log("Authorizing User!");
    
    try {
		// every time a user logs in, increment by 1 (this is acting like an analytics to determine how people have used to app)
		await UserCount.updateOne({ _id: "6568b47543f2747d63f8e826" }, { $inc: { userCount: 1 } });
	} catch (err) {
		console.log(err);
	}

    next();
});

router.get('/', (req, res) => {
    res.json({
        status: 200,
        msg: "Hit the login endpoint",
    });
})

router.post('/', async (req, res) => {
	const credentials = {
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		redirectUri: process.env.LOCAL_REDIRECT_URI,
	};

	const spotifyAPI = new SpotifyWebAPI(credentials);

	const code = req.body.code;

	try {
		const result = await spotifyAPI.authorizationCodeGrant(code);

		spotifyAPI.setAccessToken(result.body.access_token);
		if (result.body.refresh_token) {
			spotifyAPI.setRefreshToken(result.body.refresh_token);
		}

		const userProfile = await spotifyAPI.getMe();
		const spotifyUserId = userProfile.body.id;
		const userName = userProfile.body.display_name || "Spotify listener";
		const existingToken = await SpotifyRefreshToken.findOne({ spotifyUserId });
		const refreshToken = result.body.refresh_token || existingToken?.refreshToken;

		if (!refreshToken) {
			return res.status(400).json({
				status: 400,
				msg: "Spotify did not return a refresh token. Please authorize again.",
			});
		}

		await SpotifyRefreshToken.findOneAndUpdate(
			{ spotifyUserId },
			{
				$set: {
					spotifyUserId,
					userName,
					refreshToken,
					trackingEnabled: true,
				},
				$setOnInsert: {
					lastRecentlyPlayedPolledAt: new Date(),
				},
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		console.log("Successfully logged in!");

		res.json({
			accessToken: result.body.access_token,
			spotifyUserId,
			userName,
			expiresIn: result.body.expires_in,
			msg: "Sucessfully retrieved access token!",
		});
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
});

module.exports = router;
