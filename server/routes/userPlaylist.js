const router = require('express').Router();
require('dotenv').config();
const axios = require('axios');
const SpotifyWebAPI = require("spotify-web-api-node");

router.use((req, res, next) => {
	console.log("Retrieving user's top most listened tracks!");
	// res.json({msg: "Retrieving refresh token!"});

	next();
});

router.get('/', async (req, res) => {
    const accessToken = req.query.accessToken;
    const topArtists = [];

    await axios
        .get('https://api.spotify.com/v1/me/playlists',{
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        .then(response => {
            console.log(response.data);
            // response.data.items.map((item) => {
            //     topArtists.push(item.name);
            // });

            // res.json({
            //     topArtists: topArtists,
            // });
        })
        .catch(err => {
            // console.log(err);
        })
});

module.exports = router;