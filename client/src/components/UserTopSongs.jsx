import { useState, useEffect } from "react";
import axios from "axios";
import { ListArtists } from "./ListArtists";
import { ListTracks } from "./ListTracks";
import { RecommendedArtists } from "./RecommendedArtists";

export const UserTopSongs = () => {
	const [topArtists, setTopArtists] = useState([]);
	const [topTracks, setTopTracks] = useState([]);
	const [recommendedArtists, setRecommendedArtists] = useState([]);

	const retrieveTopArtistsFromUser = async (accessToken) => {
		await axios
			.get("http://localhost:3001/mostlistened/artists", {
				params: { accessToken },
			})
			.then((res) => {
				setTopArtists(res.data.topArtists);
				console.log(res.data.msg);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const retrieveTopTracksFromUser = async (accessToken) => {
		await axios	
			.get('http://localhost:3001/mostlistened/tracks', {
				params: { accessToken },
			})
			.then(res => {
				setTopTracks(res.data.topTracks);
				console.log(res.data.msg);
			})
			.catch(err => {
				console.log(err);
			})
	}

	useEffect(() => {
		if (!localStorage.getItem("accessToken")) return;

		retrieveTopArtistsFromUser(localStorage.getItem("accessToken"));
		retrieveTopTracksFromUser(localStorage.getItem("accessToken"));
	}, [localStorage.getItem("accessToken")]);

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

			<div className="user-recommended-artists">
				<h1>Recommended Artists</h1>
				<RecommendedArtists userInfo={recommendedArtists} />
			</div>
		</div>
	);
};
