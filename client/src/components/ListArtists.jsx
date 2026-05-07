export const ListArtists = ({ userInfo, loading }) => {
	return (
		<div className="mt-5 flex flex-col gap-4">
			{loading ? (
				<p className="rounded-[18px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 text-left text-[#294734] shadow-[0_18px_32px_rgba(35,86,49,0.12)] dark:border-white/10 dark:bg-white/10 dark:text-[#dfeedd] dark:shadow-none">
					Loading artists...
				</p>
			) : userInfo?.length === 0 ? (
				<p className="rounded-[18px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 text-left text-[#294734] shadow-[0_18px_32px_rgba(35,86,49,0.12)] dark:border-white/10 dark:bg-white/10 dark:text-[#dfeedd] dark:shadow-none">
					No artists loaded for this timeframe yet.
				</p>
			) : (
				userInfo?.map((item, i) => (
					<div key={i} className="animate-[riseIn_.45s_ease_both]">
						<a
							href={item.artistURL}
							target="_blank"
							rel="noopener noreferrer"
							className="relative flex min-h-[6rem] w-full items-center gap-3 rounded-[24px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 pl-12 text-[#17301d] shadow-[0_18px_34px_rgba(35,86,49,0.14)] transition hover:-translate-y-1.5 hover:shadow-[0_24px_42px_rgba(35,86,49,0.18)] dark:border-white/15 dark:bg-white/10 dark:text-[#f6fff4] dark:shadow-[0_14px_26px_rgba(0,0,0,0.16)] dark:hover:bg-white/15 dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
						>
							<span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/75 text-xs font-bold text-[#17301d] ring-1 ring-emerald-900/10 dark:bg-white/20 dark:text-white dark:ring-white/25">
								{i + 1}
							</span>
							<img
								src={item?.image}
								alt={item.artist}
								width="100"
								height="100"
								className="h-[64px] w-[64px] flex-shrink-0 rounded-[18px] object-cover shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
							/>
							<p className="block min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-left font-semibold text-[#17301d] [scrollbar-color:rgba(34,84,49,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-900/25 [&::-webkit-scrollbar]:h-1.5 dark:text-[#f6fff4] dark:[scrollbar-color:rgba(255,255,255,0.55)_transparent] dark:[&::-webkit-scrollbar-thumb]:bg-white/55">
								{item?.artist}
							</p>
						</a>
					</div>
				))
			)}
		</div>
	);
};
