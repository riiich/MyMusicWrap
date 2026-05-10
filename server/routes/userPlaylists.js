const router = require("express").Router();
const SpotifyWebAPI = require("spotify-web-api-node");
const axios = require("axios");
const { handleSpotifyRouteError, sendAuthExpired } = require("../utils/spotifyAuthResponse");
 
const spotifyAPI = new SpotifyWebAPI();
 
// middleware for all routes
router.use((req, res, next) => {
	console.log("Performing an operation with the user's playlist!");
	next();
});
    
// middleware for GET requests
const getRequests = (req, res, next) => {
	if (!req.query.accessToken) {
		return sendAuthExpired(res, "No access token was provided. Please log in again.");
	}

	console.log("Retrieving user's playlists!");
	spotifyAPI.setAccessToken(req.query.accessToken);
	next();
};
 
// middleware for POST requests
const postRequests = (req, res, next) => {
	if (!req.body.accessToken) {
		return sendAuthExpired(res, "No access token was provided. Please log in again.");
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

		// if (playlists.length === 0) {
		// 	res.json({
		// 		msg: "No playlists were found 😞",
		// 	});
		// }
	} catch (err) {
		return handleSpotifyRouteError(res, err, "THERE WAS AN ERROR RETRIEVING USER PLAYLISTS.");
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
			res.status(400).json({
				status: 400,
				msg: "No playlist was selected.",
			});
		}
	} catch (err) {
		return handleSpotifyRouteError(res, err, "ERROR ADDING TRACK TO PLAYLIST!");
	}
});

module.exports = router;
 
