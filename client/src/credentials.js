/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";

export const clientCredentials = (code) => {
	const [accessToken, setAccessToken] = useState();
	const [refreshToken, setRefreshToken] = useState();
	const [expiresIn, setExpiresIn] = useState();
	const spotifyUserCode = code;
	const today = new Date();
	let currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	console.log(spotifyUserCode);
	console.log(code);

	const userLogin = async (code) => {
		try {
			const response = await axios.post("http://localhost:3001/login", {
				code, // passing the code through the api call
			});
			
			console.log(response.data);
			console.log(response.data.accessToken);
			console.log(response.data.refreshToken);
			setAccessToken(response.data.accessToken);
			setRefreshToken(response.data.refreshToken);
			// setExpiresIn(response.data.expiresIn);
			setExpiresIn(70);
			console.log(currentTime);

			// *********** WORK ON THE CODE, ACCESS TOKEN, AND REFRESH TOKEN
			setTimeout(() => {
				sessionStorage.setItem("refreshToken", response.data.refreshToken);
				window.history.pushState({}, null, "/"); // removes the code from the url
				window.location.reload();
			}, 1500);
		} catch (err) {
			console.log(err);
			sessionStorage.clear();
			setTimeout(() => {
				window.location = "/"; // redirects back to home page if there is an error
			}, 2000);
		}
	};

	// runs this function every time there is a new url code
	useEffect(() => {
		// fetches the client credentials (client id and client secret from their spotify account)
		// axios
		// 	.post("http://localhost:3001/login", {
		// 		code, // passing the code through the api call
		// 	})
		// 	// .then((response) => {
		// 	// 	return response.json();
		// 	// })
		// 	.then((data) => {
		// 		setAccessToken(data.data.accessToken);
		// 		setRefreshToken(data.data.refreshToken);
		// 		// setExpiresIn(res.data.expiresIn);
		// 		setExpiresIn(70);
		// 		// console.log(refreshToken);
		// 		console.log(data.data.msg);
		// 		console.log(currentTime);
		// 		setTimeout(() => {
		// 			window.history.pushState({}, null, "/"); // removes the code from the url
		// 		}, 2500);
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 		setTimeout(() => {
		// 			window.location = "/"; // redirects back to home page if there is an error
		// 		}, 2000);
		// 	});

		userLogin(code);
	}, [code]);

	const userRefresh = async (code) => {
		try {
			const response = await axios.post("http://localhost:3001/refresh", {
				refreshToken, // passing the code through the api call
			});

			console.log(response.data);
			console.log(response.data.accessToken);
			setAccessToken(response.data.accessToken);
			// setExpiresIn(response.data.expiresIn);
			setExpiresIn(90);
			console.log(currentTime);
		} catch (err) {
			console.log(err);
			sessionStorage.clear();
			setTimeout(() => {
				window.location = "/"; // redirects back to home page if there is an error
			}, 2000);
		}
	};

	// refresh token used when current token is expiring
	useEffect(() => {
		// don't do anything if there is no refresh token or expiresIn
		if (!refreshToken || !expiresIn) return;

		// continuously get new access token when it's about (1 min) to expire
		const refreshInterval = setInterval(() => {
			// axios
			// 	.post("http://localhost:3001/refresh", {
			// 		refreshToken, // passing the refresh token through the api call
			// 	})
			// 	.then((res) => {
			// 		console.log(currentTime);
			// 		setAccessToken(res.data.accessToken);
			// 		// setExpiresIn(res.data.expiresIn);
			// 		console.log(expiresIn);
			// 		setExpiresIn(70);
			// 		console.log("hi1");
			// 		// sessionStorage.removeItem("accessToken"); // clear the session storage whenever the access token is expired
			// 		// window.dispatchEvent(new Event("storage"));
			// 	})
			// 	// .then((res) => {
			// 	// 	sessionStorage.setItem("accessToken", res.data.accessToken); // renew the access token to the new acess token
			// 	// })
			// 	.catch((err) => {
			// 		console.log(err);
			// 		setTimeout(() => {
			// 			window.location = "/"; // redirects back to home page if there is an error
			// 		}, 2000);
			// 	});
			userRefresh(code);
		}, (expiresIn - 60) * 1000);

		// clear the interval if there is any error where the refresh token or expiresIn changes before an actual refresh,
		//   this makes it so that we don't potentially use an incorrect refresh token
		return () => clearInterval(refreshInterval);
	}, [refreshToken, expiresIn]);

	return accessToken;
};
