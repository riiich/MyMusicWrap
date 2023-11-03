import { useState, useEffect } from "react";
import axios from "axios";
import { ListArtists } from "./ListArtists";
import { ListTracks } from "./ListTracks";
import { RecommendedArtists } from "./RecommendedArtists";

export const UserTopSongs = () => {
	const [topArtists, setTopArtists] = useState([]);
	const [topTracks, setTopTracks] = useState([]);
	const [recommendedArtists, setRecommendedArtists] = useState([]);
	const [recommendedTracks, setRecommendedTracks] = useState([]);
	const [loadingArtists, setLoadingArtists] = useState(true);
	const [loadingTracks, setLoadingTracks] = useState(true);
	const [loadingRecommended, setLoadingRecommended] = useState(true);
	const accessToken = sessionStorage.getItem("accessToken");

	// refactor the below to only async/await (rmb that using async/await eliminates promise chaining)
	const retrieveTopArtistsFromUser = async (accessToken) => {
		try {
			const response = await axios.get("http://localhost:3001/mostlistened/artists", {
				params: { accessToken },
			});

			setTopArtists(response.data.topArtists);
			setLoadingArtists(false);
		} catch (err) {
			console.error(err);
			setLoadingArtists(false);
		}
	};

	const retrieveTopTracksFromUser = async (accessToken) => {
		try {
			const response = await axios.get("http://localhost:3001/mostlistened/tracks", {
				params: { accessToken },
			});

			setTopTracks(response.data.topTracks);
			setLoadingTracks(false);
			console.log(response.data.msg);
		} catch (err) {
			console.error(err);
		}
	};

	const retrieveRecommendedTracks = async (accessToken) => {
		try {
			const response = await axios.get("http://localhost:3001/mostlistened/recommendedtracks", {
				params: { accessToken },
			});

			setRecommendedArtists([]);
			console.log(response.data);
			setRecommendedArtists(response.data.recommended);
			setLoadingRecommended(false);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (!accessToken) return;

		console.log("useEffect1 triggered");

		retrieveTopArtistsFromUser(accessToken);
		setLoadingArtists(true);
		// retrieveTopTracksFromUser(accessToken);
		// retrieveRecommendedTracks(accessToken);
	}, [accessToken]);

	useEffect(() => {
		if (!accessToken) return;

		console.log("useEffect2 triggered");
		// retrieveTopArtistsFromUser(accessToken);
		retrieveTopTracksFromUser(accessToken);
		setLoadingTracks(true);
		// retrieveRecommendedTracks(accessToken);
	}, [accessToken]);

	useEffect(() => {
		if (!accessToken) return;
		
		console.log("useEffect3 triggered");
		// retrieveTopArtistsFromUser(accessToken);
		// retrieveTopTracksFromUser(accessToken);
		retrieveRecommendedTracks(accessToken);
		setLoadingRecommended(true);
	}, [accessToken]);

	/*
		TO-DOS:
			- set a timer before the user is able to reload the recommended tracks so that they aren't
				 able to make so many requests at once (rate limit to 1 reload / 3s)
	*/

	return (
		<div className="user-top-container">
			<div className="user-top-artists">
				<h1>Your Top 10 Artists</h1>
				<ListArtists userInfo={topArtists} loading={loadingArtists} />
			</div>

			<div className="user-top-tracks">
				<h1>Top Tracks</h1>
				<ListTracks userInfo={topTracks} loading={loadingTracks} />
			</div>

			<div className="user-recommended-artists">
				<h1>Recommended Tracks</h1>
				<button
					onClick={() => {
						retrieveRecommendedTracks(accessToken);
					}}
				>
					Load More
				</button>
				<RecommendedArtists userInfo={recommendedArtists} loading={loadingRecommended} />
			</div>
		</div>
	);
};
