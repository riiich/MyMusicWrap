/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";

export const clientCredentials = (code) => {
	const [accessToken, setAccessToken] = useState();
	const [refreshToken, setRefreshToken] = useState();
	const [expiresIn, setExpiresIn] = useState();
	const spotifyUserCode = code;

	// console.log(spotifyUserCode);
	// console.log(code);

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
				// setExpiresIn(70);
				console.log("hi");
				console.log(res.data.msg);
				setTimeout(() => {
					window.history.pushState({}, null, "/"); // removes the code from the url
				}, 1500);
			})
			.catch((err) => {
				console.log(err);
				setTimeout(() => {
					window.location = "/"; // redirects back to home page if there is an error
				}, 2000);
			});
	}, [code]);

	// refresh token used when current token is expiring
	useEffect(() => {
		// don't do anything if there is no refresh token or expiresIn
		if (!refreshToken || !expiresIn) return;

		// continuously get new access token when it's about (1 min) to expire
		const refreshInterval = setInterval(() => {
			axios
				.post("http://localhost:3001/refresh", {
					refreshToken, // passing the refresh token through the api call
				})
				.then((res) => {
					setAccessToken(res.data.accessToken);
					setExpiresIn(res.data.expiresIn);
					// setExpiresIn(70);
					console.log("hi1");
					// sessionStorage.removeItem("accessToken"); // clear the session storage whenever the access token is expired
					// window.dispatchEvent(new Event("storage"));
				})
				// .then((res) => {
				// 	localStorage.setItem("accessToken", res.data.accessToken); // renew the access token to the new acess token
				// })
				.catch((err) => {
					console.log(err);
					setTimeout(() => {
						window.location = "/"; // redirects back to home page if there is an error
					}, 2000);
				});
		}, (expiresIn - 60) * 1000);

		// clear the interval if there is any error where the refresh token or expiresIn changes before an actual refresh,
		//   this makes it so that we don't potentially use an incorrect refresh token
		return () => clearInterval(refreshInterval);
	}, [refreshToken, expiresIn]);

	return accessToken;
};

// export default clientCredentials;
