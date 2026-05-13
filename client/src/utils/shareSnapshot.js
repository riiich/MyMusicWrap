const SNAPSHOT_API_BASE_URL = "http://localhost:3001/snapshots";

export const TIMEFRAME_LABELS = {
	long: "~1+ years",
	medium: "~6 months",
	short: "~4 weeks",
};

export const buildShareSnapshot = ({
	userName,
	spotifyUserId,
	artistTimeRange,
	trackTimeRange,
	topArtists,
	topTracks,
}) => ({
	userName: userName || "My",
	spotifyUserId: spotifyUserId || "",
	artistTimeRange,
	trackTimeRange,
	artists: topArtists.slice(0, 5).map((artist) => ({
		id: artist?.id,
		name: artist?.artist,
		image: artist?.image,
		spotifyUrl: artist?.artistURL,
	})),
	tracks: topTracks.slice(0, 5).map((track) => ({
		id: track?.id,
		name: track?.title,
		image: track?.image,
		artists: track?.artists?.map((artist) => artist.name) || [],
		spotifyUrl: track?.trackURL,
	})),
});

export const createSharedSnapshot = async (snapshot) => {
	const response = await fetch(SNAPSHOT_API_BASE_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(snapshot),
	});

	if (!response.ok) {
		throw new Error("Unable to create shared snapshot.");
	}

	return response.json();
};

export const fetchSharedSnapshot = async (snapshotId) => {
	const response = await fetch(`${SNAPSHOT_API_BASE_URL}/${snapshotId}`);

	if (!response.ok) {
		throw new Error("Unable to load shared snapshot.");
	}

	return response.json();
};

export const shareSnapshotUrl = async (snapshotUrl) => {
	const shareData = {
		title: "MyMusicWrap Snapshot",
		text: "View my MyMusicWrap top artists and tracks.",
		url: snapshotUrl,
	};

	if (navigator.share) {
		await navigator.share(shareData);
		return "Snapshot shared.";
	}

	await navigator.clipboard.writeText(snapshotUrl);
	return "Snapshot link copied.";
};
