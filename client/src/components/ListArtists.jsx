export const ListArtists = ({ userInfo, loading }) => {
	return (
		<div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
			{loading ? (
				<p className="rounded-[18px] bg-emerald-900/5 px-4 py-4 text-left text-[#486052] dark:bg-white/5 dark:text-lime-50/80">
					Loading artists...
				</p>
			) : userInfo?.length === 0 ? (
				<p className="rounded-[18px] bg-emerald-900/5 px-4 py-4 text-left text-[#486052] dark:bg-white/5 dark:text-lime-50/80">
					No artists loaded for this timeframe yet.
				</p>
			) : (
				userInfo?.map((item, i) => (
					<div key={i} className="animate-[riseIn_.45s_ease_both]">
						<a
							href={item.artistURL}
							target="_blank"
							rel="noopener noreferrer"
							className="relative flex min-h-[13.5rem] w-full flex-col items-start gap-3 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(243,247,244,0.98),rgba(223,234,226,0.96))] p-4 text-[#102016] shadow-[0_14px_26px_rgba(0,0,0,0.14)] transition hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(34,197,94,0.14)]"
						>
							<span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#22c55e,#86efac)] text-xs font-bold text-[#0a150d]">
								{i + 1}
							</span>
							<img
								src={item?.image}
								alt={item.artist}
								width="100"
								height="100"
								className="h-26 w-26 max-w-[6.5rem] rounded-[18px] object-cover shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
							/>
							<p className="block w-full overflow-x-auto whitespace-nowrap text-left font-semibold [scrollbar-color:rgba(34,197,94,0.55)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(34,197,94,0.55)] [&::-webkit-scrollbar]:h-1.5">
								{item?.artist}
							</p>
						</a>
					</div>
				))
			)}
		</div>
	);
};
