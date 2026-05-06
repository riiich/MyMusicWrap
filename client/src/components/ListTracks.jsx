export const ListTracks = ({ userInfo, loading }) => {
	return (
		<div className="mt-5 flex flex-col gap-4">
			{loading ? (
				<p className="rounded-[18px] bg-white/10 px-4 py-4 text-left text-white/80">
					Loading tracks...
				</p>
			) : userInfo?.length === 0 ? (
				<p className="rounded-[18px] bg-white/10 px-4 py-4 text-left text-white/80">
					No tracks loaded for this timeframe yet.
				</p>
			) : (
				userInfo?.map((item, i) => (
					<div key={item.id} className="animate-[riseIn_.45s_ease_both]">
						<a
							href={item.trackURL}
							target="_blank"
							rel="noopener noreferrer"
							className="relative flex items-center gap-3 rounded-[24px] border border-white/15 bg-white/10 px-4 py-4 pl-12 text-white shadow-[0_14px_26px_rgba(0,0,0,0.16)] transition hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
						>
							<span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white ring-1 ring-white/25">
								{i + 1}
							</span>
							<img
								src={item?.image}
								alt="track pic"
								width={55}
								height={55}
								className="h-[55px] w-[55px] rounded-[18px] object-cover shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
							/>
							<div className="min-w-0 flex-1">
								<p className="block w-full overflow-x-auto whitespace-nowrap pr-1 font-semibold text-white [scrollbar-color:rgba(255,255,255,0.55)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/55 [&::-webkit-scrollbar]:h-1.5">
									<strong>{item?.title}</strong>
								</p>
								<div className="mt-1 flex w-full flex-wrap gap-[0.1rem] overflow-x-auto whitespace-nowrap text-sm text-white/75 [scrollbar-color:rgba(255,255,255,0.55)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/55 [&::-webkit-scrollbar]:h-1.5">
									{item?.artists.map((artist) => (
										<p key={artist.id} className="m-0">
											&nbsp;{artist.name}
										</p>
									))}
								</div>
							</div>
						</a>
					</div>
				))
			)}
		</div>
	);
};
