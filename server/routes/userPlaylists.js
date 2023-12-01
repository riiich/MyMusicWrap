const router = require("express").Router();
const SpotifyWebAPI = require("spotify-web-api-node");
const axios = require("axios");

const spotifyAPI = new SpotifyWebAPI();
 
// middleware for all routes
router.use((req, res, next) => {
	console.log("Performing an operation with the user's playlist!");
	next();
});

// middleware for GET requests
const getRequests = (req, res, next) => {
	if (!req.query.accessToken) {
		res.json({
			status: 401,
			msg: "An invalid or no access token was provided!",
		});
		console.log("GET REQUEST BLAH BLAH BLAH");
	}

	console.log("Retrieving user's playlists!");
	spotifyAPI.setAccessToken(req.query.accessToken);
	next();
};
 
// middleware for POST requests
const postRequests = (req, res, next) => {
	if (!req.body.accessToken) {
		res.json({
			status: 401,
			msg: "An invalid or no access token was provided!",
		});
		console.log("POST REQUEST BLAH BLAH BLAH");
	}

	console.log("Adding track to user's playlists!");
	spotifyAPI.setAccessToken(req.body.accessToken);
	next();
};
    
// retrieves all of the user's playlists
router.get("/", getRequests, async (req, res) => {
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
				.filter((item) => item.owner.id === userId)
				.map((item) => {
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
						userName: item.owner.display_name,
					});
				});

			// console.log(playlists);
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
router.post("/addToPlaylist", postRequests, async (req, res) => {
	try {
		if(req.body.selectedPlaylistId.playlistId){
			console.log("adding to playlist with id: ", req.body.selectedPlaylistId.playlistId);
			await spotifyAPI.addTracksToPlaylist(req.body.selectedPlaylistId.playlistId, [
				req.body.selectedPlaylistId.trackURI,
			]);
	 
			res.json({
				status: 200,
				msg: "Successfully added the track in the playlist!",
			});
		}
		else{ 
			console.log("no playlist selected!");
		}
	} catch (err) {
		console.log("ERROR ADDING TRACK TO PLAYLIST!");
		console.log(err);
	}
});

module.exports = router;
 