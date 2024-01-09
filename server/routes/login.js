const router = require('express').Router();
const UserCount = require("../schema/userCount");
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

router.post('/', (req, res) => {
    const credentials = {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI,
    };

    const spotifyAPI = new SpotifyWebAPI(credentials);

    const code = req.body.code;
    
    spotifyAPI.authorizationCodeGrant(code)
        .then(result => {
            spotifyAPI.setAccessToken(result.body.access_token);
            spotifyAPI.setRefreshToken(result.body.refresh_token);

            console.log("Successfully logged in!");

            res.json({
                accessToken: result.body.access_token,
                refreshToken: result.body.refresh_token,
                expiresIn: result.body.expires_in,
                msg: "Sucessfully retrieved access token!",
            });
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        })
});

module.exports = router;