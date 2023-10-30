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

let topArtistGenres = null;		// will store a hashmap that contains the genres and number of occurrences from the artists

// get user's top artists
router.get("/artists", async (req, res) => {
	const topArtists = []; // stores objects of information of each artist
	// get the genres of the top songs the user listens to through the ARTISTS
	// a map that will map the genre to the amount of occurences
	const artistGenres = new Map();

	await spotifyAPI
		.getMyTopArtists({ limit: 10, offset: 0 }) // get 10 artists
		.then((data) => {
			data.body.items.map((item) => {
				topArtists.push({
					artist: item.name,
					image: item.images[0].url,
					id: item.id,
				});

				// add each genre into a map and its number of occurence in a map
				item.genres.map((genre, i) => {
					if (!artistGenres.has(genre)) artistGenres.set(genre, 1);
					else artistGenres.set(genre, artistGenres.get(genre) + 1);
				});
			});

			// sorted map based on number of occurences of genre
			const sortedTopArtistGenres = new Map([...artistGenres.entries()].sort((a, b) => b[1] - a[1]));

			// console.log(sortedTopArtistGenres);
			topArtistGenres = sortedTopArtistGenres;
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

let topTrackGenres = null;		// will store a hashmap that contains the genres and number of occurrences from the tracks

// get user's top listened tracks
router.get("/tracks", async (req, res) => {
    const topTracks = [];
    // get the genres of the top songs the user listens to through the TRACKS
    // a map that will map the genre to the amount of occurrences
    const trackGenres = new Map();

    await spotifyAPI
        .getMyTopTracks({ offset: 0, limit: 10 })	// gets the top 10 tracks that the user has recently listend to
        .then(async (data) => {
			// waits for all the promises to resolve 
            await Promise.all(
                data.body.items.map(async (item) => {
                    topTracks.push({
                        artists: item.artists, // object: important info: externals_urls{spotify}, id, name
                        id: item.id, // id of song
                        title: item.name, // name of song
                        album: item.album, // album that the song is in
                        image: item.album.images[0].url, // image of the song
                        albumURL: item.album.external_urls.spotify, // link to the song from Spotify
                        artistProfile: item.album.artists[0].external_urls.spotify, // link to the artist profile on Spotify
                        previewSong: item.preview_url, // 30-second clip of the song
                        trackNumber: item.track_number, // track number in the album
                        duration: {
                            hour: Math.floor(),
                            minutes: Math.floor(item.duration_ms / (1000 * 60)),
                            seconds: Math.floor((item.duration_ms / 1000) % 60),
                        }, // song length
                        popularity: item.popularity, // popularity score from 0 - 100
                    });
					
                    const artistIDS = item.artists.map((artist) => artist.id);		// get all the ids of the artists from the tracks

					// 
                    await Promise.all(
                        artistIDS.map(async (artistID) => {
                            try {
                                const artist = await spotifyAPI.getArtists([artistID]);
                                artist.body.artists.forEach((artistInfo) => {
                                    artistInfo.genres.forEach((genre) => {
                                        if (!trackGenres.has(genre)) trackGenres.set(genre, 1);
                                        else trackGenres.set(genre, trackGenres.get(genre) + 1);
                                    });
                                });
                            } catch (err) {
                                console.log(err);
                            }
                        })
                    );
                })
            );

            const sortedTopTrackGenres = new Map([...trackGenres.entries()].sort((a, b) => b[1] - a[1]));	// sort the hashmap by value in ascending order
            topTrackGenres = sortedTopTrackGenres;	
			// console.log(topTrackGenres);

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

// use the genres that the user listens to in order to look for recommended songs
const recommended = [];

router.get("recommended", (req, res) => {});

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
