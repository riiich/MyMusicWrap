const router = require("express").Router();
const SpotifyWebAPI = require("spotify-web-api-node");
const axios = require("axios");

const spotifyAPI = new SpotifyWebAPI();

router.use((req, res, next) => {
	if (!req.query.accessToken) {
		res.json({
			status: 401,
			msg: "An invalid or no access token was provided!",
		});
	}

	console.log("Retrieving user's playlists!");
	spotifyAPI.setAccessToken(req.query.accessToken);

	next();
});

// retrieves the user's playlists
router.get("/", async (req, res) => {
	try {
		const accessToken = req.query.accessToken;
		const playlists = []; // store the user's playlists, if any
		let userId = null;

		try {
			const userIdResponse = await spotifyAPI.getMe();
			userId = userIdResponse.body.id;

			const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			// console.log(response.data.items);

			// retrieving all the playlists
			response.data.items
				.filter(item => item.owner.id === userId)
				.map(item => { 
					// console.log(item.name);
					// console.log(item.owner.display_name);
					// console.log(item.owner.id);
					// console.log(item.external_urls.spotify);
					// console.log("------------");
					playlists.push({
						playlistName: item.name,
						playlistId: item.id,
						playlistURL: item.external_urls.spotify,
						userId: item.owner.id,
						userName: item.owner.display_name
					});  
				 });
			
			console.log(playlists);
			res.json({
				playlists: playlists,
			});

		} catch (err) {
			console.log(err);
		}

		// if (playlists.length === 0) {
		// 	res.json({
		// 		msg: "No playlists were found 😞",
		// 	});
		// }
	} catch (err) {
		console.log("THERE WAS AN ERROR RETRIEVING USER PLAYLISTS. ", err);
		res.status(400).json({ msg: "Error getting user playlist!" });
	}
});

// adds the song into a certain playlist
router.post("/addToPlaylist", (req, res) => {

});

module.exports = router;
 