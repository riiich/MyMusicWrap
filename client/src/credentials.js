/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { logoutForExpiredSession } from "./utils/authSession";

const TOKEN_WARNING_SECONDS = 60;	// 1 minute warning before access token expires
const LOGOUT_COUNTDOWN_MS = 10000;

const formatLocalExpiryTime = (expiresAtSeconds) => {
	return new Date(expiresAtSeconds * 1000).toLocaleTimeString("en-US", {
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
};

const getStoredExpiryTimestamp = () => {
	const expiresAt = Number(sessionStorage.getItem("accessTokenExpiresAt"));

	return expiresAt || undefined;
};

export const clientCredentials = (code) => {
	const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem("accessToken") || undefined);
	const [refreshToken, setRefreshToken] = useState(
		() => sessionStorage.getItem("refreshToken") || undefined,
	);
	const [expiresAt, setExpiresAt] = useState(getStoredExpiryTimestamp);
	const [showExpiryModal, setShowExpiryModal] = useState(false);
	const warningTimerRef = useRef(null);
	const logoutTimerRef = useRef(null);

	const clearAuthTimers = () => {
		if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
		if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
	};

	const logoutUser = () => {
		clearAuthTimers();
		logoutForExpiredSession();
	};

	const saveTokenSession = ({
		accessToken: nextAccessToken,
		refreshToken: nextRefreshToken,
		expiresIn: nextExpiresIn,
	}) => {
		if (nextAccessToken) {
			sessionStorage.setItem("accessToken", nextAccessToken);
			setAccessToken(nextAccessToken);
		}

		if (nextRefreshToken) {
			sessionStorage.setItem("refreshToken", nextRefreshToken);
			setRefreshToken(nextRefreshToken);
		}

		if (nextExpiresIn) {
			const nextExpiresAt = Math.floor(Date.now() / 1000) + nextExpiresIn;
			sessionStorage.setItem("accessTokenExpiresAt", String(nextExpiresAt));
			sessionStorage.setItem("accessTokenExpiresAtLocal", formatLocalExpiryTime(nextExpiresAt));
			setExpiresAt(nextExpiresAt);
		}
	};

	const refreshAccessToken = async () => {
		const activeRefreshToken = refreshToken || sessionStorage.getItem("refreshToken");

		if (!activeRefreshToken) {
			logoutUser();
			return;
		}

		try {
			clearAuthTimers();
			const response = await axios.post("http://localhost:3001/refresh", {
				refreshToken: activeRefreshToken,
			});

			saveTokenSession({
				accessToken: response.data.accessToken,
				expiresIn: response.data.expiresIn,
			});
			setShowExpiryModal(false);
		} catch (err) {
			console.log(err?.response?.data || err);
			logoutUser();
		}
	};

	const userLogin = async (spotifyCode) => {
		try {
			const response = await axios.post("http://localhost:3001/login", {
				// const response = await axios.post("https://my-music-wrap-server.vercel.app/login", {
				code: spotifyCode,
			});

			saveTokenSession({
				accessToken: response.data.accessToken,
				refreshToken: response.data.refreshToken,
				expiresIn: response.data.expiresIn,
			});

			setTimeout(() => {
				window.history.pushState({}, null, "/");
				window.location.reload();
			}, 1500);
		} catch (err) {
			console.log(err?.response?.data || err);
			logoutUser();
		}
	};

	useEffect(() => {
		if (!code) return;

		userLogin(code);
	}, [code]);

	useEffect(() => {
		if (!refreshToken || !expiresAt) return undefined;

		clearAuthTimers();

		const warningDelay = Math.max(
			(expiresAt - Math.floor(Date.now() / 1000) - TOKEN_WARNING_SECONDS) * 1000,
			0,
		);

		warningTimerRef.current = setTimeout(() => {
			setShowExpiryModal(true);
			logoutTimerRef.current = setTimeout(logoutUser, LOGOUT_COUNTDOWN_MS);
		}, warningDelay);

		return clearAuthTimers;
	}, [refreshToken, expiresAt]);

	return {
		accessToken,
		showExpiryModal,
		refreshAccessToken,
		logoutUser,
	};
};
