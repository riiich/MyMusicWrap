const router = require("express").Router();
require("dotenv").config();
const axios = require("axios");
const UserCount = require("../schema/userCount");
const SpotifyWebAPI = require("spotify-web-api-node");
const userCount = require("../schema/userCount");

const spotifyAPI = new SpotifyWebAPI();

router.use(async (req, res, next) => {
	console.log("Retrieving user's info!");

	try {
		// every time a user logs in, increment by 1 (this is acting like an analytics to determine how people have used to app)
		await UserCount.updateOne({ _id: "6568b47543f2747d63f8e826" }, { $inc: { userCount: 1 } });
	} catch (err) {
		console.log(err);
	}

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

// router.get("/code", (req, res) => {

// });

module.exports = router;
