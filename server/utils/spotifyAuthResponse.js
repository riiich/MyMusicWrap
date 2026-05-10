const getSpotifyErrorStatus = (err) => {
	return err?.statusCode || err?.body?.error?.status || err?.response?.status;
};

const getSpotifyErrorMessage = (err) => {
	return (
		err?.body?.error?.message ||
		err?.response?.data?.error?.message ||
		err?.message ||
		"Spotify request failed."
	);
};

const isSpotifyAuthError = (err) => {
	const status = getSpotifyErrorStatus(err);
	const message = getSpotifyErrorMessage(err).toLowerCase();

	return (
		status === 400 ||
		status === 401 ||
		status === 403 ||
		message.includes("access token") ||
		message.includes("refresh token") ||
		message.includes("expired")
	);
};

const sendAuthExpired = (
	res,
	msg = "Your Spotify session expired. Please log in again."
) => {
	return res.status(401).json({
		status: 401,
		code: "SPOTIFY_AUTH_EXPIRED",
		msg,
	});
};

const handleSpotifyRouteError = (res, err, fallbackMsg) => {
	console.log(fallbackMsg);
	console.log(err);

	if (isSpotifyAuthError(err)) {
		return sendAuthExpired(res);
	}

	return res.status(500).json({
		status: 500,
		msg: fallbackMsg,
	});
};

module.exports = {
	handleSpotifyRouteError,
	sendAuthExpired,
};
