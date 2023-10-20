const router = require('express').Router();
require('dotenv').config();

// this package provides helper functions to interact with the Spotify Web API
const SpotifyWebAPI = require('spotify-web-api-node');  

router.use((req, res, next) => {
    console.log("Authorizing User!");

    next();
});

router.post('/', (req, res) => {
    const credentials = {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI,
    };

    const spotifyAPI = new SpotifyWebAPI(credentials);

    const code = req.body.code;
    console.log(code);
    
    spotifyAPI.authorizationCodeGrant(code)
        .then((result) => {
            console.log("access token from server: " + result.body.access_token);
            console.log("refresh token from server: " + result.body.refresh_token);

            spotifyAPI.setAccessToken(result.body.access_token);
            spotifyAPI.setRefreshToken(result.body.refresh_token);

            res.json({
                accessToken: result.bodyaccess_token,
                refreshToken: result.body.refresh_token,
                expiresIn: result.body.expires_in,
            });
        })
        .catch((err) => {
            console.log(err);
            res.statusCode(400);
        })
});

module.exports = router;