import { useState, useEffect } from "react";
import axios from 'axios';
import clientCredentials from "../credentials";

const base_url = "https://api.spotify.com/v1";

export const SearchBar = () => {
	const [searchArtist, setSearchArtist] = useState("");
	const [accessToken, setAccessToken] = useState("");
	const { userCreds, credError, loading } = clientCredentials();

	const getAccessToken = async () => {
		console.log(userCreds);
		await axios
			.post('https://accounts.spotify.com/api/token', 
				`grant_type=client_credentials&client_id=${userCreds.clientId}&client_secret=${userCreds.clientSecret}`,
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
				}
			)
			.then((res) => {
				console.log(res.data);
				setAccessToken(res.data.access_token);
			})
			.catch((err) => {
				console.log(err);
			})
	};

	useEffect(() => {
		
		getAccessToken();
	}, [])

	return (
		<div className="search-bar">
			<input type="text" placeholder="Enter Artist..." />
			<button>Enter</button>
		</div>
	);
};
