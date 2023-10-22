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
    
    spotifyAPI.authorizationCodeGrant(code)
        .then(result => {
            // spotifyAPI.setAccessToken(result.body.access_token);
            // spotifyAPI.setRefreshToken(result.body.refresh_token);

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