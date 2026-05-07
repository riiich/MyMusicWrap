export const ListTracks = ({ userInfo, loading }) => {
	return (
		<div className="mt-5 flex flex-col gap-4">
			{loading ? (
				<p className="rounded-[18px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 text-left text-[#294734] shadow-[0_18px_32px_rgba(35,86,49,0.12)] dark:border-white/10 dark:bg-white/10 dark:text-[#dfeedd] dark:shadow-none">
					Loading tracks...
				</p>
			) : userInfo?.length === 0 ? (
				<p className="rounded-[18px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 text-left text-[#294734] shadow-[0_18px_32px_rgba(35,86,49,0.12)] dark:border-white/10 dark:bg-white/10 dark:text-[#dfeedd] dark:shadow-none">
					No tracks loaded for this timeframe yet.
				</p>
			) : (
				userInfo?.map((item, i) => (
					<div key={item.id} className="animate-[riseIn_.45s_ease_both]">
						<a
							href={item.trackURL}
							target="_blank"
							rel="noopener noreferrer"
							className="relative flex items-center gap-3 rounded-[24px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 pl-12 text-[#17301d] shadow-[0_18px_34px_rgba(35,86,49,0.14)] transition hover:-translate-y-1.5 hover:shadow-[0_24px_42px_rgba(35,86,49,0.18)] dark:border-white/15 dark:bg-white/10 dark:text-[#f6fff4] dark:shadow-[0_14px_26px_rgba(0,0,0,0.16)] dark:hover:bg-white/15 dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
						>
							<span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/75 text-xs font-bold text-[#17301d] ring-1 ring-emerald-900/10 dark:bg-white/20 dark:text-white dark:ring-white/25">
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
								<p className="block w-full overflow-x-auto whitespace-nowrap pr-1 font-semibold text-[#17301d] [scrollbar-color:rgba(34,84,49,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-900/25 [&::-webkit-scrollbar]:h-1.5 dark:text-[#f6fff4] dark:[scrollbar-color:rgba(255,255,255,0.55)_transparent] dark:[&::-webkit-scrollbar-thumb]:bg-white/55">
									<strong>{item?.title}</strong>
								</p>
								<div className="mt-1 flex w-full flex-wrap gap-[0.1rem] overflow-x-auto whitespace-nowrap text-sm text-[#355240] [scrollbar-color:rgba(34,84,49,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-900/25 [&::-webkit-scrollbar]:h-1.5 dark:text-[#d6e8d2] dark:[scrollbar-color:rgba(255,255,255,0.55)_transparent] dark:[&::-webkit-scrollbar-thumb]:bg-white/55">
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
