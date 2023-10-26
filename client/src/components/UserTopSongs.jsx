import { useState, useEffect } from "react";
import axios from "axios";
import { ListArtists } from "./ListArtists";
import { ListTracks } from "./ListTracks";
import { RecommendedArtists } from "./RecommendedArtists";

export const UserTopSongs = () => {
	const [topArtists, setTopArtists] = useState([]);
	const [topTracks, setTopTracks] = useState(['asjdn', 'askdnlkajsnd',' jkabdsk']);
	const [recommendedArtists, setRecommendedArtists] = useState(['hi1', 'hi2', 'hi3', 'hi4', 'hi5']);

	useEffect(() => {
		if (!sessionStorage.getItem("accessToken")) return;

		// console.log(sessionStorage.getItem("accessToken"));

		const retrieveTopSongsFromUser = async (accessToken) => {
			await axios
				.get("http://localhost:3001/mostlistened", {
					params: { accessToken },
				})
				.then((res) => {
					setTopArtists(res.data.topArtists);
				})
				.catch((err) => {
					console.log(err);
				});
		};

		retrieveTopSongsFromUser(sessionStorage.getItem("accessToken"));
	}, [sessionStorage.getItem("accessToken")]);

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
