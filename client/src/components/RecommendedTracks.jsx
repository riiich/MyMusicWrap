import { useState, useEffect } from "react";
import axios from "axios";

export const RecommendedTracks = ({ recommendedTracks, retrieveURI, loading, accessToken, message }) => {
	const [playlists, setPlaylists] = useState([]);
	const [playlistsExist, setPlaylistExists] = useState(false);
	const [selectedPlaylistId, setSelectedPlaylistId] = useState({ playlistId: null, trackURI: null });

	const plExists = (e, index) => {
		try {
			console.log(playlistsExist);

			setPlaylistExists((prev) => !prev);
			// check to see if the value had any value in it (have to check, otherwise there will be an error relating to json)
			if (e.target.value) {
				const parsedInfo = JSON.parse(e.target.value); // in order to use the json, have to parse it back to object b/c it was stringified json
				setSelectedPlaylistId({
					playlistId: parsedInfo.playlistId,
					trackURI: parsedInfo.trackURI,
				});
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getURI = (uri) => {
		retrieveURI(uri);
	};

	useEffect(() => {
		const getUserPlaylists = async () => {
			try {
				// ******************************************
				// haven't tested it yet, but this vercel one should work now. change it whenever: https://my-music-wrap-server.vercel.app/ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				// ******************************************
				const response = await axios.get("http://localhost:3001/myplaylists", {
					params: { accessToken },
				});

				setPlaylists(response.data.playlists);
				setPlaylistExists(true);
			} catch (err) {
				console.log(err);
			}
		};

		console.log("playlist exists: ", playlistsExist);
		if (accessToken && playlistsExist) {
			getUserPlaylists();
		}
	}, [accessToken, playlistsExist, recommendedTracks]);

	useEffect(() => {
		const addTrackToPlaylist = async () => {
			try {
				await axios.post("http://localhost:3001/myplaylists/addToPlaylist", {
					accessToken,
					selectedPlaylistId,
				});
			} catch (err) {
				console.log(err);
			}
		};

		if (accessToken && !playlistsExist) {
			addTrackToPlaylist();
		}
	}, [accessToken, playlistsExist, selectedPlaylistId]);

	return (
		<>
			<div className="mt-5 flex flex-col gap-4">
				{loading ? (
					<p className="rounded-[18px] bg-white/5 px-4 py-4 text-left text-emerald-50/80">
						Loading recommendations...
					</p>
				) : recommendedTracks?.length === 0 ? (
					<p className="rounded-[18px] bg-white/5 px-4 py-4 text-left text-emerald-50/80">
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
									className="relative flex items-center gap-3 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(243,247,244,0.98),rgba(223,234,226,0.96))] px-4 py-4 pl-12 text-[#102016] shadow-[0_14px_26px_rgba(0,0,0,0.14)] transition hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(34,197,94,0.14)]"
								>
									<span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#22c55e,#86efac)] text-xs font-bold text-[#0a150d]">
										{i + 1}
									</span>
									<img
										src={item.image}
										alt="track_img"
										className="h-16 w-16 min-w-16 flex-shrink-0 rounded-[18px] object-cover shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
									/>
									<div className="min-w-0 flex flex-1 flex-col">
										<p className="block w-full overflow-x-auto whitespace-nowrap pr-1 font-semibold text-[#102016] [scrollbar-color:rgba(34,197,94,0.55)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(34,197,94,0.55)] [&::-webkit-scrollbar]:h-1.5">
											<strong>{item.track_title}</strong>
										</p>
										<div className="mt-1 flex w-full flex-wrap gap-[0.1rem] overflow-x-auto whitespace-nowrap text-sm text-[#486052] [scrollbar-color:rgba(34,197,94,0.55)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(34,197,94,0.55)] [&::-webkit-scrollbar]:h-1.5">
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
										className="rounded-2xl border border-[#102016]/10 bg-white/95 px-4 py-3 text-sm font-semibold text-[#102016] transition hover:-translate-y-0.5 hover:bg-[#e9f8ed]"
										onClick={() => getURI(item?.uri)}
									>
										Play Song
									</button>
									<button
										className="rounded-2xl border border-[#102016]/10 bg-white/95 px-4 py-3 text-sm font-semibold text-[#102016] transition hover:-translate-y-0.5 hover:bg-[#e9f8ed]"
										onClick={(e) => plExists(e, i)}
									>
										Add song
									</button>
									{playlistsExist ? (
										<select
											className="w-full rounded-2xl border border-[#102016]/10 bg-white/95 px-4 py-3 text-sm font-semibold text-[#102016]"
											name="selectedPlaylist"
											onChange={(e) => plExists(e, i)}
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
