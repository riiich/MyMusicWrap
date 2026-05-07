import { useState, useEffect } from "react";
import axios from "axios";

export const RecommendedTracks = ({ recommendedTracks, retrieveURI, loading, accessToken, message }) => {
	const [playlists, setPlaylists] = useState([]);
	const [activePlaylistTrackUri, setActivePlaylistTrackUri] = useState("");

	const getUserPlaylists = async () => {
		try {
			const response = await axios.get("http://localhost:3001/myplaylists", {
				params: { accessToken },
			});

			setPlaylists(response.data.playlists);
		} catch (err) {
			console.log(err);
		}
	};

	const showPlaylistDropdown = async (trackURI) => {
		setActivePlaylistTrackUri((currentURI) => (currentURI === trackURI ? "" : trackURI));

		if (accessToken && playlists.length === 0) {
			await getUserPlaylists();
		}
	};

	const addTrackToPlaylist = async (e) => {
		try {
			if (!e.target.value) return;

			const parsedInfo = JSON.parse(e.target.value);
			const selectedPlaylist = {
				playlistId: parsedInfo.playlistId,
				trackURI: parsedInfo.trackURI,
			};

			await axios.post("http://localhost:3001/myplaylists/addToPlaylist", {
				accessToken,
				selectedPlaylistId: selectedPlaylist,
			});
			setActivePlaylistTrackUri("");
		} catch (err) {
			console.log(err);
		}
	};

	const getURI = (uri) => {
		retrieveURI(uri);
	};

	useEffect(() => {
		setActivePlaylistTrackUri("");
	}, [recommendedTracks]);

	return (
		<>
			<div className="mt-5 flex flex-col gap-4">
				{loading ? (
					<p className="rounded-[18px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 text-left text-[#294734] shadow-[0_18px_32px_rgba(35,86,49,0.12)] dark:border-white/10 dark:bg-white/10 dark:text-[#dfeedd] dark:shadow-none">
						Loading recommendations...
					</p>
				) : recommendedTracks?.length === 0 ? (
					<p className="rounded-[18px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 text-left text-[#294734] shadow-[0_18px_32px_rgba(35,86,49,0.12)] dark:border-white/10 dark:bg-white/10 dark:text-[#dfeedd] dark:shadow-none">
						{message || "Choose a track timeframe to load recommendations."}
					</p>
				) : (
					recommendedTracks?.map((item, i) => (
						<div key={item.id} className="animate-[riseIn_.45s_ease_both]">
							<div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
								<a
									href={item.spotify_url}
									target="_blank"
									rel="noopener noreferrer"
									className="relative flex items-center gap-3 rounded-[24px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(232,246,226,0.98),rgba(214,235,204,0.98))] px-4 py-4 pl-12 text-[#17301d] shadow-[0_18px_34px_rgba(35,86,49,0.14)] transition hover:-translate-y-1.5 hover:shadow-[0_24px_42px_rgba(35,86,49,0.18)] dark:border-white/15 dark:bg-white/10 dark:text-[#f6fff4] dark:shadow-[0_14px_26px_rgba(0,0,0,0.16)] dark:hover:bg-white/15 dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
								>
									<span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/75 text-xs font-bold text-[#17301d] ring-1 ring-emerald-900/10 dark:bg-white/20 dark:text-white dark:ring-white/25">
										{i + 1}
									</span>
									<img
										src={item.image}
										alt="track_img"
										className="h-16 w-16 min-w-16 flex-shrink-0 rounded-[18px] object-cover shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
									/>
									<div className="min-w-0 flex flex-1 flex-col">
										<p className="block w-full overflow-x-auto whitespace-nowrap pr-1 font-semibold text-[#17301d] [scrollbar-color:rgba(34,84,49,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-900/25 [&::-webkit-scrollbar]:h-1.5 dark:text-[#f6fff4] dark:[scrollbar-color:rgba(255,255,255,0.55)_transparent] dark:[&::-webkit-scrollbar-thumb]:bg-white/55">
											<strong>{item.track_title}</strong>
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
								<div className="flex min-w-[7rem] flex-col justify-center gap-2">
									<button
										className="rounded-2xl border border-emerald-900/10 bg-white/55 px-4 py-3 text-sm font-semibold text-[#17301d] transition hover:-translate-y-0.5 hover:bg-white/75 dark:border-white/25 dark:bg-white/15 dark:text-[#f7fff5] dark:hover:bg-white/25"
										onClick={() => getURI(item?.uri)}
									>
										Play Song
									</button>
									<button
										className="rounded-2xl border border-emerald-900/10 bg-white/55 px-4 py-3 text-sm font-semibold text-[#17301d] transition hover:-translate-y-0.5 hover:bg-white/75 dark:border-white/25 dark:bg-white/15 dark:text-[#f7fff5] dark:hover:bg-white/25"
										onClick={() => showPlaylistDropdown(item?.uri)}
									>
										Add song
									</button>
									{activePlaylistTrackUri === item?.uri ? (
										<select
											className="w-full rounded-2xl border border-emerald-900/10 bg-white/55 px-4 py-3 text-sm font-semibold text-[#17301d] dark:border-white/25 dark:bg-white/15 dark:text-[#f7fff5] [&_option]:text-[#102016]"
											name="selectedPlaylist"
											onChange={addTrackToPlaylist}
											defaultValue=""
										>
											<option disabled value="">
												Select a playlist...
											</option>
											{playlists?.map((playlist) => (
												<option
													value={JSON.stringify({
														playlistId: playlist?.playlistId,
														trackURI: item?.uri,
													})}
													key={playlist.playlistId}
												>
													{playlist?.playlistName}
												</option>
											))}
										</select>
									) : null}
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</>
	);
};
