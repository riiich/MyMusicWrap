const router = require("express").Router();
const SpotifyPlayHistory = require("../schema/spotifyPlayHistory");
const SpotifyRefreshToken = require("../schema/spotifyRefreshToken");
const { runRecentlyPlayedPoll } = require("../jobs/recentlyPlayedCron");

router.get("/", async (req, res) => {
	try {
		const trackedUsers = await SpotifyRefreshToken.countDocuments({ trackingEnabled: true });
		const storedPlays = await SpotifyPlayHistory.countDocuments();

		return res.json({
			status: 200,
			trackedUsers,
			storedPlays,
			pollingEnabled: process.env.ENABLE_RECENTLY_PLAYED_POLLING === "true",
			pollIntervalMs: Number(process.env.RECENTLY_PLAYED_POLL_INTERVAL_MS) || 5 * 60 * 1000,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			msg: "Unable to load tracking status.",
		});
	}
});

router.post("/poll-now", async (req, res) => {
	try {
		const result = await runRecentlyPlayedPoll();

		return res.json({
			status: 200,
			result,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			msg: "Unable to run tracking poll.",
		});
	}
});

module.exports = router;
