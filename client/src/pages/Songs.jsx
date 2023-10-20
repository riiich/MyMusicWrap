import { useState, useEffect } from "react";
import axios from "axios";
import { default as clientCredentials } from "../credentials";

const base_url = "https://api.spotify.com/v1";
const spotify_acc_url = "https://accounts.spotify.com";
// const CLIENT_ID = "addd071529764e90bb548a5b11edc35f";
// const CLIENT_SECRET = "63ebd81f64e240bc80347eea1b7021b1";
const drakeId = "3TVXtAsR1Inumwj472S9r4?si=hCP5tOX6ThCnz_hacVo0mw";
const latestDrakeAlbum = "4czdORdCWP9umpbhFXK2fW";

// Spotify ID is the value that comes right after the 'open.spotify.com/artist' URI
// Drake: https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4?si=S60RiFjpR6yxiKQWlR0eQQ
//https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4?si=hCP5tOX6ThCnz_hacVo0mw

export const Songs = () => {
	const [artistGenre, setArtistGenre] = useState([]);
	const [artist, setArtist] = useState(null);
	const [accessToken, setAccessToken] = useState(""); // need access token in order to get data from spotify
	const [album, setAlbum] = useState({
		album_type: "",
		total_tracks: 0,
		image: "",
		name: "",
		release_date: "",
		artists: [],
		tracks: [],
		popularity: 0,
	});
	const { userCreds, credError, loading } = clientCredentials();	
	const [drakeID, setDrakeID] = useState("");

	// gets one song
	const getAccessToken = async () => {
		// console.log(userCreds);
		await axios
			.post(
				`${spotify_acc_url}/api/token`,
				`grant_type=client_credentials&client_id=${userCreds.clientId}&client_secret=${userCreds.clientSecret}`,
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				}
			)
			.then((res) => {
				console.log(res.data);
				setAccessToken(res.data.access_token);
			})
			.catch((err) => {
				console.log(credError);
			});
	};

	// get one artist based off their Spotify ID
	const getArtist = async () => {
		await axios
			.get(`${base_url}/artists/${drakeId}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.then((res) => {
				// console.log(res.data);
				setArtist(res.data);
				getGenres(res.data);
				getDrakeID(res.data);
				// console.log(drakeID);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getDrakeID = (response) => {
		setDrakeID(response.id);
	};

	// adding the genres into artistGenre state
	const getGenres = (response) => {
		setArtistGenre(
			response.genres.map((genre) => {
				genre = [...artistGenre, genre];
				return genre;
			})
		);
	};

	// if it doesn't work, add the authorization header
	const getAlbums = async () => {
		await axios
			.get(`${base_url}/albums/${latestDrakeAlbum}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.then((res) => {
				// console.log(res.data);
				getAlbum(res.data);
				// console.log(album);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getAlbum = (response) => {
		setAlbum({
			album_type: response?.album_type,
			total_tracks: response?.total_tracks,
			image: response?.images[0].url,
			name: response?.name,
			release_date: response?.release_date,
			artists: response?.artists.map((artist) => artist.name),
			tracks: response?.tracks.items.map((track) => track.name),
			popularity: response?.popularity,
		});
	};

	return (
		<div className="song-list">
			{artist !== null ? <img src={artist?.images[0].url} alt="drake" width={300} height={300} /> : ""}
			<p><strong>Artist: </strong>{artist?.name}</p>
			<p><strong>Follower Count:</strong> {artist?.followers.total}</p>
			<p><strong>Genres:</strong> {artistGenre.length > 0 ? artistGenre.map((item) => `${item} || `) : ""}</p>

			<div className="lastest-album">
				<p><strong>Album Type:</strong> {album.album_type}</p>
				<><p><strong>Artists:</strong> </p>{album.artists.map((artist) => <p>{artist}</p>)}</>
				<p><strong>Name:</strong> {album.name}</p>
				<img src={album.image} alt="drake album" width="150" height="150"/>
				<p><strong>Release Date:</strong> {album.release_date}</p>
				<p><strong>Popularity:</strong> {album.popularity}</p>
				<>
					<p><strong>Song Tracks:</strong> </p>
					{album.tracks.map((track, i) => <p key={i}>{i+1}. {track}</p> )}
				</>
				
			</div>

			<button onClick={getAccessToken}>Token!</button>
			<button onClick={getArtist}>Artist!</button>
			<button onClick={getAlbums}>Top Album!</button>
			{/* {artist !== null ? <button onClick={getGenres}>Genres!</button> : ""} */}
		</div>
	);
};