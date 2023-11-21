const router = require("express").Router();
const SpotifyWebAPI = require("spotify-web-api-node");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const spotifyAPI = new SpotifyWebAPI();
 
// rate limit for the recommended track endpoint
const recommendedTrackLimiter = rateLimit({
	windowMs: 5 * 1000,	// 5s
	limit: 3,	// 3 request per windowMs time (5s)
	message: "Stop spamming me!",
});
 
// middleware that sets checks to see if there's an access token provided
router.use((req, res, next) => {
	if (!req.query.accessToken) {
		res.json({
			status: 401,
			msg: "An invalid or no access token was provided!",
		});
	} 
	console.log(
		"Retrieving user's top most listened artists and tracks! Also recommending some songs based on top tracks"
	);
	spotifyAPI.setAccessToken(req.query.accessToken); // set access token

	next();
});

let topArtistGenres = null; // will store a hashmap that contains the genres and number of occurrences from the artists

// get user's top artists
router.get("/artists", async (req, res) => {
	const topArtists = []; // stores objects of information of each artist
	// get the genres of the top songs the user listens to through the ARTISTS
	// a map that will map the genre to the amount of occurences
	const artistGenres = new Map();
	const time_range = req.query.topArtistTimeRange;
    
	await spotifyAPI
		.getMyTopArtists({ offset: 0, limit: 10, time_range: `${time_range}_term` }) // get 10 artists
		.then((data) => {
			data.body.items.map((item) => {
				topArtists.push({
					artist: item.name,
					image: item.images[0].url,
					id: item.id,
					artistURL: item.external_urls.spotify,
				});

				// add each genre into a map and its number of occurence in a map
				item.genres.map((genre, i) => {
					if (!artistGenres.has(genre)) artistGenres.set(genre, [genre, 1]);
					else artistGenres.set(genre, [genre, artistGenres.get(genre)[1] + 1]);
				});
			});
 
			// sorted map based on number of occurences of genre
			const sortedTopArtistGenres = new Map(
				[...artistGenres.entries()].sort((a, b) => b[1][1] - a[1][1])
			);

			topArtistGenres = sortedTopArtistGenres;
			// console.log("FROM ARTISTS ENDPOINT");
			// console.log(topArtistGenres);

			res.json({
				topArtists: topArtists,
				// topArtistGenres: Object.fromEntries(topArtistGenres), // need to format the map to be able to send as a response back to client
				msg: "You have some artists that you enjoy listening to!",
			});
		})
		.catch((err) => {
			console.log("ERROR GETTING USER'S FAVORITE ARTISTS!");
			console.log(err);
			res.sendStatus(400);
		});
});

let topTrackGenres = null; // will store an object that contains the genres and number of occurrences from the tracks
let topTrackIds = null;

// get user's top listened tracks
router.get("/tracks", async (req, res) => {
	try {
		const topTracks = [];
		const trackIds = [];
		const trackGenres = {};
		const time_range = req.query.topTrackTimeRange;

		// get the genres of the top songs the user listens to through the TRACKS
		// a map that will map the genre to the amount of occurrences
		// const trackGenres = new Map();
		// const trackGenres = {};

		// time_range - long_term (several years), medium_term (~last 6 months), short_term (~last 4 weeks)
		// await spotifyAPI
		// 	.getMyTopTracks({ offset: 0, limit: 10, time_range: "medium_term" }) // gets the top 10 tracks that the user has recently listend to
		// 	.then(async (data) => {
		// 		// waits for all the promises to resolve
		// 		await Promise.all(
		// 			data.body.items.map(async (item) => {
		// 				topTracks.push({
		// 					artists: item.artists, // object: important info: externals_urls{spotify}, id, name
		// 					id: item.id, // id of song
		// 					title: item.name, // name of song
		// 					album: item.album, // album that the song is in
		// 					image: item.album.images[0].url, // image of the song
		// 					albumURL: item.album.external_urls.spotify, // link to the song from Spotify
		// 					artistProfile: item.album.artists[0].external_urls.spotify, // link to the artist profile on Spotify
		// 					previewSong: item.preview_url, // 30-second clip of the song
		// 					trackNumber: item.track_number, // track number in the album
		// 					duration: {
		// 						// hour: Math.floor(),
		// 						minutes: Math.floor(item.duration_ms / (1000 * 60)),
		// 						seconds: Math.floor((item.duration_ms / 1000) % 60),
		// 					}, // song length
		// 					popularity: item.popularity, // popularity score from 0 - 100
		// 				});

		// 				const artistIDS = item.artists.map((artist) => artist.id); // get all the ids of the artists from the tracks

		// 				//
		// 				await Promise.all(
		// 					artistIDS.map(async (artistID) => {
		// 						try {
		// 							const artist = await spotifyAPI.getArtists([artistID]);
		// 							artist.body.artists.forEach((artistInfo) => {
		// 								artistInfo.genres.forEach((genre) => {
		//                                     if(!trackGenres[genre]) trackGenres[genre] = [genre, 1];
		//                                     else trackGenres[genre][1] ++;
		// 								});
		// 							});
		// 						} catch (err) {
		// 							console.log(err);
		// 						}
		// 					})
		// 				);
		// 			})
		// 		);

		// time_range - long_term (several years), medium_term (~last 6 months), short_term (~last 4 weeks)
		const data = await spotifyAPI.getMyTopTracks({ offset: 0, limit: 8, time_range: `${time_range}_term` });
 
		await Promise.all(
			data.body.items.map(async (item) => {
				const artistIDS = item.artists.map((artist) => artist.id);

				await Promise.all(
					artistIDS.map(async (artistID) => {
						try {
							const artist = await spotifyAPI.getArtists([artistID]);
							artist.body.artists.forEach((artistInfo) => {
								artistInfo.genres.forEach((genre) => {
									if (!trackGenres[genre]) trackGenres[genre] = [genre, 1];
									else trackGenres[genre][1]++;
									// if (!trackGenres.has(genre)) trackGenres.set(genre, [genre ,1]);
									// else trackGenres.set(genre, [genre , trackGenres.get(genre) + 1]);
								});
							});
						} catch (err) {
							console.error("Error getting artist information:", err);
						}
					})
				);

				topTracks.push({
					artists: item.artists, // object: important info: externals_urls{spotify}, id, name
					id: item.id, // id of song
					title: item.name, // name of song
					album: item.album, // album that the song is in
					image: item.album.images[0].url, // image of the song
					trackURL: item.external_urls.spotify,
					albumURL: item.album.external_urls.spotify, // link to the song from Spotify
					artistProfile: item.album.artists[0].external_urls.spotify, // link to the artist profile on Spotify
					previewSong: item.preview_url, // 30-second clip of the song
					trackNumber: item.track_number, // track number in the album
					duration: {
						minutes: Math.floor(item.duration_ms / (1000 * 60)),
						seconds: Math.floor((item.duration_ms / 1000) % 60),
					}, // song length
					popularity: item.popularity, // popularity score from 0 - 100
				});

				trackIds.push(item.id);
			})
		);

		// sort the object by value in ascending order
		const sortedTopTrackGenres = Object.values(trackGenres).sort((a, b) => b[1] - a[1]);

		// sort the hashmap by value in ascending order
		// const sortedTopTrackGenres = [...trackGenres.entries()].sort((a, b) => b[1] - a[1]);

		topTrackGenres = sortedTopTrackGenres;
		topTrackIds = trackIds;

		// console.log("FROM TRACKS ENDPOINT");
		// console.log(topTrackGenres);
 
		res.json({
			topTracks: topTracks, 
			msg: "You have some songs that you enjoy listening to!",
		});
	} catch (err) {
		console.log("ERROR GETTING USER'S FAVORITE SONGS!", err);
		res.status(500).json({ error: "Internal Server Error..." });
	}
});

const delay = (time) => {
	return new Promise((resolve) => setTimeout(resolve, time));
};

// this endpoint depends on the artists and tracks endpoints, so it needs to be a bit delayed to retrieve data from
//	spotify API to fill topArtistGenres and topTrackGenres
router.get("/recommendedtracks", recommendedTrackLimiter, (req, res) => {
	try {
		const recommended = []; // use the genres that the user listens to in order to look for recommended songs
		const mostListenedTrackGenres = []; // store genres from the user's track/song history that appeat more than twice
		const time = 1500;

		// have to use a setTimeout b/c topTrackGenres is used in other endpoints which make an API call, so it takes time to get the
		//  data, so if this setTimeout is omitted, it will run this before the API call is finished, resulting in no data in topTrackGenres
		setTimeout(async () => {
			// console.log(topTrackGenres);

			if (!topTrackGenres) {
				res.status(500).json({
					msg: "There is no data to be found",
					status: 500,
				});
				return;
			} else {
				// get genres where the number of occurrences is at least 2
				for (const genre in topTrackGenres) {
					if (topTrackGenres[genre][1] > 0) {
						// console.log(topTrackGenres[genre]);
						mostListenedTrackGenres.push(topTrackGenres[genre][0]);
					}
				}
 
				await delay(time);

				const data = await spotifyAPI.getRecommendations({
					// seed_genres: [
					// 	mostListenedTrackGenres[0],
					// 	mostListenedTrackGenres[1],
					// 	mostListenedTrackGenres[2],
					// 	mostListenedTrackGenres[3],
					// 	mostListenedTrackGenres[4], 
					// ], 
					seed_tracks: [
						topTrackIds[0],
						topTrackIds[1],
						topTrackIds[2],
						topTrackIds[3],
						topTrackIds[4],
					],	
					// min_popularity: 80,
					limit: 8, 
				});
 
				data.body.tracks.map((track, i) => {
					recommended.push({
						artists: track.artists,
						track_title: track.name,
						spotify_url: track.external_urls.spotify,
						id: track.id,
						image: track.album.images[0].url,
						previewSong: track.preview_url,
						uri: track.uri,
						duration: {
							minutes: Math.floor(track.duration_ms / (1000 * 60)),
							seconds: Math.floor((track.duration_ms / 1000) % 60),
						}, // song length
					});
 
					// console.log(i + 1);
					// console.log("Artist(s): ");
					// track?.artists.map((artist, i) => {
					// 	console.log(`${i + 1}. ${artist.name}`);
					// });
					// console.log(`Track title: ${track?.name}`);
					// console.log(`Spotify Link: ${track?.external_urls.spotify}`);
					// console.log(`Popularity: ${track?.popularity}`);
					// console.log(`Image: ${track?.album.images[0].url}`);
					// console.log("-------");
				});

				// console.log(recommended);
				// console.log("============");

				if (recommended.length > 0) {
					res.json({
						recommended: recommended,
						status: 200,
						msg: "Choose a track",
					});
				}
				else{
					res.json({
						recommended: recommended,
						status: 200,
						msg: "No recommended songs are available due to not enough data =(",
					})
				}
			} 
		}, time);
	} catch (err) {
		console.log("THERE WAS AN ERROR GETTING RECOMMENDED SONGS", err);
		res.status(500).json({
			msg: "Internal Server Error",
		});
	}
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



// router.get("/tracks", async (req, res) => {
// 	try {
// 		const topTracks = [];
// 		const trackGenres = new Map();

// 		const data = await spotifyAPI.getMyTopTracks({ offset: 0, limit: 10, time_range: "medium_term" });

// 		await Promise.all(
// 			data.body.items.map(async (item) => {
// 				const artistIDS = item.artists.map((artist) => artist.id);

// 				await Promise.all(
// 					artistIDS.map(async (artistID) => {
// 						try {
// 							const artist = await spotifyAPI.getArtists([artistID]);
// 							artist.body.artists.forEach((artistInfo) => {
// 								artistInfo.genres.forEach((genre) => {
// 									if (!trackGenres.has(genre)) trackGenres.set(genre, 1);
// 									else trackGenres.set(genre, trackGenres.get(genre) + 1);
// 								});
// 							});
// 						} catch (err) {
// 							console.error("Error getting artist information:", err);
// 						}
// 					})
// 				);

// 				topTracks.push({
// 					// ... (your existing code for adding track details)
// 				});
// 			})
// 		);

// 		const sortedTopTrackGenres = [...trackGenres.entries()].sort((a, b) => b[1] - a[1]);

// 		res.json({
// 			topTracks: topTracks,
// 			topTrackGenres: sortedTopTrackGenres,
// 			msg: "You have some songs that you enjoy listening to!",
// 		});
// 	} catch (err) {
// 		console.error("Error getting user's favorite songs:", err);
// 		res.status(500).json({ error: "Internal Server Error" });
// 	}
// });

*/
