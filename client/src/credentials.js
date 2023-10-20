/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";

const clientCredentials = (code) => {
	const [accessToken, setAccessToken] = useState("");
	const [refreshToken, setRefreshToken] = useState("");
	const [expiresIn, setExpiresIn] = useState();

    // fetches the client credentials (client id and client secret from their spotify account)
	const fetchUserCredentials = async (code) => {
		await axios
			.post('http://localhost:3001/login', {code})
			.then((res) => {
				setAccessToken(res.data.accessToken);
				setRefreshToken(res.data.refreshToken);
				setExpiresIn(res.data.expiresIn);
			})
			.catch((err) => {
				console.log(err); 
				window.location = '/';
			})
	};

    // runs this function every time there is a new url
	useEffect(() => {
		fetchUserCredentials(code);
	}, [code]);

	return accessToken;
};

export default clientCredentials;