export const ListArtists = ({ userInfo, loading }) => {
	return (
		<div className="mt-5 flex flex-col gap-4">
			{loading ? (
				<p className="rounded-[18px] bg-white/10 px-4 py-4 text-left text-white/80">
					Loading artists...
				</p>
			) : userInfo?.length === 0 ? (
				<p className="rounded-[18px] bg-white/10 px-4 py-4 text-left text-white/80">
					No artists loaded for this timeframe yet.
				</p>
			) : (
				userInfo?.map((item, i) => (
					<div key={i} className="animate-[riseIn_.45s_ease_both]">
						<a
							href={item.artistURL}
							target="_blank"
							rel="noopener noreferrer"
							className="relative flex min-h-[6rem] w-full items-center gap-3 rounded-[24px] border border-white/15 bg-white/10 px-4 py-4 pl-12 text-white shadow-[0_14px_26px_rgba(0,0,0,0.16)] transition hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
						>
							<span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white ring-1 ring-white/25">
								{i + 1}
							</span>
							<img
								src={item?.image}
								alt={item.artist}
								width="100"
								height="100"
								className="h-[64px] w-[64px] flex-shrink-0 rounded-[18px] object-cover shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
							/>
							<p className="block min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-left font-semibold text-white [scrollbar-color:rgba(255,255,255,0.55)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/55 [&::-webkit-scrollbar]:h-1.5">
								{item?.artist}
							</p>
						</a>
					</div>
				))
			)}
		</div>
	);
};
