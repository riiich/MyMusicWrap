/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";

export const clientCredentials = (code) => {
	const [accessToken, setAccessToken] = useState();
	const [refreshToken, setRefreshToken] = useState();
	const [expiresIn, setExpiresIn] = useState();

	// runs this function every time there is a new url code
	useEffect(() => {
		// fetches the client credentials (client id and client secret from their spotify account)
		axios
			.post("http://localhost:3001/login", {
				code, // passing the code through the api call
			})
			.then((res) => {
				// console.log(res.data);
				setAccessToken(res.data.accessToken);
				setRefreshToken(res.data.refreshToken);
				setExpiresIn(res.data.expiresIn);
				window.history.pushState({}, null, "/"); // removes the code from the url
			})
			.catch((err) => {
				console.log(err);
				// setTimeout(() => {
				window.location = "/"; // redirects back to home page if there is an error
				// }, 3000);
			});
	}, [code]);

	// refresh token used when current token is expiring
	useEffect(() => {
		axios
			.post("http://localhost:3001/refresh", {
				refreshToken, // passing the refresh token through the api call
			})
			.then((res) => {
				console.log(res.data);
				setAccessToken(res.data.accessToken);
				setExpiresIn(res.data.expiresIn);
			})
			.catch((err) => {
				console.log(err);
				// setTimeout(() => {
				// window.location = "/"; // redirects back to home page if there is an error
				// }, 3000);
			});
	}, [refreshToken, expiresIn]);

	return accessToken;
};

// export default clientCredentials;
