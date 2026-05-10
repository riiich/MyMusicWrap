const crypto = require("crypto");

const ID_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DEFAULT_ID_LENGTH = 10;
const LOCAL_CLIENT_URL = "http://127.0.0.1:3000";
const LIVE_CLIENT_URL = "https://my-music-wrap.vercel.app";

const createShortId = (length = DEFAULT_ID_LENGTH) => {
	let id = "";

	for (let i = 0; i < length; i += 1) {
		const randomIndex = crypto.randomInt(0, ID_ALPHABET.length);
		id += ID_ALPHABET[randomIndex];
	}

	return id;
};

const getClientShareBaseUrl = () => {
	return process.env.CLIENT_SHARE_URL || process.env.CLIENT_URL || LOCAL_CLIENT_URL;
};

const createShortUrl = (snapshotId, baseUrl = getClientShareBaseUrl()) => {
	const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
	return `${normalizedBaseUrl}/share/${snapshotId}`;
};

module.exports = {
	createShortId,
	createShortUrl,
	LOCAL_CLIENT_URL,
	LIVE_CLIENT_URL,
};
