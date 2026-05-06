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
					<p className="rounded-[18px] bg-white/10 px-4 py-4 text-left text-white/80">
						Loading recommendations...
					</p>
				) : recommendedTracks?.length === 0 ? (
					<p className="rounded-[18px] bg-white/10 px-4 py-4 text-left text-white/80">
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
									className="relative flex items-center gap-3 rounded-[24px] border border-white/15 bg-white/10 px-4 py-4 pl-12 text-white shadow-[0_14px_26px_rgba(0,0,0,0.16)] transition hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
								>
									<span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white ring-1 ring-white/25">
										{i + 1}
									</span>
									<img
										src={item.image}
										alt="track_img"
										className="h-16 w-16 min-w-16 flex-shrink-0 rounded-[18px] object-cover shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
									/>
									<div className="min-w-0 flex flex-1 flex-col">
										<p className="block w-full overflow-x-auto whitespace-nowrap pr-1 font-semibold text-white [scrollbar-color:rgba(255,255,255,0.55)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/55 [&::-webkit-scrollbar]:h-1.5">
											<strong>{item.track_title}</strong>
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
								<div className="flex min-w-[7rem] flex-col justify-center gap-2">
									<button
										className="rounded-2xl border border-white/25 bg-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/25"
										onClick={() => getURI(item?.uri)}
									>
										Play Song
									</button>
									<button
										className="rounded-2xl border border-white/25 bg-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/25"
										onClick={() => showPlaylistDropdown(item?.uri)}
									>
										Add song
									</button>
									{activePlaylistTrackUri === item?.uri ? (
										<select
											className="w-full rounded-2xl border border-white/25 bg-white/15 px-4 py-3 text-sm font-semibold text-white [&_option]:text-[#102016]"
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
