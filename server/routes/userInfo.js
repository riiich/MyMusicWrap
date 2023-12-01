const router = require("express").Router();
require("dotenv").config();
const SpotifyWebAPI = require("spotify-web-api-node");

const spotifyAPI = new SpotifyWebAPI();

router.use((req, res, next) => {
	console.log("Retrieving user's info!");

	next();
});

router.get("/", async (req, res) => {
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
			console.log("ERROR GETTING USER INFO!");
			console.log(err);
			res.sendStatus(400);
		});
});

module.exports = router;
