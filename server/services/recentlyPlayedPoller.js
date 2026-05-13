const SpotifyRefreshToken = require("../schema/spotifyRefreshToken");
const SpotifyPlayHistory = require("../schema/spotifyPlayHistory");
const { refreshSpotifyAccessToken } = require("../utils/refreshSpotifyAccessToken");

const RECENTLY_PLAYED_LIMIT = 50;

const getTrackImage = (track) => {
	const images = track?.album?.images || [];
	return images[0]?.url || "";
};

const mapRecentlyPlayedItem = (spotifyUserId, item) => {
	const track = item?.track;

	return {
		updateOne: {
			filter: {
				spotifyUserId,
				trackId: track?.id,
				playedAt: new Date(item.played_at),
			},
			update: {
				$setOnInsert: {
					spotifyUserId,
					playedAt: new Date(item.played_at),
					trackId: track?.id,
					trackName: track?.name || "",
					albumName: track?.album?.name || "",
					artists: Array.isArray(track?.artists)
						? track.artists.map((artist) => artist.name).filter(Boolean)
						: [],
					durationMs: track?.duration_ms || 0,
					spotifyUrl: track?.external_urls?.spotify || "",
					image: getTrackImage(track),
					contextUri: item?.context?.uri || "",
				},
			},
			upsert: true,
		},
	};
};

const pollRecentlyPlayedForUser = async (storedUserSession) => {
	const spotifyUserId = storedUserSession.spotifyUserId;
	const { spotifyAPI } = await refreshSpotifyAccessToken(spotifyUserId);
	const after = storedUserSession.lastRecentlyPlayedPolledAt?.getTime();
	const options = {
		limit: RECENTLY_PLAYED_LIMIT,
	};

	if (after) {
		options.after = after;
	}

	const response = await spotifyAPI.getMyRecentlyPlayedTracks(options);
	const items = (response.body?.items || []).filter(
		(item) => item?.track?.id && item?.played_at
	);

	if (items.length === 0) {
		if (!storedUserSession.lastRecentlyPlayedPolledAt) {
			storedUserSession.lastRecentlyPlayedPolledAt = new Date();
			await storedUserSession.save();
		}

		return {
			spotifyUserId,
			fetched: 0,
			inserted: 0,
			lastRecentlyPlayedPolledAt: storedUserSession.lastRecentlyPlayedPolledAt,
		};
	}

	const operations = items.map((item) => mapRecentlyPlayedItem(spotifyUserId, item));
	const writeResult = await SpotifyPlayHistory.bulkWrite(operations, { ordered: false });
	const newestPlayedAt = items.reduce((latest, item) => {
		const playedAt = new Date(item.played_at);
		return playedAt > latest ? playedAt : latest;
	}, new Date(0));

	storedUserSession.lastRecentlyPlayedPolledAt = newestPlayedAt;
	await storedUserSession.save();

	return {
		spotifyUserId,
		fetched: items.length,
		inserted: writeResult.upsertedCount || 0,
		lastRecentlyPlayedPolledAt: newestPlayedAt,
	};
};

const pollRecentlyPlayedForTrackedUsers = async () => {
	const trackedUserSessions = await SpotifyRefreshToken.find({ trackingEnabled: true });
	const results = [];

	for (const storedUserSession of trackedUserSessions) {
		try {
			const result = await pollRecentlyPlayedForUser(storedUserSession);
			results.push({
				ok: true,
				...result,
			});
		} catch (err) {
			console.log(`Unable to poll recently played tracks for ${storedUserSession.spotifyUserId}`);
			console.log(err);
			results.push({
				ok: false,
				spotifyUserId: storedUserSession.spotifyUserId,
				msg: err.message,
			});
		}
	}

	return {
		trackedUsers: trackedUserSessions.length,
		results,
	};
};

module.exports = {
	pollRecentlyPlayedForTrackedUsers,
	pollRecentlyPlayedForUser,
};
