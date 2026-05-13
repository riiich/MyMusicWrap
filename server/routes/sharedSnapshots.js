const router = require("express").Router();
const SharedSnapshot = require("../schema/sharedSnapshot");
const { createShortId, createShortUrl } = require("../utils/createShortUrl");

const MAX_ID_ATTEMPTS = 6;
const VALID_TIME_RANGES = new Set(["short", "medium", "long", ""]);

const cleanText = (value, fallback = "") => {
	if (typeof value !== "string") return fallback;
	return value.trim().slice(0, 240);
};

const cleanUrl = (value) => {
	if (typeof value !== "string") return "";
	return value.trim().slice(0, 1000);
};

const cleanArtists = (artists = []) => {
	if (!Array.isArray(artists)) return [];

	return artists.slice(0, 10).map((artist) => ({
		name: cleanText(artist?.name),
		image: cleanUrl(artist?.image),
		spotifyUrl: cleanUrl(artist?.spotifyUrl),
	}));
};

const cleanTracks = (tracks = []) => {
	if (!Array.isArray(tracks)) return [];

	return tracks.slice(0, 10).map((track) => ({
		name: cleanText(track?.name),
		image: cleanUrl(track?.image),
		artists: Array.isArray(track?.artists)
			? track.artists.slice(0, 8).map((artistName) => cleanText(artistName)).filter(Boolean)
			: [],
		spotifyUrl: cleanUrl(track?.spotifyUrl),
	}));
};

const cleanTimeRange = (timeRange) => {
	const normalizedTimeRange = cleanText(timeRange);
	return VALID_TIME_RANGES.has(normalizedTimeRange) ? normalizedTimeRange : "";
};

const createUniqueSnapshotId = async () => {
	for (let attempt = 0; attempt < MAX_ID_ATTEMPTS; attempt += 1) {
		const snapshotId = createShortId();
		const existingSnapshot = await SharedSnapshot.exists({ snapshotId });

		if (!existingSnapshot) return snapshotId;
	}

	throw new Error("Unable to create a unique snapshot id");
};

router.get("/", (req, res) => {
	res.json({
		status: 200,
		msg: "Hitting shared snapshots endpoint!",
	});
});

router.post("/", async (req, res) => {
	try {
		const snapshotId = await createUniqueSnapshotId();
		const snapshot = await SharedSnapshot.create({
			snapshotId,
			userName: cleanText(req.body.userName, "A listener"),
			spotifyUserId: cleanText(req.body.spotifyUserId),
			artistTimeRange: cleanTimeRange(req.body.artistTimeRange),
			trackTimeRange: cleanTimeRange(req.body.trackTimeRange),
			artists: cleanArtists(req.body.artists),
			tracks: cleanTracks(req.body.tracks),
		});

		res.status(201).json({
			snapshotId: snapshot.snapshotId,
			shareUrl: createShortUrl(snapshot.snapshotId),
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			msg: "Unable to create shared snapshot.",
		});
	}
});

router.get("/:snapshotId", async (req, res) => {
	try {
		const snapshot = await SharedSnapshot.findOneAndUpdate(
			{ snapshotId: req.params.snapshotId },
			{ $inc: { numOfViews: 1 } },
			{
				new: true,
				projection: { _id: 0, __v: 0 },
			},
		).lean();

		if (!snapshot) {
			return res.status(404).json({
				msg: "Snapshot not found.",
			});
		}

		return res.status(200).json(snapshot);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			msg: "Unable to retrieve shared snapshot.",
		});
	}
});

module.exports = router;
