const router = require('express').Router();
require('dotenv').config();
const axios = require('axios');

router.use((req, res, next) => {
    if(!req.query.accessToken) {
        res.json({
            status: 401,
            msg: "An invalid access token was received!",
        });
    }
	console.log("Retrieving user's top most listened tracks!");

	next();
});

// this route uses the spotify api raw, the other endpoints will use a spotify api library
router.get('/', async (req, res) => {
    const accessToken = req.query.accessToken;
    const topArtists = [];

    await axios
        .get('https://api.spotify.com/v1/me/top/artists?offset=0&limit=10',{
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        .then(response => {
            // console.log(response.data.items);
            response.data.items.map((item) => {
                topArtists.push({
                    artist: item.name, 
                    image: item.images[0].url,
                    id: item.id
                });
            });

            res.json({
                topArtists: topArtists,
                
            });
        })
        .catch(err => {
            console.log("ERROR GETTING USER PLAYLIST")
            console.log(err);
        })
});


module.exports = router;