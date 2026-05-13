const { pollRecentlyPlayedForTrackedUsers } = require("../services/recentlyPlayedPoller");

const DEFAULT_POLL_INTERVAL_MS = 5 * 60 * 1000;

let pollTimer = null;
let isPolling = false;

const getPollInterval = () => {
	const interval = Number(process.env.RECENTLY_PLAYED_POLL_INTERVAL_MS);
	return Number.isFinite(interval) && interval > 0 ? interval : DEFAULT_POLL_INTERVAL_MS;
};

const runRecentlyPlayedPoll = async () => {
	if (isPolling) {
		console.log("Recently played poll skipped because the previous run is still active.");
		return null;
	}

	isPolling = true;

	try {
		const result = await pollRecentlyPlayedForTrackedUsers();
		console.log("Recently played poll completed.", result);
		return result;
	} catch (err) {
		console.log("Recently played poll failed.");
		console.log(err);
		return null;
	} finally {
		isPolling = false;
	}
};

const startRecentlyPlayedCron = () => {
	if (process.env.ENABLE_RECENTLY_PLAYED_POLLING !== "true") {
		console.log("Recently played polling is disabled.");
		return;
	}

	if (pollTimer) return;

	const interval = getPollInterval();
	pollTimer = setInterval(runRecentlyPlayedPoll, interval);
	console.log(`Recently played polling started. Interval: ${interval}ms`);
};

const stopRecentlyPlayedCron = () => {
	if (!pollTimer) return;

	clearInterval(pollTimer);
	pollTimer = null;
	console.log("Recently played polling stopped.");
};

module.exports = {
	runRecentlyPlayedPoll,
	startRecentlyPlayedCron,
	stopRecentlyPlayedCron,
};
