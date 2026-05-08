import { Link } from "react-router-dom";
import { decodeSnapshotFromSearch, TIMEFRAME_LABELS } from "../utils/shareSnapshot";

const SnapshotList = ({ title, timeframe, items, renderMeta }) => (
	<section className="rounded-[30px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] p-5 text-[#102016] shadow-[0_24px_48px_rgba(35,86,49,0.12)] dark:border-lime-200/15 dark:bg-[linear-gradient(180deg,rgba(23,45,29,0.94),rgba(10,24,15,0.96))] dark:text-[#f4fbf1] dark:shadow-[0_28px_50px_rgba(0,0,0,0.24)]">
		<p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#55734b] dark:text-[#ddefd7]">
			{timeframe}
		</p>
		<h2 className="font-['Gotham_Display'] text-[clamp(1.35rem,2vw,1.9rem)] tracking-[-0.04em] text-[#17301d] dark:text-[#f7fff5]">
			{title}
		</h2>
		<div className="mt-5 flex flex-col gap-4">
			{items?.length > 0 ? (
				items.map((item, index) => (
					<div
						key={`${item.id || item.name}-${index}`}
						className="relative flex h-[6.5rem] items-center gap-3 rounded-[24px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 pl-12 text-[#102016] shadow-[0_18px_34px_rgba(35,86,49,0.14)] dark:border-emerald-900/10 dark:shadow-[0_14px_26px_rgba(0,0,0,0.16)]"
					>
						<span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/75 text-xs font-bold text-[#102016] ring-1 ring-emerald-900/10">
							{index + 1}
						</span>
						{item.image ? (
							<img
								src={item.image}
								alt={item.name}
								className="h-16 w-16 flex-shrink-0 rounded-[18px] object-cover shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
							/>
						) : null}
						<div className="min-w-0">
							<p className="truncate font-bold text-[#102016]">
								{item.name}
							</p>
							{renderMeta ? (
								<p className="mt-1 truncate text-sm text-[#294734]">
									{renderMeta(item)}
								</p>
							) : null}
						</div>
					</div>
				))
			) : (
				<p className="rounded-[18px] border border-emerald-900/10 bg-white/50 px-4 py-4 text-[#102016]">
					No snapshot items were included.
				</p>
			)}
		</div>
	</section>
);

export const SharedSnapshot = () => {
	const snapshot = decodeSnapshotFromSearch(window.location.search);

	if (!snapshot) {
		return (
			<div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
				<div className="rounded-[2rem] border border-emerald-900/10 bg-[linear-gradient(145deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-8 py-10 shadow-[0_26px_60px_rgba(16,64,30,0.12)]">
					<h1 className="font-['Gotham_Display'] text-3xl text-[#102016]">
						This snapshot link is not valid.
					</h1>
					<Link
						to="/"
						className="mt-6 inline-flex rounded-full bg-[#102016] px-6 py-3 text-sm font-bold text-white"
					>
						Create your own
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
			<div className="mb-6 rounded-[32px] border border-emerald-900/10 bg-[linear-gradient(135deg,rgba(232,246,226,0.98),rgba(214,235,204,0.92))] p-6 text-left shadow-[0_24px_50px_rgba(35,86,49,0.12)] dark:border-lime-200/15 dark:bg-[linear-gradient(135deg,rgba(19,42,27,0.94),rgba(9,18,12,0.96))]">
				<p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#55734b] dark:text-[#ddefd7]">
					Shared MyMusicWrap
				</p>
				<h1 className="font-['Gotham_Display'] text-[clamp(2rem,5vw,4rem)] tracking-[-0.06em] text-[#102016] dark:text-[#f7fff5]">
					{snapshot.userName || "A listener"}'s top listens
				</h1>
				<p className="mt-3 max-w-3xl leading-7 text-[#355240] dark:text-[#d6e8d2]">
					A snapshot of their top artists and tracks from MyMusicWrap.
				</p>
				<Link
					to="/"
					className="mt-5 inline-flex rounded-full bg-[#102016] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1d3a25] dark:bg-[#eef6ef] dark:text-[#102016] dark:hover:bg-white"
				>
					Create your own wrap
				</Link>
			</div>
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
				<SnapshotList
					title="Top Artists"
					timeframe={TIMEFRAME_LABELS[snapshot.artistTimeRange] || "Selected timeframe"}
					items={snapshot.artists}
				/>
				<SnapshotList
					title="Top Tracks"
					timeframe={TIMEFRAME_LABELS[snapshot.trackTimeRange] || "Selected timeframe"}
					items={snapshot.tracks}
					renderMeta={(track) => track.artists?.join(", ")}
				/>
			</div>
		</div>
	);
};
