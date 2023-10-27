const router = require("express").Router();
require("dotenv").config();
const axios = require("axios");
const SpotifyWebAPI = require("spotify-web-api-node");

const spotifyAPI = new SpotifyWebAPI();

// middleware that sets checks to see if there's an access token provided
router.use((req, res, next) => {
	if (!req.query.accessToken) {
		res.json({
			status: 401,
			msg: "An invalid access token was received!",
		});
	}
	console.log("Retrieving user's top most listened artists and tracks!");
	spotifyAPI.setAccessToken(req.query.accessToken); // set access token

	next();
});

// get user's top artists
router.get("/artists", async (req, res) => {
	const topArtists = [];

	await spotifyAPI
		.getMyTopArtists({ limit: 10, offset: 0 }) // get 10 artists
		.then((data) => {
			data.body.items.map((item) => {
				topArtists.push({
					artist: item.name,
					image: item.images[0].url,
					id: item.id,
				});
			});

			res.json({
				topArtists: topArtists,
				msg: "You have some artists that you enjoy listening to!",
			});
		})
		.catch((err) => {
			console.log("ERROR GETTING USER'S FAVORITE ARTISTS!");
			console.log(err);
			res.sendStatus(400);
		});
});

// get user's top listened tracks
router.get("/tracks", async (req, res) => {
	const topTracks = [];

	await spotifyAPI
		.getMyTopTracks({ offset: 0, limit: 10 })
		.then((data) => {
			// console.log("BODY");
			// console.log(data.body);
			data.body.items.map((item) => {
				// console.log(item);
				topTracks.push({
					artists: item.artists[0],
					id: item.id,
					title: item.name,
					album: item.album,
					image: item.album.images[0].url,
					albumURL: item.album.external_urls.spotify,
					artistProfile: item.album.artists[0].external_urls,
					previewSong: item.preview_url,
					trackNumber: item.track_number,
				});
			});

			res.json({
				topTracks: topTracks,
				msg: "You have some songs that you enjoy listening to!",
			});
		})
		.catch((err) => {
			console.log("ERROR GETTING USER'S FAVORITE SONGS!");
			console.log(err);
			res.sendStatus(400);
		});
});

module.exports = router;

/*
    // this route uses the spotify api raw, the other endpoints will use a spotify api library
    // const accessToken = req.query.accessToken;
    // const topArtists = [];

    // await axios
    //     .get('https://api.spotify.com/v1/me/top/artists?offset=0&limit=10',{
    //         headers: {
    //             'Authorization': `Bearer ${accessToken}`,
    //         }
    //     })
    //     .then(response => {
    //         // console.log(response.data.items);
    //         response.data.items.map((item) => {
    //             topArtists.push({
    //                 artist: item.name, 
    //                 image: item.images[0].url,
    //                 id: item.id
    //             });
    //         });

    //         res.json({
    //             topArtists: topArtists,
    //         });
    //     })
    //     .catch(err => {
    //         console.log("ERROR GETTING USER PLAYLIST")
    //         console.log(err);
    //     })
*/
