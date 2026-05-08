import { GlidingText } from "./GlidingText";

export const ListArtists = ({ userInfo, loading }) => {
	return (
		<div className="mt-5 flex flex-col gap-4">
			{loading ? (
				<p className="rounded-[18px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 text-left text-[#102016] shadow-[0_18px_32px_rgba(35,86,49,0.12)] dark:border-emerald-900/10 dark:shadow-none">
					Loading artists...
				</p>
			) : userInfo?.length === 0 ? (
				<p className="rounded-[18px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 text-left text-[#102016] shadow-[0_18px_32px_rgba(35,86,49,0.12)] dark:border-emerald-900/10 dark:shadow-none">
					No artists loaded for this timeframe yet.
				</p>
			) : (
				userInfo?.map((item, i) => (
					<div
						key={i}
						className="animate-[riseIn_.45s_ease_both]"
						style={{ animationDelay: `${i * 70}ms` }}
					>
						<a
							href={item.artistURL}
							target="_blank"
							rel="noopener noreferrer"
							className="relative flex h-[6.5rem] w-full items-center gap-3 rounded-[24px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 pl-12 text-[#102016] shadow-[0_18px_34px_rgba(35,86,49,0.14)] transition hover:-translate-y-1.5 hover:shadow-[0_24px_42px_rgba(35,86,49,0.18)] dark:border-emerald-900/10 dark:shadow-[0_14px_26px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
						>
							<span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/75 text-xs font-bold text-[#102016] ring-1 ring-emerald-900/10">
								{i + 1}
							</span>
							<img
								src={item?.image}
								alt={item.artist}
								width="100"
								height="100"
								className="h-[64px] w-[64px] flex-shrink-0 rounded-[18px] object-cover shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
							/>
							<GlidingText className="min-w-0 flex-1 text-left font-semibold text-[#102016]">
								{item?.artist}
							</GlidingText>
						</a>
					</div>
				))
			)}
		</div>
	);
};
