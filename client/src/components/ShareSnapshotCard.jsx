import { useState } from "react";
import { buildShareSnapshot, createSharedSnapshot, shareSnapshotUrl } from "../utils/shareSnapshot";

export const ShareSnapshotCard = ({
	artistTimeRange,
	trackTimeRange,
	topArtists,
	topTracks,
}) => {
	const [shareStatus, setShareStatus] = useState("");
	const [isSharing, setIsSharing] = useState(false);
	const hasSelectedTimeframes = Boolean(artistTimeRange && trackTimeRange);
	const hasSnapshotData = topArtists.length > 0 && topTracks.length > 0;
	const canShare = hasSelectedTimeframes && hasSnapshotData;

	const shareSnapshot = async () => {
		const snapshot = buildShareSnapshot({
			userName: sessionStorage.getItem("userName"),
			artistTimeRange,
			trackTimeRange,
			topArtists,
			topTracks,
		});

		try {
			setIsSharing(true);
			const { shareUrl } = await createSharedSnapshot(snapshot);
			const nextStatus = await shareSnapshotUrl(shareUrl);
			setShareStatus(nextStatus);
			window.setTimeout(() => setShareStatus(""), 2200);
		} catch (err) {
			if (err?.name === "AbortError") return;

			console.error(err);
			setShareStatus("Unable to share right now.");
			window.setTimeout(() => setShareStatus(""), 2200);
		} finally {
			setIsSharing(false);
		}
	};

	return (
		<div className="mb-5 rounded-[28px] border border-emerald-900/10 bg-[linear-gradient(135deg,rgba(232,246,226,0.98),rgba(214,235,204,0.92))] p-5 text-left text-[#17301d] shadow-[0_18px_38px_rgba(35,86,49,0.12)] dark:border-lime-200/15 dark:bg-[linear-gradient(180deg,rgba(23,45,29,0.94),rgba(10,24,15,0.96)),linear-gradient(135deg,rgba(190,242,100,0.12),transparent_45%)] dark:text-[#f4fbf1] dark:shadow-[0_28px_50px_rgba(0,0,0,0.24)]">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="mb-1 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#55734b] dark:text-[#ddefd7]">
						Share Your Wrap
					</p>
					<h2 className="font-['Gotham_Display'] text-[clamp(1.2rem,2vw,1.65rem)] tracking-[-0.04em] text-[#17301d] dark:text-[#f7fff5]">
						Send a snapshot of your top artists and tracks.
					</h2>
					<p className="mt-2 text-sm leading-6 text-[#355240] dark:text-[#d6e8d2]">
						Uses your currently loaded artist and track timeframes.
					</p>
				</div>
				<div className="flex flex-col items-start gap-2 sm:items-end">
					<button
						type="button"
						onClick={shareSnapshot}
						disabled={!canShare || isSharing}
						className="rounded-full border border-emerald-900/10 bg-[#49cc7b] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_26px_rgba(16,32,22,0.18)] transition hover:-translate-y-0.5 hover:bg-[#328f4c] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-[#223a28] dark:text-[#eef6ef] dark:hover:bg-[#2d4b35]"
					>
						{isSharing ? "Creating snapshot..." : "Share snapshot"}
					</button>
					{shareStatus ? (
						<p className="text-sm font-bold text-[#17301d] dark:text-[#eef6ef]">
							{shareStatus}
						</p>
					) : null}
				</div>
			</div>
			<p className="mt-4 text-xs font-semibold text-[#55734b] dark:text-[#ddefd7]">
				* Select a time frame for both artists and tracks to share a snapshot.
			</p>
		</div>
	);
};
