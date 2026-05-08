const LIVE_SHARE_ORIGIN = "https://my-music-wrap.vercel.app";

export const TIMEFRAME_LABELS = {
	long: "~1+ years",
	medium: "~6 months",
	short: "~4 weeks",
};

export const encodeSnapshot = (snapshot) => {
	return window.btoa(unescape(encodeURIComponent(JSON.stringify(snapshot))));
};

export const decodeSnapshot = (encodedSnapshot) => {
	if (!encodedSnapshot) return null;

	try {
		const json = decodeURIComponent(escape(window.atob(encodedSnapshot)));
		return JSON.parse(json);
	} catch (err) {
		console.error("Unable to decode shared snapshot", err);
		return null;
	}
};

export const decodeSnapshotFromSearch = (search) => {
	const encodedSnapshot = new URLSearchParams(search).get("s");
	return decodeSnapshot(encodedSnapshot);
};

export const buildShareSnapshot = ({
	userName,
	artistTimeRange,
	trackTimeRange,
	topArtists,
	topTracks,
}) => ({
	userName: userName || "My",
	artistTimeRange,
	trackTimeRange,
	artists: topArtists.slice(0, 5).map((artist) => ({
		id: artist?.id,
		name: artist?.artist,
		image: artist?.image,
	})),
	tracks: topTracks.slice(0, 5).map((track) => ({
		id: track?.id,
		name: track?.title,
		image: track?.image,
		artists: track?.artists?.map((artist) => artist.name) || [],
	})),
});

export const getShareOrigin = () => {
	const currentOrigin = window.location.origin;

	if (currentOrigin.includes("127.0.0.1") || currentOrigin.includes("localhost")) {
		return currentOrigin;
	}

	return LIVE_SHARE_ORIGIN;
};

export const buildShareUrl = (snapshot) => {
	return `${getShareOrigin()}/share?s=${encodeSnapshot(snapshot)}`;
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
