import { useState, useEffect } from "react";
import axios from "axios";
import { Dashboard } from "./Dashboard";

export const UserTopSongs = ({ accessToken }) => {
	const [userInfo, setUserInfo] = useState([]);



	useEffect(() => {
		if (!accessToken) return;

		// const retrieveTopSongsFromUser = async (aToken) => {
		axios
			.get("http://localhost:3001/mostlistened", {
				params: {accessToken},
			})
			.then((res) => {
				// console.log("anything1?");
				// console.log(res.data.topArtists);
				// console.log("anything2?");
				setUserInfo(res.data.topArtists);
			})
			.catch((err) => {
				console.log(err);
			});
		// };

		console.log(userInfo);
			
		// retrieveTopSongsFromUser(aToken);
	}, [accessToken]);

	return (
	<div>
		<h1>Top Artists:</h1>
		{
			// userInfo?.map(item => (
			// 	<p>{item}</p>
			// ))
		}
	</div>
	);
};
