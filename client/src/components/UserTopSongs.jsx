import { useState, useEffect } from "react";
import axios from "axios";
import { ListArtists } from "./ListArtists";
import { ListTracks } from "./ListTracks";

export const UserTopSongs = () => {
	const [topArtists, setTopArtists] = useState([]);
	const [topTracks, setTopTracks] = useState(['asjdn', 'askdnlkajsnd',' jkabdsk']);

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
				<h1>Top Artists</h1>
				<ListArtists userInfo={topArtists} />
			</div>

			<div className="user-top-tracks">
				<h1>Top Tracks</h1>
				<ListTracks userInfo={topTracks} />
			</div>
		</div>
	);
};
