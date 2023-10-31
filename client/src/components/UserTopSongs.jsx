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
	const accessToken = sessionStorage.getItem("accessToken");
	
	// refactor the below to only async/await (rmb that using async/await eliminates promise chaining)
	const retrieveTopArtistsFromUser = async (accessToken) => {
		try {
			const response = await axios.get("http://localhost:3001/mostlistened/artists", {
				params: { accessToken },
			});

			setTopArtists(response.data.topArtists);
		} catch (err) {
			console.log(err);
		}
	};

	const retrieveTopTracksFromUser = async (accessToken) => {
		try {
			const response = await axios.get("http://localhost:3001/mostlistened/tracks", {
				params: { accessToken },
			});

			setTopTracks(response.data.topTracks);
			console.log(response.data.msg);
		} catch (err) {
			console.log(err);
		}
	};

	const retrieveRecommendedTracks = async (accessToken) => {
		try {
			const response = await axios.get("http://localhost:3001/mostlistened/recommended", {
				params: { accessToken },
			});

			// console.log(response.data);
			// setRecommendedArtists(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (!accessToken) return;

		retrieveTopArtistsFromUser(accessToken);
		retrieveTopTracksFromUser(accessToken);
		retrieveRecommendedTracks(accessToken);
	}, [accessToken]);

	return (
		<div className="user-top-container">
			<div className="user-top-artists">
				<h1>Your Top 10 Artists</h1>
				<ListArtists userInfo={topArtists} />
			</div>

			<div className="user-top-tracks">
				<h1>Top Tracks</h1>
				<ListTracks userInfo={topTracks} />
			</div>

			{/* <div className="user-recommended-artists">
				<h1>Recommended Artists</h1>
				<RecommendedArtists userInfo={recommendedArtists} />
			</div> */}
		</div>
	);
};
