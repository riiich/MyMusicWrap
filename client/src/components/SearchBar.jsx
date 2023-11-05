import { useState, useEffect } from "react";
import axios from "axios";
import { clientCredentials } from "../credentials";
import { Dashboard } from "./Dashboard.1";

const base_url = "https://api.spotify.com/v1";

export const SearchBar = ({ aToken }) => {
	const [searchArtist, setSearchArtist] = useState("");
	const [accessToken, setAccessToken] = useState("");

	useEffect(() => {
		setAccessToken();
	}, [accessToken]);

	return (
		<div className="search-bar">
			Access Token: {aToken}
			<input type="text" placeholder="Enter Artist..." />
			<button>Enter</button>
		</div>
	);
};
